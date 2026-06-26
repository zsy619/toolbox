#!/usr/bin/env python3
"""封面图生成脚本 - PIL 兜底方案"""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_PATH = "/Users/zhushuyan/VideoProjects/wx-favorites-viz/docs/assets/cover.png"
WIDTH, HEIGHT = 1080, 1920

def create_cover():
    # 深空黑背景
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    # 科技光效 - 渐变圆形
    for i in range(20, 0, -1):
        alpha = int(255 * (1 - i/20) * 0.15)
        r, g, b = 37, 99, 235  # #2563EB
        size = int(300 + i * 30)
        x, y = WIDTH//2, HEIGHT//3
        draw.ellipse([x-size//2, y-size//2, x+size//2, y+size//2], 
                    fill=(r, g, b, alpha) if hasattr(draw, 'ellipse') else (r, g, b))
    
    # 装饰线条
    draw.line([(0, HEIGHT//2), (WIDTH//4, HEIGHT//2)], fill='#1E40AF', width=2)
    draw.line([(WIDTH*3//4, HEIGHT//2), (WIDTH, HEIGHT//2)], fill='#1E40AF', width=2)
    
    # 主标题
    title_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 100)
    title_text = "微信收藏可视化"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = bbox[2] - bbox[0]
    title_x = (WIDTH - title_width) // 2
    draw.text((title_x, HEIGHT//3 - 50), title_text, font=title_font, fill='#FFFFFF')
    
    # 副标题
    subtitle_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Light.ttc', 48)
    subtitle_text = "Claude Code Skill"
    bbox2 = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = bbox2[2] - bbox2[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    draw.text((subtitle_x, HEIGHT//3 + 80), subtitle_text, font=subtitle_font, fill='#22D3EE')
    
    # 分隔线
    line_y = HEIGHT * 2 // 3
    draw.line([(WIDTH//4, line_y), (WIDTH*3//4, line_y)], fill='#3B82F6', width=2)
    
    # GitHub 地址
    github_font = ImageFont.truetype('/System/Library/Fonts/STHeiti Light.ttc', 36)
    github_text = "github.com/zhuyansen/wx-favorites-report"
    bbox3 = draw.textbbox((0, 0), github_text, font=github_font)
    github_width = bbox3[2] - bbox3[0]
    github_x = (WIDTH - github_width) // 2
    draw.text((github_x, line_y + 60), github_text, font=github_font, fill='#64748B')
    
    # 底部装饰
    draw.rectangle([0, HEIGHT-100, WIDTH, HEIGHT], fill='#1E293B')
    
    # 保存
    img.save(OUTPUT_PATH, 'PNG')
    print(f"✅ 封面已生成: {OUTPUT_PATH}")

if __name__ == '__main__':
    create_cover()
