#!/usr/bin/env python3
"""Article Tools 封面图生成脚本 - PIL 方案"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1920
OUTPUT = "/Volumes/OpenClawDrive/.hermes/workspace/article-tools/docs/assets/cover.png"

# 字体路径（macOS 系统字体）
FONT_PATHS = [
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
]

def get_font(size):
    for path in FONT_PATHS:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
    return ImageFont.load_default()

# 创建画布
img = Image.new('RGB', (W, H), '#0F172A')
d = ImageDraw.Draw(img)

# 绘制渐变背景
for y in range(H):
    t = y / H
    r = int(15 + t * 20)
    g = int(23 + t * 15)
    b = int(42 + t * 30)
    d.line([(0, y), (W, y)], fill=(r, g, b))

# 绘制光效
d.ellipse([200, 300, 880, 900], fill=(59, 130, 246, 80))
d.ellipse([400, 600, 700, 1000], fill=(139, 92, 246, 60))

# 字体定义
f_title = get_font(140)
f_subtitle = get_font(52)
f_label = get_font(32)

# 主标题
title = "Article Tools"
bbox = d.textbbox((0, 0), title, font=f_title)
title_x = W // 2 - (bbox[2] - bbox[0]) // 2
d.text((title_x, H // 3 - 40), title, fill=(255, 255, 255), font=f_title)

# 副标题
subtitle = "写作 5 分钟，排版 1 秒"
bbox = d.textbbox((0, 0), subtitle, font=f_subtitle)
sub_x = W // 2 - (bbox[2] - bbox[0]) // 2
d.text((sub_x, H // 3 + 120), subtitle, fill=(34, 211, 238), font=f_subtitle)

# 标签
label = "浏览器端排版神器 · 零安装打开即用"
bbox = d.textbbox((0, 0), label, font=f_label)
label_x = W // 2 - (bbox[2] - bbox[0]) // 2
d.text((label_x, H // 3 + 220), label, fill=(148, 163, 184), font=f_label)

# 底部 GitHub 信息
footer = "github.com/eternityspring/article-tools · 225 Stars"
bbox = d.textbbox((0, 0), footer, font=f_label)
footer_x = W // 2 - (bbox[2] - bbox[0]) // 2
d.text((footer_x, H - 150), footer, fill=(100, 116, 139), font=f_label)

img.save(OUTPUT)
print(f"✅ 封面已生成: {OUTPUT}")
