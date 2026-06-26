#!/usr/bin/env python3
"""
VideoLingo 封面生成脚本 - Cyberpunk 风格
元素上下左右居中显示
尺寸: 1080×1920 (9:16竖屏)
"""
from PIL import Image, ImageDraw, ImageFont
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/videolingo-video"
ASSETS_DIR = os.path.join(PROJECT_DIR, "docs/assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

WIDTH, HEIGHT = 1080, 1920

# Cyberpunk 配色
BG_COLOR = (10, 10, 20)        # 深紫黑色
NEON_PINK = (255, 0, 128)      # 霓虹粉
NEON_CYAN = (0, 255, 255)      # 霓虹青
NEON_PURPLE = (138, 43, 226)   # 霓虹紫
NEON_YELLOW = (255, 255, 0)    # 霓虹黄
TEXT_COLOR = (255, 255, 255)   # 白色

def load_font(size):
    """加载系统字体"""
    font_paths = [
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
    return ImageFont.load_default()

def draw_neon_glow(draw, x, y, text, font, glow_color, intensity=8):
    """绘制霓虹发光效果"""
    for offset in range(intensity, 0, -1):
        alpha = 255 // (offset * 2)
        if alpha > 0:
            draw.text((x, y), text, font=font, fill=glow_color[:3] + (alpha,))
    draw.text((x, y), text, font=font, fill=TEXT_COLOR)

def create_cover():
    """生成Cyberpunk风格封面图"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # 渐变背景
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(10 + ratio * 25)
        g = int(10 + ratio * 10)
        b = int(20 + ratio * 35)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    # 网格线（赛博朋克感）
    for x in range(0, WIDTH, 60):
        draw.line([(x, 0), (x, HEIGHT)], fill=(255, 0, 128, 20), width=1)
    for y in range(0, HEIGHT, 60):
        draw.line([(0, y), (WIDTH, y)], fill=(0, 255, 255, 20), width=1)
    
    # 霓虹光晕效果
    import math
    for i in range(25):
        x = WIDTH // 2 + int(120 * math.sin(i * 0.25))
        y = HEIGHT // 2 + int(80 * math.cos(i * 0.25))
        alpha = 255 - i * 10
        if alpha > 0:
            glow_size = 60 + i * 4
            draw.ellipse([x-glow_size, y-glow_size, x+glow_size, y+glow_size], 
                        fill=(255, 0, 128, alpha // 5))
    
    # 加载字体
    font_title = load_font(160)
    font_subtitle = load_font(64)
    font_tag = load_font(36)
    
    # ========== 垂直居中布局计算 ==========
    center_x = WIDTH // 2
    
    # 计算各元素尺寸
    title = "VideoLingo"
    title_bbox = draw.textbbox((0, 0), title, font=font_title)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    
    subtitle = "Netflix级字幕翻译配音"
    sub_bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    
    # 标签
    tags = ["8700+ Stars", "开源免费", "变现神器"]
    tag_bbox = draw.textbbox((0, 0), tags[0], font=font_tag)
    tag_h = tag_bbox[3] - tag_bbox[1]
    
    # 计算总高度和起始Y
    gap = 40  # 元素间距
    total_h = title_h + gap + sub_h + gap * 2 + tag_h * 2 + gap
    start_y = (HEIGHT - total_h) // 2
    
    # ========== 绘制主标题（霓虹发光） ==========
    title_x = center_x - title_w // 2
    title_y = start_y
    
    # 发光层
    for offset in range(10, 0, -1):
        alpha = 255 // (offset * 2)
        if alpha > 0:
            draw.text((title_x, title_y), title, font=font_title, fill=NEON_PINK[:3] + (alpha,))
    draw.text((title_x, title_y), title, font=font_title, fill=TEXT_COLOR)
    
    # ========== 绘制副标题（霓虹青） ==========
    sub_x = center_x - sub_w // 2
    sub_y = title_y + title_h + gap
    
    for offset in range(8, 0, -1):
        alpha = 255 // (offset * 2)
        if alpha > 0:
            draw.text((sub_x, sub_y), subtitle, font=font_subtitle, fill=NEON_CYAN[:3] + (alpha,))
    draw.text((sub_x, sub_y), subtitle, font=font_subtitle, fill=NEON_CYAN)
    
    # ========== 绘制分隔线 ==========
    line_y = sub_y + sub_h + gap * 1.5
    line_half = 200
    for i in range(line_half * 2):
        x = center_x - line_half + i
        color_idx = i % 3
        colors = [NEON_PINK, NEON_PURPLE, NEON_CYAN]
        draw.line([(x, line_y), (x + 1, line_y)], fill=colors[color_idx], width=2)
    
    # ========== 绘制标签 ==========
    tag_y = line_y + gap
    tag_gap = 80
    tag_start_x = center_x - (len(tags) * (tag_bbox[2] - tag_bbox[0]) + (len(tags) - 1) * tag_gap) // 2
    
    for i, tag in enumerate(tags):
        tag_bbox = draw.textbbox((0, 0), tag, font=font_tag)
        tag_w = tag_bbox[2] - tag_bbox[0]
        tag_x = tag_start_x + i * (tag_w + tag_gap)
        
        for offset in range(6, 0, -1):
            alpha = 255 // (offset * 2)
            if alpha > 0:
                draw.text((tag_x, tag_y), tag, font=font_tag, fill=NEON_YELLOW[:3] + (alpha,))
        draw.text((tag_x, tag_y), tag, font=font_tag, fill=NEON_YELLOW)
    
    # ========== 底部链接（居中） ==========
    link_text = "GitHub: Huanshere/VideoLingo"
    link_font = load_font(24)
    link_bbox = draw.textbbox((0, 0), link_text, font=link_font)
    link_w = link_bbox[2] - link_bbox[0]
    link_x = center_x - link_w // 2
    link_y = HEIGHT - 80
    
    draw.text((link_x, link_y), link_text, font=link_font, fill=(100, 100, 120))
    
    # 保存
    output_path = os.path.join(ASSETS_DIR, "cover.png")
    img.save(output_path, "PNG", quality=95)
    print(f"✅ Cyberpunk 封面已保存: {output_path}")
    
    # 同时保存 AI 版本
    ai_path = os.path.join(ASSETS_DIR, "cover-ai.png")
    img.save(ai_path, "PNG", quality=95)
    print(f"✅ AI封面副本已保存: {ai_path}")
    return output_path

if __name__ == "__main__":
    create_cover()