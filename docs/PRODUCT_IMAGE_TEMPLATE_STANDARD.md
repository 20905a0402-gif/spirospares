# Product Image Template Standard (v1.0)

This standard defines the exact visual template for all product images used on the website (target: 100 images, all categories).

## 1) Master Output Format

- Canvas size: 3000 x 3000 px
- Resolution metadata: 300 DPI
- Color profile: sRGB (IEC 61966-2-1)
- File format: PNG (lossless)
- Bit depth: 8-bit per channel
- Orientation: square, no rotation metadata

## 2) Background Standard (Soft-Key Studio)

- Background must be seamless, high-key studio style.
- Top and center region (about 90% visual area) must remain pure white:
  - RGB(255, 255, 255)
- Lower foreground region (about 10% visual area) must softly blend to very light gray:
  - RGB(245, 245, 245) target floor tone
- Gradient direction:
  - White concentrated at upper and central frame
  - Smooth transition toward lower edges/foreground
- No hard horizon line, banding, texture, patterns, or visible seams.

## 3) Object Extraction and Placement

- Background removal: mandatory precise mask for every object.
- Object position: centered on both X and Y axes.
- Scaling rule (uniform, no distortion):
  - Object must fit inside an 80% x 80% template box.
  - Longest visible object dimension must be exactly 80% of the canvas.
  - Shorter dimension must be <= 80% while preserving true aspect ratio.
- Clipping: strictly forbidden.

## 4) Lighting, Focus, and Surface Contact

- Lighting: soft, diffuse, uniform high-key look.
- Color fidelity: no hue shifts, clipping, or over-saturation.
- Focus: edge-to-edge sharpness on the product body.
- Shadow: subtle natural grounding contact shadow under product:
  - Soft ellipse, low opacity, feathered edges
  - Must anchor object without looking detached or harsh

## 5) Visual Tone Requirements

- Clean, premium, minimalist, professional e-commerce look.
- No props, labels, text overlays, watermarks, borders, reflections, or extra objects.
- No color cast in background whites.

## 6) Compliance Tolerances (Automated QA)

- Canvas: exactly 3000 x 3000 px
- Subject fill target box: 80.0% with tolerance +/-0.5%
- Center alignment tolerance: +/-1.0% from exact center on each axis
- Background floor tone at bottom band: RGB 245 +/- 3 (all channels)
- File profile: sRGB only

## 7) Category Coverage

This exact template applies equally to all object categories:

- Bikes
- Spare parts
- Gadgets / accessories
- Any new product category added later

## 8) Processing Contract

All production assets must pass through the automated templating pipeline before publication. The pipeline enforces:

1. Background removal
2. Subject scaling and centering
3. Soft white-to-light-gray studio background generation
4. Contact shadow generation
5. Final export and compliance report
