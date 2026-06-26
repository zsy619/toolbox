#!/usr/bin/env python3
"""
Fooocus 视频封面生成脚本 - Cyberpunk 风格
使用 PIL 生成 1080x1920 竖屏封面
"""
from PIL import Image, ImageDraw, ImageFont
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/fooocus-video"
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

def create_cover():
    """生成Cyberpunk风格封面图"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # 渐变背景
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(10 + ratio * 30)
        g = int(10 + ratio * 15)
        b = int(20 + ratio * 40)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    # 网格线（赛博朋克感）
    for x in range(0, WIDTH, 60):
        draw.line([(x, 0), (x, HEIGHT)], fill=(255, 0, 128, 30), width=1)
    for y in range(0, HEIGHT, 60):
        draw.line([(0, y), (WIDTH, y)], fill=(0, 255, 255, 30), width=1)
    
    # 霓虹光晕效果
    import math
    for i in range(20):
        x = WIDTH // 2 + int(100 * math.sin(i * 0.3))
        y = 600 + int(50 * math.cos(i * 0.3))
        alpha = 255 - i * 10
        if alpha > 0:
            glow_size = 80 + i * 5
            draw.ellipse([x-glow_size, y-glow_size, x+glow_size, y+glow_size], 
                        fill=(255, 0, 128, alpha // 4))
    
    # 加载字体
    font_title = load_font(160)
    font_subtitle = load_font(60)
    font_tag = load_font(36)
    font_info = load_font(28)
    
    center_x = WIDTH // 2
    
    # 主标题 - 霓虹发光效果
    title = "Fooocus"
    tb = draw.textbbox((0, 0), title, font=font_title)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    tx = (WIDTH - tw) // 2
    ty = 480
    
    # 发光层
    for offset in range(8, 0, -2):
        draw.text((tx, ty), title, font=font_title, fill=(255, 0, 128, 255 // offset))
    # 主标题
    draw.text((tx, ty), title, font=font_title, fill=TEXT_COLOR)
    
    # 副标题 - 霓虹青
    subtitle = "免费图像生成神器"
    sb = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    sw = sb[2] - sb[0]
    sx = (WIDTH - sw) // 2
    sy = ty + th + 30
    # 发光
    for offset in range(6, 0, -2):
        draw.text((sx, sy), subtitle, font=font_subtitle, fill=(0, 255, 255, 255 // offset))
    draw.text((sx, sy), subtitle, font=font_subtitle, fill=(0, 255, 255))
    
    # 霓虹分隔线
    line_y = sy + 100
    for x in range(150, WIDTH - 150, 4):
        color_idx = (x // 4) % 3
        colors = [(255, 0, 128), (138, 43, 226), (0, 255, 255)]
        draw.line([(x, line_y), (x + 2, line_y)], fill=colors[color_idx], width=2)
    
    # 标签行 - 霓虹黄
    tags = ["30K+ Stars", "4GB显存", "1.35秒出图"]
    tag_y = line_y + 60
    total_width = sum([len(t) * 36 for t in tags]) + len(tags) * 80
    x = (WIDTH - total_width) // 2
    for tag in tags:
        tb = draw.textbbox((0, 0), tag, font=font_tag)
        tw = tb[2] - tb[0]
        # 霓虹发光效果
        for offset in range(4, 0, -1):
            draw.text((x, tag_y), tag, font=font_tag, fill=(255, 255, 0, 255 // (offset * 2)))
        draw.text((x, tag_y), tag, font=font_tag, fill=(255, 255, 0))
        x += tw + 80
    
    # 底部变现信息 - 霓虹粉
    bottom_y = HEIGHT - 220
    money_text = "电商卖家单 · 网文插画 · 月入过万"
    mb = draw.textbbox((0, 0), money_text, font=font_info)
    mw = mb[2] - mb[0]
    mx = (WIDTH - mw) // 2
    for offset in range(4, 0, -1):
        draw.text((mx, bottom_y), money_text, font=font_info, fill=(255, 0, 128, 255 // (offset * 2)))
    draw.text((mx, bottom_y), money_text, font=font_info, fill=(255, 0, 128))
    
    # 底部链接
    platform_tags = "GitHub: lllyasviel/Fooocus"
    pb = draw.textbbox((0, 0), platform_tags, font=font_info)
    pw = pb[2] - pb[0]
    px = (WIDTH - pw) // 2
    py = bottom_y + 60
    draw.text((px, py), platform_tags, font=font_info, fill=(100, 100, 120))
    
    # 保存
    output_path = os.path.join(ASSETS_DIR, "cover.png")
    img.save(output_path, "PNG", quality=95)
    print(f"✅ Cyberpunk 封面已保存: {output_path}")
    return output_path

if __name__ == "__main__":
    create_cover()