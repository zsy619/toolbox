from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1920

# 字体路径 - 优先用系统字体
FONT_PATHS = [
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/STHeiti Light.ttc",
]
fp = None
for p in FONT_PATHS:
    if os.path.exists(p):
        fp = p
        break

print(f"Using font: {fp}")

img = Image.new('RGB', (W, H), '#0F172A')
d = ImageDraw.Draw(img)

# 渐变背景
for y in range(H):
    t = y / H
    r = int(15 + t * 20)
    g = int(23 + t * 15)
    b = int(42 + t * 30)
    d.line([(0, y), (W, y)], fill=(r, g, b))

X = W // 2

def get_font(size):
    try:
        return ImageFont.truetype(fp, size)
    except:
        return ImageFont.load_default()

F_title = get_font(120)
F_sub   = get_font(60)
F_tag   = get_font(40)
F_bdg   = get_font(36)
F_url   = get_font(22)

def draw_centered_badge(draw, bx, by, bw, bh, text, font, bg_color, text_color):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    text_x = bx + (bw - tw) // 2
    text_y = by + (bh - th) // 2
    draw.rounded_rectangle([bx, by, bx+bw, by+bh], bh//2, fill=bg_color)
    draw.text((text_x, text_y), text, fill=text_color, font=font)

# ========== 垂直居中布局 ==========
badge_h      = 80
title_h      = 140
sub_h        = 70
line_h       = 30
tag_h        = 90
tag_gap_y    = 40
tag_rows     = 1
tag_cols     = 3
tag_w        = 300
tag_gap_x    = 50
bottom_bdg_h = 70
url_h        = 40

total_h = (
    badge_h + 50 + title_h + 10 + title_h + 25 + sub_h + 25 + line_h + 40 +
    (tag_h * tag_rows) + (tag_gap_y * (tag_rows - 1)) + 50 +
    bottom_bdg_h + 70 + url_h
)

Y = (H - total_h) // 2

# 1. 顶部徽章
t = "Claude Code Skill"
bbox = d.textbbox((0, 0), t, font=F_bdg)
bw = (bbox[2]-bbox[0]) + 80
bh = badge_h
draw_centered_badge(d, X-bw//2, Y, bw, bh, t, F_bdg, (37, 99, 235), (255,255,255))
Y += badge_h + 50

# 2. 主标题 Obsidian
t = "Obsidian"
bbox = d.textbbox((0, 0), t, font=F_title)
d.text((X-bbox[2]//2, Y), t, fill=(255,255,255), font=F_title)
Y += title_h + 10

# 3. Second Brain (accent)
t = "Second Brain"
bbox = d.textbbox((0, 0), t, font=F_title)
d.text((X-bbox[2]//2, Y), t, fill=(34,211,238), font=F_title)
Y += title_h + 25

# 4. 分割线
d.line([(X-160, Y+15), (X+160, Y+15)], fill=(34,211,238), width=3)
Y += line_h + 40

# 5. 副标题
t = "让你的笔记库活过来"
bbox = d.textbbox((0, 0), t, font=F_sub)
d.text((X-bbox[2]//2, Y), t, fill=(148,163,184), font=F_sub)
Y += sub_h + 40

# 6. 标签网格
tags = [
    ("🤖", "AI"),
    ("📚", "知识管理"),
    ("⚡", "Claude"),
]
grid_w = tag_w * tag_cols + tag_gap_x * (tag_cols - 1)
gx = X - grid_w // 2
tag_y_start = Y

for i, (e, txt) in enumerate(tags):
    row = i // tag_cols
    col = i % tag_cols
    full = e + " " + txt
    bbox = d.textbbox((0, 0), full, font=F_tag)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    tx = gx + col * (tag_w + tag_gap_x)
    ty = tag_y_start + row * (tag_h + tag_gap_y)
    text_x = tx + (tag_w - tw)//2
    text_y = ty + (tag_h - th)//2
    d.rounded_rectangle([tx, ty, tx+tag_w, ty+tag_h], 16, outline=(34,211,238), width=2)
    d.text((text_x, text_y), full, fill=(255,255,255), font=F_tag)

grid_h = tag_h * tag_rows + tag_gap_y * (tag_rows - 1)
Y = tag_y_start + grid_h + 50

# 7. 底部徽章
t = "github.com/eugeniughelbur/obsidian-second-brain"
bbox = d.textbbox((0, 0), t, font=F_bdg)
bw = (bbox[2]-bbox[0]) + 80
bh = bottom_bdg_h
draw_centered_badge(d, X-bw//2, Y, bw, bh, t, F_bdg, (124, 58, 237), (255,255,255))
Y += bottom_bdg_h + 70

# 8. 底部文案
t = "你的笔记是护城河"
bbox = d.textbbox((0, 0), t, font=F_url)
d.text((X-bbox[2]//2, H-60), t, fill=(100,116,139), font=F_url)

OUT = "/Users/zhushuyan/.openclaw/workspace/obsidian-second-brain-video/docs/assets/cover.png"
img.save(OUT)
print(f"Cover saved: {OUT}")
