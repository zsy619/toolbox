#!/usr/bin/env python3
"""PIL 封面图生成 - Skills 写得好，AI 干活没烦恼"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1920
OUTPUT = '/Users/zhushuyan/.openclaw/workspace/toutiao-video/docs/assets/cover.png'

# 系统字体路径（macOS）
FONT_PATHS = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/STHeiti Medium.ttc',
    '/System/Library/Fonts/Helvetica.ttc',
    '/System/Library/Fonts/Arial.ttf',
]
FONT_LIGHT = '/System/Library/Fonts/STHeiti Light.ttc'

def get_font(size, bold=False):
    for path in FONT_PATHS:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
    return ImageFont.load_default()

def get_light_font(size):
    if os.path.exists(FONT_LIGHT):
        try:
            return ImageFont.truetype(FONT_LIGHT, size)
        except:
            pass
    return get_font(size)

def create_cover():
    img = Image.new('RGB', (W, H), '#0B1220')
    d = ImageDraw.Draw(img)

    # 渐变背景
    for y in range(H):
        t = y / H
        r = int(11 + t * 18)
        g = int(18 + t * 12)
        b = int(32 + t * 25)
        d.line([(0, y), (W, y)], fill=(r, g, b))

    # 顶部光效
    for i in range(6):
        y_base = int(H * 0.08 + i * 15)
        alpha = 40 - i * 5
        d.line([(W*0.2, y_base), (W*0.8, y_base)], fill=(40, 80, 160, alpha))

    # 左侧装饰线
    X = W // 2
    d.line([(X - 280, 480), (X + 280, 480)], fill=(0, 180, 255, 60))

    # 主标题（大字体）
    title1 = "Skills 写得好"
    title2 = "AI 干活没烦恼"
    f_title = get_font(120, bold=True)

    # 垂直居中计算
    bbox1 = d.textbbox((0, 0), title1, font=f_title)
    t1_w = bbox1[2] - bbox1[0]
    bbox2 = d.textbbox((0, 0), title2, font=f_title)
    t2_w = bbox2[2] - bbox2[0]

    # 青色高亮
    d.text((X - t1_w//2, 560), title1, font=f_title, fill=(255, 255, 255))
    d.text((X - t2_w//2, 700), title2, font=f_title, fill=(0, 210, 255))

    # 副标题
    subtitle = "4个设计原则 × 4个踩坑笔记"
    f_sub = get_light_font(40)
    bbox_sub = d.textbbox((0, 0), subtitle, font=f_sub)
    sub_w = bbox_sub[2] - bbox_sub[0]
    d.text((X - sub_w//2, 860), subtitle, font=f_sub, fill=(148, 163, 184))

    # 底部标签
    tags = ["AI编程", "Skills", "效率提升", "OpenCode"]
    f_tag = get_light_font(28)
    total_w = sum(d.textbbox((0, 0), t, font=f_tag)[2] + 24 for t in tags)
    x_start = X - total_w // 2
    y_tag = 1680
    x_cur = x_start
    for tag in tags:
        bw = d.textbbox((0, 0), tag, font=f_tag)
        tw = bw[2] - bw[0]
        d.rounded_rectangle([x_cur - 12, y_tag - 6, x_cur + tw + 12, y_tag + 36], radius=8, fill=(0, 180, 255, 30), outline=(0, 180, 255, 80))
        d.text((x_cur, y_tag), tag, font=f_tag, fill=(0, 210, 255))
        x_cur += tw + 36

    # OpenCode 标签
    f_oc = get_light_font(24)
    bbox_oc = d.textbbox((0, 0), "OpenCode Day31", font=f_oc)
    oc_w = bbox_oc[2] - bbox_oc[0]
    d.text((X - oc_w//2, 1760), "OpenCode Day31", font=f_oc, fill=(100, 116, 139))

    img.save(OUTPUT, 'PNG', quality=95)
    print(f"✅ 封面已保存: {OUTPUT} ({W}×{H})")

if __name__ == '__main__':
    create_cover()
