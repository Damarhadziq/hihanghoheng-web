from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]

GALLERY_SOURCES = {
    "mockup-landing": "src/assets/mockup-testing-landing.png",
    "mockup-16-9": "src/assets/mockup-testing-16-9.png",
    "hero": "src/assets/hero.png",
    "team-damar": "src/assets/team-originals/damar.jpg",
    "team-faruq": "src/assets/team-originals/faruq.jpg",
    "team-febi": "src/assets/team-originals/febi.jpg",
    "team-hover-green": "src/assets/team-originals/hover-green.jpg",
    "team-hover-pink": "src/assets/team-originals/hover-pink.jpg",
}

TEAM_SOURCES = {
    "damar": "src/assets/team-originals/damar.jpg",
    "faruq": "src/assets/team-originals/faruq.jpg",
    "febi": "src/assets/team-originals/febi.jpg",
    "hover-green": "src/assets/team-originals/hover-green.jpg",
    "hover-pink": "src/assets/team-originals/hover-pink.jpg",
}

PROJECT_SOURCES = {
    "mockup-landing-1200": ("src/assets/mockup-testing-landing.png", 1200, 78),
    "mockup-16-9-1600": ("src/assets/mockup-testing-16-9.png", 1600, 80),
}


def save_webp(source, destination, max_side, quality):
    image = ImageOps.exif_transpose(Image.open(ROOT / source))
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA" if "transparency" in image.info or "A" in image.getbands() else "RGB")
    image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)

    output = ROOT / destination
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "WEBP", quality=quality, method=6)


def main():
    for name, source in GALLERY_SOURCES.items():
        save_webp(source, f"public/optimized/gallery/{name}.webp", 560, 72)

    for name, source in TEAM_SOURCES.items():
        save_webp(source, f"public/optimized/team/{name}.webp", 900, 78)

    for name, (source, max_side, quality) in PROJECT_SOURCES.items():
        save_webp(source, f"public/optimized/projects/{name}.webp", max_side, quality)


if __name__ == "__main__":
    main()
