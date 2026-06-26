#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
OUTPUT_PATH = "/Users/zhushuyan/VideoProjects/ai-10-90-video/docs/assets/cover.png"
WIDTH, HEIGHT = 1080, 1920
def create_cover():
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#0F172A')
    draw = ImageDraw.Draw(img)
    for i in range(25, 0, -1):
        r, g, b = 239, 68, 68
        size = int(300 + i * 20)
        x, y = WIDTH//2, HEIGHT//3
        draw.ellipse([x-size//2, y-size//2, x+size//2, y+size//2], fill=(r, g, b))
    emoji_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 140)
    emoji_text = "⚡"
    bbox = draw.textbbox((0, 0), emoji_text, font=emoji_font)
    emoji_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - emoji_width)//2, HEIGHT//3 - 180), emoji_text, font=emoji_font, fill='#FFFFFF')
    title_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 60)
    title_text = "AI时代"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_width)//2, HEIGHT//3 + 20), title_text, font=title_font, fill='#FFFFFF')
    subtitle_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 48)
    subtitle_text = "不懂AI等于90年代\"文盲\""
    bbox2 = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - subtitle_width)//2, HEIGHT//3 + 100), subtitle_text, font=subtitle_font, fill='#EF4444')
    line_y = HEIGHT * 2 // 3
    draw.line([(WIDTH//4, line_y), (WIDTH*3//4, line_y)], fill='#EF4444', width=2)
    stat_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Light.ttc', 36)
    stat_text = "未来10年格局定型"
    bbox3 = draw.textbbox((0, 0), stat_text, font=stat_font)
    stat_width = bbox3[2] - bbox3[0]
    draw.text(((WIDTH - stat_width)//2, line_y + 50), stat_text, font=stat_font, fill='#64748B')
    draw.rectangle([0, HEIGHT-80, WIDTH, HEIGHT], fill='#1E293B')
    img.save(OUTPUT_PATH, 'PNG')
    print(f"Done: {OUTPUT_PATH}")
if __name__ == '__main__':
    create_cover()
