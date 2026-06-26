#!/usr/bin/env python3
"""
PIL封面生成脚本 - PenPot 开源设计平台
"""
from PIL import Image, ImageDraw, ImageFont
import os

FONT_PATH = '/System/Library/Fonts/STHeiti Medium.ttc'

def create_penpot_cover(output_path, size=(1080, 1920), title_size=280, subtitle_size=72):
    w, h = size
    img = Image.new('RGB', size, color='#0D0D1A')
    draw = ImageDraw.Draw(img)
    
    # 暗色背景网格
    for i in range(0, h, max(20, h//30)):
        draw.line([(0, i), (w, i)], fill='#150828', width=1)
    for i in range(0, w, max(20, w//30)):
        draw.line([(i, 0), (i, h)], fill='#150828', width=1)
    
    # 四角光晕
    for cx, cy, r, c in [
        (int(w*0.1), int(h*0.1), int(min(w,h)*0.35), '#00FFFF'),
        (int(w*0.9), int(h*0.1), int(min(w,h)*0.25), '#FF00FF'),
        (int(w*0.1), int(h*0.9), int(min(w,h)*0.25), '#9D00FF'),
        (int(w*0.9), int(h*0.9), int(min(w,h)*0.2), '#00FFFF'),
    ]:
        for alpha in range(3, 0, -1):
            color = tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
            draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=tuple(int(x*0.3) for x in color))
    
    # 字体加载
    font_title = ImageFont.truetype(FONT_PATH, title_size)
    font_subtitle = ImageFont.truetype(FONT_PATH, subtitle_size)
    font_tag = ImageFont.truetype(FONT_PATH, 48)
    
    # 自校验
    bbox = draw.textbbox((0, 0), 'PenPot', font=font_title, anchor='mm')
    title_height = bbox[3] - bbox[1]
    ratio = title_height / h * 100
    print(f"Title: {title_height}px ({ratio:.1f}%)")
    
    # 多层发光标题
    title_y = int(h * 0.35)
    for glow_size, glow_color in [
        (int(title_size*0.08), '#004444'),
        (int(title_size*0.05), '#006666'),
        (int(title_size*0.03), '#008888'),
        (int(title_size*0.015), '#00CCCC'),
    ]:
        for dx, dy in [(0, -glow_size), (0, glow_size), (-glow_size, 0), (glow_size, 0)]:
            draw.text((w//2 + dx, title_y + dy), 'PenPot', fill=glow_color, font=font_title, anchor='mm')
    draw.text((w//2, title_y), 'PenPot', fill='#FFFFFF', font=font_title, anchor='mm')
    
    # 副标题
    subtitle_y = int(h * 0.48)
    draw.text((w//2, subtitle_y), '开源设计平台', fill='#00FFFF', font=font_subtitle, anchor='mm')
    draw.text((w//2, subtitle_y + int(subtitle_size*1.2)), '设计协同', fill='#FFFFFF', font=font_subtitle, anchor='mm')
    
    # URL标签
    tag_y = int(h * 0.72)
    draw.text((w//2, tag_y), 'penpot.app', fill='#8888AA', font=font_tag, anchor='mm')
    
    # 开源标签
    tag_y2 = int(h * 0.82)
    draw.text((w//2, tag_y2), '开源免费 · Mozilla License', fill='#666666', font=font_tag, anchor='mm')
    
    img.save(output_path, 'PNG')
    print(f"{output_path}: {os.path.getsize(output_path)/1024:.1f}KB")
    return output_path

if __name__ == '__main__':
    create_penpot_cover('docs/assets/cover.png')
    create_penpot_cover('docs/assets/cover-wechat.png', size=(900, 383), title_size=140, subtitle_size=36)
    create_penpot_cover('docs/assets/cover-xhs.png', size=(1440, 2560), title_size=360, subtitle_size=96)
    print("✅ 所有封面已生成")