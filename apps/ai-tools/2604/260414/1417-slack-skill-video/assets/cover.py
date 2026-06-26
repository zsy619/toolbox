from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1080, 1920
fp = "/System/Library/Fonts/STHeiti Medium.ttc"

img = Image.new('RGB', (W, H), '#0F172A')
d = ImageDraw.Draw(img)

# 渐变背景
for y in range(H):
    ratio = y / H
    r = int(15 + ratio * 20)
    g = int(23 + ratio * 15)
    b = int(42 + ratio * 30)
    d.line([(0, y), (W, y)], fill=(r, g, b))

X = W // 2

def draw_centered_badge(draw, bx, by, bw, bh, text, font, bg_color, text_color):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    text_x = bx + (bw - tw) // 2
    text_y = by + (bh - th) // 2
    draw.rounded_rectangle([bx, by, bx+bw, by+bh], bh//2, fill=bg_color)
    draw.text((text_x, text_y), text, fill=text_color, font=font)

F = {
    'title': ImageFont.truetype(fp, 150),
    'sub': ImageFont.truetype(fp, 55),
    'tag': ImageFont.truetype(fp, 42),
    'bdg': ImageFont.truetype(fp, 36),
    'url': ImageFont.truetype(fp, 22),
}

# ========== 垂直居中布局 ==========
badge_h = 80
title_h = 160
sub_h = 70
line_h = 40
tag_h = 100
tag_gap_y = 50
bottom_badge_h = 80
url_h = 40
tag_cols = 2

tags = [
    ("👍", "添加表情回应"),
    ("📌", "消息置顶操作"),
    ("💬", "频道私信支持"),
    ("⚡", "即时快捷反馈"),
]

total_h = (
    badge_h + 60 + title_h + 30 + sub_h + 30 + line_h + 40 +
    (tag_h * 2) + (tag_gap_y * 1) + 60 +
    bottom_badge_h + 80 + url_h
)

Y = (H - total_h) // 2

# 1. 顶部徽章
t = "💬 消息控制"
bbox = d.textbbox((0, 0), t, font=F['bdg'])
bw = (bbox[2]-bbox[0]) + 90
bh = badge_h
draw_centered_badge(d, X-bw//2, Y, bw, bh, t, F['bdg'], (37, 99, 235), (255, 255, 255))
Y += badge_h + 60

# 2. 主标题 Slack
t = "Slack"
bbox = d.textbbox((0, 0), t, font=F['title'])
d.text((X-bbox[2]//2, Y), t, fill=(37, 99, 235), font=F['title'])
Y += title_h + 30

# 3. 副标题
t = "消息与频道控制"
bbox = d.textbbox((0, 0), t, font=F['sub'])
d.text((X-bbox[2]//2, Y), t, fill=(255, 255, 255), font=F['sub'])
Y += sub_h + 30

# 4. 分割线
d.line([(X-180, Y+15), (X+180, Y+15)], fill=(37, 99, 235), width=3)
Y += line_h + 40

# 5. 标签网格
tag_w = 360
tag_gap_x = 100
grid_w = tag_w * tag_cols + tag_gap_x * (tag_cols - 1)
gx = X - grid_w // 2
tag_y_start = Y

for i, (e, txt) in enumerate(tags):
    row = i // tag_cols
    col = i % tag_cols
    full = e + " " + txt
    bbox = d.textbbox((0, 0), full, font=F['tag'])
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]

    tx = gx + col * (tag_w + tag_gap_x)
    ty = tag_y_start + row * (tag_h + tag_gap_y)

    text_x = tx + (tag_w - tw) // 2
    text_y = ty + (tag_h - th) // 2

    d.rounded_rectangle([tx, ty, tx+tag_w, ty+tag_h], 18, outline=(37, 99, 235), width=2)
    d.text((text_x, text_y), full, fill=(255, 255, 255), font=F['tag'])

grid_h = tag_h * 2 + tag_gap_y * 1
Y = tag_y_start + grid_h + 60

# 6. 底部徽章
t = "GitHub 开源免费"
bbox = d.textbbox((0, 0), t, font=F['bdg'])
bw = (bbox[2]-bbox[0]) + 90
bh = bottom_badge_h
draw_centered_badge(d, X-bw//2, Y, bw, bh, t, F['bdg'], (16, 185, 129), (255, 255, 255))
Y += bottom_badge_h + 80

# 7. URL
t = "cn.clawhub-mirror.com/steipete/slack"
bbox = d.textbbox((0, 0), t, font=F['url'])
d.text((X-bbox[2]//2, H-50), t, fill=(100, 116, 139), font=F['url'])

img.save('/Users/zhushuyan/.openclaw/workspace/slack-skill-video/docs/assets/cover.png')
print("Cover generated successfully!")
