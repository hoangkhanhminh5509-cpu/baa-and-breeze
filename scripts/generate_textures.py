import os
import numpy as np
from PIL import Image

OUT_DIR = os.environ.get("OUT_DIR", "./public/textures")
os.makedirs(OUT_DIR, exist_ok=True)


def make_paper_grain(width=1920, height=1080, seed=42):
    rng = np.random.default_rng(seed)
    fine = rng.normal(0.0, 1.0, (height, width)).astype(np.float32)

    med_small = rng.normal(0.0, 1.0, (height // 4, width // 4)).astype(np.float32)
    med_img = Image.fromarray(((med_small * 0.25 + 0.5).clip(0, 1) * 255).astype(np.uint8))
    med = (np.asarray(med_img.resize((width, height), Image.Resampling.BILINEAR), dtype=np.float32) / 255.0 - 0.5) * 4.0

    coarse_small = rng.normal(0.0, 1.0, (height // 16 + 1, width // 16 + 1)).astype(np.float32)
    coarse_img = Image.fromarray(((coarse_small * 0.25 + 0.5).clip(0, 1) * 255).astype(np.uint8))
    coarse = (np.asarray(coarse_img.resize((width, height), Image.Resampling.BICUBIC), dtype=np.float32) / 255.0 - 0.5) * 4.0

    fiber_h = rng.normal(0.0, 1.0, (height, width // 8)).astype(np.float32)
    fiber_img = Image.fromarray(((fiber_h * 0.25 + 0.5).clip(0, 1) * 255).astype(np.uint8))
    fiber = (np.asarray(fiber_img.resize((width, height), Image.Resampling.BILINEAR), dtype=np.float32) / 255.0 - 0.5) * 4.0

    combined = fine * 0.45 + med * 0.35 + coarse * 0.25 + fiber * 0.25

    base_r = np.clip(248 + combined * 7.5, 215, 255).astype(np.uint8)
    base_g = np.clip(245 + combined * 7.2, 210, 255).astype(np.uint8)
    base_b = np.clip(236 + combined * 7.0, 200, 252).astype(np.uint8)

    y_norm = np.linspace(-1.0, 1.0, height, dtype=np.float32)[:, None]
    x_norm = np.linspace(-1.0, 1.0, width, dtype=np.float32)[None, :]
    vignette = 1.0 - 0.045 * (x_norm**2 * 0.7 + y_norm**2 * 0.9)

    rgb = np.stack([
        np.clip(base_r * vignette, 0, 255).astype(np.uint8),
        np.clip(base_g * vignette, 0, 255).astype(np.uint8),
        np.clip(base_b * vignette, 0, 255).astype(np.uint8),
    ], axis=-1)

    img = Image.fromarray(rgb, mode="RGB")
    out_path = os.path.join(OUT_DIR, "paper-grain.png")
    img.save(out_path, optimize=True)
    print(f"Saved {out_path} ({width}x{height})")


def make_crayon_tooth(width=1920, height=1080, seed=99):
    """Full-HD 16:9 RGBA crayon tooth grain for authentic wax-pastel texture on shapes."""
    rng = np.random.default_rng(seed)
    grain = rng.normal(0.0, 1.0, (height, width)).astype(np.float32)
    clump = rng.normal(0.0, 1.0, (height // 2, width // 2)).astype(np.float32)
    clump_up = np.repeat(np.repeat(clump, 2, axis=0), 2, axis=1)
    tex = grain * 0.55 + clump_up * 0.55

    r = np.full((height, width), 246, dtype=np.uint8)
    g = np.full((height, width), 240, dtype=np.uint8)
    b = np.full((height, width), 225, dtype=np.uint8)
    alpha = np.clip((tex - 0.25) * 42.0, 0, 58).astype(np.uint8)

    rgba = np.stack([r, g, b, alpha], axis=-1)
    img = Image.fromarray(rgba, mode="RGBA")
    out_path = os.path.join(OUT_DIR, "crayon-tooth.png")
    img.save(out_path, optimize=True)
    print(f"Saved {out_path} ({width}x{height})")


if __name__ == "__main__":
    make_paper_grain()
    make_crayon_tooth()
