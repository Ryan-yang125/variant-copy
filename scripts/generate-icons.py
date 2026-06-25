#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SIZES = (16, 32, 48, 128)


def scaled(points, scale):
    return [(x * scale, y * scale) for x, y in points]


def draw_icon(size):
    scale = size / 128
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    black = (32, 32, 32, 255)
    white = (255, 255, 255, 255)

    def xy(values):
        return tuple(round(v * scale) for v in values)

    draw.rounded_rectangle(xy((8, 8, 120, 120)), radius=round(28 * scale), fill=white, outline=black, width=max(1, round(8 * scale)))
    draw.rounded_rectangle(xy((26, 35, 94, 103)), radius=round(16 * scale), fill=black)
    draw.rounded_rectangle(xy((34, 24, 102, 92)), radius=round(16 * scale), fill=white, outline=black, width=max(1, round(8 * scale)))

    line_width = max(2, round(9 * scale))
    draw.line(scaled([(49, 43), (64.2, 74.5), (69.8, 74.5), (87, 43)], scale), fill=black, width=line_width, joint="curve")
    draw.line(scaled([(52, 88), (84, 88)], scale), fill=black, width=max(2, round(8 * scale)))

    return img


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        draw_icon(size).save(ASSETS / f"icon-{size}.png")


if __name__ == "__main__":
    main()
