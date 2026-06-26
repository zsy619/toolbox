#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
OUTPUT_PATH = "/Users/zhushuyan/VideoProjects/jellyfish-video/docs/assets/cover.png"
WIDTH, HEIGHT = 1080, 1920
def create_cover():
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#0F172A')
    draw = ImageDraw.Draw(img)
    for i in range(25, 0, -1):
        r, g, b = 245, 158, 11
        size = int(300 + i * 20)
        x, y = WIDTH//2, HEIGHT//3
        draw.ellipse([x-size//2, y-size//2, x+size//2, y+size//2], fill=(r, g, b))
    emoji_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 140)
    emoji_text = "🎬"
    bbox = draw.textbbox((0, 0), emoji_text, font=emoji_font)
    emoji_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - emoji_width)//2, HEIGHT//3 - 180), emoji_text, font=emoji_font, fill='#FFFFFF')
    title_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 80)
    title_text = "Jellyfish"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = bbox[2] - bbox[0]
    title_x = (WIDTH - title_width) // 2
    draw.text((title_x, HEIGHT//3 + 20), title_text, font=title_font, fill='#FFFFFF')
    subtitle_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Light.ttc', 44)
    subtitle_text = "AI 短剧生产流水线"
    bbox2 = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = bbox2[2] - bbox2[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    draw.text((subtitle_x, HEIGHT//3 + 120), subtitle_text, font=subtitle_font, fill='#F59E0B')
    line_y = HEIGHT * 2 // 3
    draw.line([(WIDTH//4, line_y), (WIDTH*3//4, line_y)], fill='#F59E0B', width=2)
    stat_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Light.ttc', 36)
    stat_text = "从剧本到成片 · 全流程打通"
    bbox3 = draw.textbbox((0, 0), stat_text, font=stat_font)
    stat_width = bbox3[2] - bbox3[0]
    stat_x = (WIDTH - stat_width) // 2
    draw.text((stat_x, line_y + 50), stat_text, font=stat_font, fill='#64748B')
    draw.rectangle([0, HEIGHT-80, WIDTH, HEIGHT], fill='#1E293B')
    img.save(OUTPUT_PATH, 'PNG')
    print(f"Done: {OUTPUT_PATH}")
if __name__ == '__main__':
    create_cover()
