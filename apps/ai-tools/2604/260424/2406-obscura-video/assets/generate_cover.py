#!/usr/bin/env python3
"""Obscura 封面图生成器 - PIL/Pillow"""

import os
import random
from PIL import Image, ImageDraw, ImageFont

PROJECT = '/Users/zhushuyan/VideoProjects/obscura-video'

THEME = {
    'backgroundColor': '#0F172A',
    'primaryColor': '#3B82F6',  # 蓝色主题
    'secondaryColor': '#60A5FA',
    'textColor': '#F8FAFC',
}

def hex_to_rgb(hex_color):
    h = hex_color.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_gradient_background(draw, width, height, color1, color2):
    c1 = hex_to_rgb(color1)
    c2 = hex_to_rgb(color2)
    for y in range(height):
        ratio = y / height
        r = int(c1[0] + (c2[0] - c1[0]) * ratio)
        g = int(c1[1] + (c2[1] - c1[1]) * ratio)
        b = int(c1[2] + (c2[2] - c1[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def load_chinese_font(font_size):
    font_paths = [
        '/System/Library/Fonts/Hiragino Sans GB.ttc',
        '/System/Library/Fonts/PingFang.ttc',
        '/Library/Fonts/Arial Unicode.ttf',
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, font_size)
            except:
                continue
    return ImageFont.load_default()

def create_cover(width, height, title, subtitle, output_path):
    img = Image.new('RGB', (width, height), color=THEME['backgroundColor'])
    draw = ImageDraw.Draw(img)
    draw_gradient_background(draw, width, height, '#0F172A', '#1E293B')
    
    # 粒子效果
    random.seed(42)
    for _ in range(80):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(1, 3)
        color = (random.randint(30, 80), random.randint(100, 180), random.randint(240, 255))
        draw.ellipse([x, y, x+size, y+size], fill=color)
    
    # 标题字体
    title_font_size = max(int(width * 0.1), 90)
    sub_font_size = max(int(width * 0.045), 40)
    title_font = load_chinese_font(title_font_size)
    sub_font = load_chinese_font(sub_font_size)
    
    # 主标题
    lines = title.split('\n')
    current_y = (height - (len(lines) * title_font_size)) // 2 - 80
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, current_y), line, fill=THEME['textColor'], font=title_font)
        current_y += title_font_size + 10
    
    # 副标题
    sub_bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    sub_width = sub_bbox[2] - sub_bbox[0]
    draw.text(((width - sub_width) // 2, current_y + 40), subtitle, fill=THEME['secondaryColor'], font=sub_font)
    
    # 装饰线
    line_y = height - 180
    draw.rectangle([(width // 4, line_y), (3 * width // 4, line_y + 4)], fill=THEME['primaryColor'])
    
    # 底部信息
    info_font = load_chinese_font(max(int(width * 0.03), 24))
    info_text = "802 Stars · Apache 2.0"
    info_bbox = draw.textbbox((0, 0), info_text, font=info_font)
    info_width = info_bbox[2] - info_bbox[0]
    draw.text(((width - info_width) // 2, height - 100), info_text, fill=(113, 113, 122), font=info_font)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'PNG', quality=95)
    return os.path.getsize(output_path) / 1024

# 生成封面
title = "Obscura"
subtitle = "AI Agent 的无头浏览器"

print("生成封面图...")
kb1 = create_cover(1080, 1920, title, subtitle, f'{PROJECT}/docs/assets/cover.png')
print(f"✅ 视频号 cover.png ({kb1:.0f}KB)")

# 复制到其他尺寸
import shutil
shutil.copy(f'{PROJECT}/docs/assets/cover.png', f'{PROJECT}/docs/assets/cover-wechat.png')
shutil.copy(f'{PROJECT}/docs/assets/cover.png', f'{PROJECT}/docs/assets/cover-xhs.png')

# 生成 1440x2560 小红书封面
kb3 = create_cover(1440, 2560, title, subtitle, f'{PROJECT}/docs/assets/cover-xhs.png')
print(f"✅ 小红书 cover-xhs.png ({kb3:.0f}KB)")

print("\n✅ 封面图生成完成！")