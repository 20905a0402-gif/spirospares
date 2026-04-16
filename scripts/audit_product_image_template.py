from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Audit processed product images for template compliance."
    )
    parser.add_argument(
        "--report",
        type=Path,
        default=Path("public/images/.product-image-template-report.json"),
        help="Path to pipeline JSON report",
    )
    parser.add_argument("--canvas", type=int, default=3000, help="Expected canvas size")
    return parser.parse_args()


def audit_image(path: Path, canvas: int) -> dict[str, object]:
    with Image.open(path) as image:
        rgb = image.convert("RGB")
        width, height = rgb.size
        data = np.asarray(rgb)
        y0 = int(height * 0.90)
        y1 = height
        x_left0, x_left1 = 0, int(width * 0.08)
        x_right0, x_right1 = int(width * 0.92), width
        left_patch = data[y0:y1, x_left0:x_left1, :]
        right_patch = data[y0:y1, x_right0:x_right1, :]
        corners = np.concatenate((left_patch.reshape(-1, 3), right_patch.reshape(-1, 3)), axis=0)
        bottom_mean = corners.mean(axis=0)

        icc_ok = "icc_profile" in image.info and bool(image.info.get("icc_profile"))

    return {
        "width": width,
        "height": height,
        "canvas_ok": width == canvas and height == canvas,
        "bottom_r": float(bottom_mean[0]),
        "bottom_g": float(bottom_mean[1]),
        "bottom_b": float(bottom_mean[2]),
        "bottom_tone_ok": all(242.0 <= c <= 248.0 for c in bottom_mean),
        "icc_ok": icc_ok,
    }


def main() -> None:
    args = parse_args()
    report_path = args.report.resolve()

    if not report_path.exists():
        raise FileNotFoundError(f"Template report not found: {report_path}")

    payload = json.loads(report_path.read_text(encoding="utf-8"))
    images = payload.get("images", [])

    failures: list[str] = []

    for item in images:
        out = Path(item["output"])
        if not out.exists():
            failures.append(f"Missing output file: {out}")
            continue

        info = audit_image(out, args.canvas)

        if not info["canvas_ok"]:
            failures.append(f"Canvas mismatch: {out}")

        if not info["bottom_tone_ok"]:
            failures.append(
                f"Background tone mismatch: {out} (bottom mean RGB={info['bottom_r']:.2f},{info['bottom_g']:.2f},{info['bottom_b']:.2f})"
            )

        if not info["icc_ok"]:
            failures.append(f"Missing sRGB ICC profile: {out}")

        longest_fill = float(item["longest_fill"])
        if not (0.795 <= longest_fill <= 0.805):
            failures.append(f"Subject longest fill out of tolerance: {out} ({longest_fill:.4f})")

        delta_x = abs(float(item["center_delta_x"]))
        delta_y = abs(float(item["center_delta_y"]))
        if delta_x > 0.01 or delta_y > 0.01:
            failures.append(f"Center offset out of tolerance: {out} (dx={delta_x:.4f}, dy={delta_y:.4f})")

    print(f"Audited images: {len(images)}")
    if failures:
        print(f"FAILED checks: {len(failures)}")
        for failure in failures:
            print(f"- {failure}")
        raise SystemExit(1)

    print("All images passed template compliance checks.")


if __name__ == "__main__":
    main()
