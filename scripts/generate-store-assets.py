#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "product-demo.png"
ICON = ROOT / "assets" / "icon-128.png"
OUT = ROOT / "chrome-web-store" / "assets"


def cover_resize(image, size, anchor_y=0.0):
    target_w, target_h = size
    src_w, src_h = image.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        crop_w = int(src_h * target_ratio)
        left = (src_w - crop_w) // 2
        box = (left, 0, left + crop_w, src_h)
    else:
        crop_h = int(src_w / target_ratio)
        top = int((src_h - crop_h) * anchor_y)
        box = (0, top, src_w, top + crop_h)

    return image.crop(box).resize(size, Image.Resampling.LANCZOS)


def rounded_rectangle(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_copy_tile(size):
    w, h = size
    img = Image.new("RGB", size, "#f4f1e8")
    draw = ImageDraw.Draw(img)

    rounded_rectangle(draw, (28, 26, w - 28, h - 26), 26, "#fffdf7", "#222222", 4)
    rounded_rectangle(draw, (68, 75, w - 68, h - 72), 18, "#ece8dc", "#d4d0c5", 2)
    rounded_rectangle(draw, (96, 108, w - 150, h - 114), 10, "#ffffff", "#202020", 3)

    for i in range(4):
        x = 124 + i * 34
        draw.line((x, 130, x + 22, 130), fill="#202020", width=3)
        draw.line((x, 144, x + 18, 144), fill="#5f5f5f", width=2)

    copy_x = w - 135
    copy_y = 76
    rounded_rectangle(draw, (copy_x, copy_y, copy_x + 56, copy_y + 56), 12, "#202020")
    draw.line((copy_x + 18, copy_y + 29, copy_x + 27, copy_y + 38, copy_x + 41, copy_y + 18), fill="#79efad", width=5)

    bookmark_x = copy_x + 72
    draw.polygon(
        [
            (bookmark_x + 12, copy_y + 8),
            (bookmark_x + 42, copy_y + 8),
            (bookmark_x + 42, copy_y + 48),
            (bookmark_x + 27, copy_y + 38),
            (bookmark_x + 12, copy_y + 48),
        ],
        fill="#ffffff",
    )

    icon = Image.open(ICON).convert("RGBA").resize((64, 64), Image.Resampling.LANCZOS)
    img.paste(icon, (42, 40), icon)
    return img


def draw_marquee(size):
    w, h = size
    img = Image.new("RGB", size, "#f4f1e8")
    draw = ImageDraw.Draw(img)

    rounded_rectangle(draw, (76, 72, w - 76, h - 72), 42, "#fffdf7", "#202020", 6)
    icon = Image.open(ICON).convert("RGBA").resize((132, 132), Image.Resampling.LANCZOS)
    img.paste(icon, (142, 130), icon)

    for index, y in enumerate((172, 224, 276)):
        draw.line((330, y, 770 - index * 80, y), fill="#202020", width=12)
        draw.line((330, y + 28, 660 - index * 72, y + 28), fill="#77746a", width=7)

    card_x = w - 450
    card_y = 138
    rounded_rectangle(draw, (card_x, card_y, card_x + 270, card_y + 190), 24, "#ece8dc", "#d4d0c5", 3)
    rounded_rectangle(draw, (card_x + 40, card_y + 52, card_x + 170, card_y + 118), 12, "#ffffff", "#202020", 4)
    for i in range(3):
        draw.line((card_x + 62, card_y + 73 + i * 18, card_x + 145, card_y + 73 + i * 18), fill="#202020", width=4)

    copy_x = card_x + 210
    copy_y = card_y + 36
    rounded_rectangle(draw, (copy_x, copy_y, copy_x + 78, copy_y + 78), 17, "#202020")
    draw.line((copy_x + 24, copy_y + 41, copy_x + 38, copy_y + 55, copy_x + 58, copy_y + 26), fill="#79efad", width=8)

    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    cover_resize(source, (1280, 800), anchor_y=0.0).save(OUT / "screenshot-1280x800.png")
    draw_copy_tile((440, 280)).save(OUT / "promo-small-440x280.png")
    draw_marquee((1400, 560)).save(OUT / "promo-marquee-1400x560.png")


if __name__ == "__main__":
    main()
