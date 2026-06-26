from PIL import Image, ImageDraw, ImageFont
import os
import random

project_dir = "/Volumes/OpenClawDrive/.hermes/workspace/md2wechat-skill"
assets_dir = os.path.join(project_dir, "docs/assets")
os.makedirs(assets_dir, exist_ok=True)

WIDTH = 1080
HEIGHT = 1920

BG_COLOR = (15, 23, 42)
PRIMARY_COLOR = (59, 130, 246)
ACCENT_COLOR = (34, 211, 238)
TEXT_COLOR = (248, 250, 252)
SECONDARY_TEXT = (148, 163, 184)

FONT_PATH = "/System/Library/Fonts/STHeiti Medium.ttc"

def load_font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except:
        return ImageFont.load_default()

img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Top gradient bar
for i in range(60):
    draw.rectangle([(0, i*2), (WIDTH, i*2+4)], fill=PRIMARY_COLOR)

# Decorative particles
random.seed(42)
for _ in range(25):
    x = random.randint(50, WIDTH-50)
    y = random.randint(HEIGHT//3, HEIGHT-300)
    r = random.randint(2, 4)
    draw.ellipse([x-r, y-r, x+r, y+r], fill=(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2], 40))

# Fonts
font_title = load_font(88)
font_sub = load_font(72)
font_small = load_font(28)
font_tag = load_font(24)

# Main title line 1
title1 = "用 Markdown 写公众号"
b1 = draw.textbbox((0, 0), title1, font=font_title)
w1 = b1[2] - b1[0]
draw.text(((WIDTH - w1)//2, HEIGHT//3 - 60), title1, fill=TEXT_COLOR, font=font_title)

# Main title line 2
title2 = "像发朋友圈一样简单"
b2 = draw.textbbox((0, 0), title2, font=font_sub)
w2 = b2[2] - b2[0]
draw.text(((WIDTH - w2)//2, HEIGHT//3 + 50), title2, fill=ACCENT_COLOR, font=font_sub)

# Divider line
lx = (WIDTH - 200)//2
draw.rectangle([(lx, HEIGHT//3 + 150), (lx+200, HEIGHT//3+153)], fill=PRIMARY_COLOR)

# Description
desc = "一行命令 \u2192 精美排版 \u2192 自动发到草稿箱"
bd = draw.textbbox((0, 0), desc, font=font_small)
wd = bd[2] - bd[0]
draw.text(((WIDTH - wd)//2, HEIGHT//3 + 180), desc, fill=SECONDARY_TEXT, font=font_small)

# Tags
tags = ["#Markdown", "#公众号排版", "#效率工具", "#AI写作"]
tag_y = HEIGHT - 300
total_w = sum(draw.textbbox((0,0), t, font=font_tag)[2] for t in tags) + 40*(len(tags)-1)
cx = (WIDTH - total_w)//2
for tag in tags:
    tb = draw.textbbox((0,0), tag, font=font_tag)
    tw = tb[2]
    draw.rounded_rectangle([cx-10, tag_y-8, cx+tw+10, tag_y+28], radius=8, fill=(59, 130, 246, 60))
    draw.text((cx, tag_y), tag, fill=TEXT_COLOR, font=font_tag)
    cx += tw + 40

# GitHub link
gh = "github.com/geekjourneyx/md2wechat-skill"
gb = draw.textbbox((0,0), gh, font=font_small)
gw = gb[2]
draw.text(((WIDTH-gw)//2, HEIGHT-100), gh, fill=SECONDARY_TEXT, font=font_small)

# Save
cover_path = os.path.join(assets_dir, "cover.png")
img.save(cover_path, "PNG")
print(f"Cover generated: {cover_path}")
