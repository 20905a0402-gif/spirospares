from __future__ import annotations

import argparse
import io
import json
from collections import deque
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

import numpy as np
from PIL import Image, ImageCms, ImageFilter
from rembg import new_session, remove

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"}


@dataclass
class TemplateConfig:
    canvas_px: int = 3000
    subject_fill: float = 0.80
    background_floor_rgb: int = 245
    gradient_start_y: float = 0.78
    shadow_opacity: float = 0.16
    shadow_height_ratio: float = 0.22
    shadow_blur_ratio: float = 0.018
    rembg_model: str = "u2netp"


@dataclass
class ProcessedImageReport:
    source: str
    output: str
    subject_fill_x: float
    subject_fill_y: float
    longest_fill: float
    center_delta_x: float
    center_delta_y: float


def get_srgb_profile_bytes() -> bytes | None:
    try:
        profile = ImageCms.createProfile("sRGB")
        return ImageCms.ImageCmsProfile(profile).tobytes()
    except Exception:
        return None


def generate_background(size: int, floor_rgb: int, gradient_start_y: float) -> Image.Image:
    y = np.linspace(0.0, 1.0, size, dtype=np.float32).reshape(size, 1)
    transition = np.clip((y - gradient_start_y) / max(1e-6, 1.0 - gradient_start_y), 0.0, 1.0)
    curve = np.power(transition, 1.6)
    values = 255.0 - (255.0 - floor_rgb) * curve
    band = np.repeat(values, size, axis=1).astype(np.uint8)
    rgb = np.stack([band, band, band], axis=2)
    return Image.fromarray(rgb, mode="RGB")


def remove_background_precise(source: Image.Image) -> Image.Image:
    payload = io.BytesIO()
    source.save(payload, format="PNG")
    masked = remove(payload.getvalue())
    result = Image.open(io.BytesIO(masked)).convert("RGBA")
    return result


def remove_background_border_fallback(source: Image.Image) -> Image.Image:
    rgb = np.asarray(source.convert("RGB"), dtype=np.uint8)
    h, w, _ = rgb.shape
    near_white = (rgb[:, :, 0] >= 245) & (rgb[:, :, 1] >= 245) & (rgb[:, :, 2] >= 245)

    visited = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        if near_white[0, x]:
            queue.append((0, x))
        if near_white[h - 1, x]:
            queue.append((h - 1, x))
    for y in range(h):
        if near_white[y, 0]:
            queue.append((y, 0))
        if near_white[y, w - 1]:
            queue.append((y, w - 1))

    while queue:
        y, x = queue.popleft()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x] or not near_white[y, x]:
            continue
        visited[y, x] = True
        queue.append((y - 1, x))
        queue.append((y + 1, x))
        queue.append((y, x - 1))
        queue.append((y, x + 1))

    alpha = np.where(visited, 0, 255).astype(np.uint8)
    alpha = np.asarray(Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(radius=1.0)))

    rgba = np.asarray(source.convert("RGBA"), dtype=np.uint8)
    rgba[:, :, 3] = alpha
    return Image.fromarray(rgba, mode="RGBA")


def isolate_subject(source: Image.Image, session: object | None) -> Image.Image:
    if session is not None:
        try:
            payload = io.BytesIO()
            source.save(payload, format="PNG")
            masked = remove(payload.getvalue(), session=session)
            return Image.open(io.BytesIO(masked)).convert("RGBA")
        except Exception:
            pass

    return remove_background_border_fallback(source)


def trim_to_subject(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("No visible subject detected after background removal.")
    return image.crop(bbox)


def build_shadow_layer(
    canvas_size: int,
    subject_alpha: Image.Image,
    x: int,
    y: int,
    config: TemplateConfig,
) -> Image.Image:
    shadow_h = max(8, int(subject_alpha.height * config.shadow_height_ratio))
    shadow = subject_alpha.resize((subject_alpha.width, shadow_h), Image.Resampling.BICUBIC)
    blur = max(6, int(canvas_size * config.shadow_blur_ratio))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=blur))
    shadow = shadow.point(lambda p: int(p * config.shadow_opacity))

    layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    shadow_y = min(canvas_size - shadow_h, y + subject_alpha.height - int(shadow_h * 0.35))
    layer.paste((0, 0, 0, 255), (x, shadow_y), shadow)
    return layer


def iter_image_files(folder: Path) -> Iterable[Path]:
    for path in sorted(folder.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield path


def process_one_image(
    src_path: Path,
    src_root: Path,
    out_root: Path,
    config: TemplateConfig,
    icc_profile: bytes | None,
    rembg_session: object | None,
) -> ProcessedImageReport:
    source = Image.open(src_path).convert("RGBA")
    isolated = isolate_subject(source, rembg_session)
    subject = trim_to_subject(isolated)

    max_box = int(config.canvas_px * config.subject_fill)
    scale = min(max_box / subject.width, max_box / subject.height)
    new_w = max(1, int(round(subject.width * scale)))
    new_h = max(1, int(round(subject.height * scale)))
    resized = subject.resize((new_w, new_h), Image.Resampling.LANCZOS)

    x = (config.canvas_px - new_w) // 2
    y = (config.canvas_px - new_h) // 2

    background = generate_background(
        size=config.canvas_px,
        floor_rgb=config.background_floor_rgb,
        gradient_start_y=config.gradient_start_y,
    ).convert("RGBA")

    alpha = resized.getchannel("A")
    shadow_layer = build_shadow_layer(config.canvas_px, alpha, x, y, config)

    composited = Image.alpha_composite(background, shadow_layer)
    composited.alpha_composite(resized, dest=(x, y))

    relative = src_path.relative_to(src_root)
    out_path = out_root / relative
    out_path = out_path.with_suffix(".png")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    save_kwargs = {
        "format": "PNG",
        "dpi": (300, 300),
        "optimize": True,
    }
    if icc_profile is not None:
        save_kwargs["icc_profile"] = icc_profile

    composited.convert("RGB").save(out_path, **save_kwargs)

    cx_subject = x + new_w / 2
    cy_subject = y + new_h / 2
    cx_canvas = config.canvas_px / 2
    cy_canvas = config.canvas_px / 2

    return ProcessedImageReport(
        source=str(src_path.as_posix()),
        output=str(out_path.as_posix()),
        subject_fill_x=new_w / config.canvas_px,
        subject_fill_y=new_h / config.canvas_px,
        longest_fill=max(new_w, new_h) / config.canvas_px,
        center_delta_x=(cx_subject - cx_canvas) / config.canvas_px,
        center_delta_y=(cy_subject - cy_canvas) / config.canvas_px,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Apply a strict product image template across all website product images."
    )
    parser.add_argument("--source", type=Path, default=Path("images"), help="Source image root")
    parser.add_argument("--output", type=Path, default=Path("public/images"), help="Output image root")
    parser.add_argument(
        "--report",
        type=Path,
        default=Path("public/images/.product-image-template-report.json"),
        help="JSON report output path",
    )
    parser.add_argument(
        "--rembg-model",
        type=str,
        default="u2netp",
        help="rembg model name (u2netp is smaller/faster to fetch)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    source_root = args.source.resolve()
    output_root = args.output.resolve()
    report_path = args.report.resolve()

    if not source_root.exists():
        raise FileNotFoundError(f"Source folder not found: {source_root}")

    config = TemplateConfig()
    config.rembg_model = args.rembg_model
    icc_profile = get_srgb_profile_bytes()
    rembg_session = None

    try:
        rembg_session = new_session(config.rembg_model)
        print(f"Using rembg model: {config.rembg_model}")
    except Exception as err:
        print(f"rembg unavailable ({err}); using border-mask fallback.")

    reports: list[ProcessedImageReport] = []
    files = list(iter_image_files(source_root))

    if not files:
        raise RuntimeError("No supported source images were found.")

    for path in files:
        report = process_one_image(path, source_root, output_root, config, icc_profile, rembg_session)
        reports.append(report)
        print(f"Processed: {path}")

    report_payload = {
        "template_version": "1.0",
        "config": asdict(config),
        "total_images": len(reports),
        "images": [asdict(item) for item in reports],
    }

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report_payload, indent=2), encoding="utf-8")

    print(f"Completed {len(reports)} images.")
    print(f"Report written to: {report_path}")


if __name__ == "__main__":
    main()
