#!/usr/bin/env python3
"""封面图生成脚本 - PIL 兜底方案"""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_PATH = "/Users/zhushuyan/VideoProjects/elephant-alpha-video/docs/assets/cover.png"
WIDTH, HEIGHT = 1080, 1920

def create_cover():
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    # 科技光效 - 渐变圆形
    for i in range(25, 0, -1):
        r, g, b = 34, 211, 238  # #22D3EE 青色
        size = int(350 + i * 25)
        x, y = WIDTH//2, HEIGHT//3
        draw.ellipse([x-size//2, y-size//2, x+size//2, y+size//2], fill=(r, g, b))
    
    # 大象图标
    emoji_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 140)
    emoji_text = "🐘"
    bbox = draw.textbbox((0, 0), emoji_text, font=emoji_font)
    emoji_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - emoji_width)//2, HEIGHT//3 - 180), emoji_text, font=emoji_font, fill='#FFFFFF')
    
    # 主标题
    title_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 90)
    title_text = "Elephant Alpha"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = bbox[2] - bbox[0]
    title_x = (WIDTH - title_width) // 2
    draw.text((title_x, HEIGHT//3 + 20), title_text, font=title_font, fill='#FFFFFF')
    
    # 副标题
    subtitle_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Light.ttc', 44)
    subtitle_text = "AI界的iPhone时刻"
    bbox2 = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = bbox2[2] - bbox2[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    draw.text((subtitle_x, HEIGHT//3 + 130), subtitle_text, font=subtitle_font, fill='#22D3EE')
    
    # 分隔线
    line_y = HEIGHT * 2 // 3
    draw.line([(WIDTH//4, line_y), (WIDTH*3//4, line_y)], fill='#22D3EE', width=2)
    
    # 数据标签
    stat_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Light.ttc', 36)
    stat_text = "OpenRouter 匿名模型 · 增长377%"
    bbox3 = draw.textbbox((0, 0), stat_text, font=stat_font)
    stat_width = bbox3[2] - bbox3[0]
    stat_x = (WIDTH - stat_width) // 2
    draw.text((stat_x, line_y + 50), stat_text, font=stat_font, fill='#64748B')
    
    # 底部装饰
    draw.rectangle([0, HEIGHT-80, WIDTH, HEIGHT], fill='#1E293B')
    
    img.save(OUTPUT_PATH, 'PNG')
    print(f"✅ 封面已生成: {OUTPUT_PATH}")

if __name__ == '__main__':
    create_cover()
