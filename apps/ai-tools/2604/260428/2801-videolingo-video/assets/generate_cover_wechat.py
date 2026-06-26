#!/usr/bin/env python3
"""
VideoLingo 微信公众号封面图生成脚本
尺寸: 900×383 (2.35:1)
"""
from PIL import Image, ImageDraw, ImageFont
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/videolingo-video"
ASSETS_DIR = os.path.join(PROJECT_DIR, "docs/assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

WIDTH, HEIGHT = 900, 383

# 主题配色 - tech-modern
BG_COLOR = (15, 23, 42)       # #0F172A 深空黑
PRIMARY_COLOR = (59, 130, 246) # #3B82F6 科技蓝
SECONDARY_COLOR = (124, 58, 237) # #7C3AED 电紫色
ACCENT_COLOR = (16, 185, 129)  # #10B981 活力绿
TEXT_COLOR = (248, 250, 252)   # #F8FAFC 纯白
MUTED_COLOR = (148, 163, 184)  # #94A3B8 灰色

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
    """生成微信公众号封面图"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # 渐变背景
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(15 + ratio * 20)
        g = int(23 + ratio * 30)
        b = int(42 + ratio * 20)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    # 粒子装饰
    import random
    random.seed(42)
    for _ in range(30):
        x, y = random.randint(0, WIDTH), random.randint(0, HEIGHT)
        size = random.randint(2, 5)
        draw.ellipse([x, y, x+size, y+size], fill=(59, 130, 246, 80))
    
    # 加载字体
    font_title = load_font(80)
    font_subtitle = load_font(36)
    font_tag = load_font(24)
    
    center_x = WIDTH // 2
    
    # 主标题
    title = "VideoLingo"
    tb = draw.textbbox((0, 0), title, font=font_title)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    tx = (WIDTH - tw) // 2
    ty = 80
    draw.text((tx + 3, ty + 3), title, font=font_title, fill=(0, 0, 0, 60))
    draw.text((tx, ty), title, font=font_title, fill=TEXT_COLOR)
    
    # 副标题
    subtitle = "Netflix级字幕翻译配音"
    sb = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    sw = sb[2] - sb[0]
    sx = (WIDTH - sw) // 2
    sy = ty + th + 10
    draw.text((sx, sy), subtitle, font=font_subtitle, fill=ACCENT_COLOR)
    
    # 分隔线
    line_y = sy + 50
    draw.line([(100, line_y), (WIDTH - 100, line_y)], fill=PRIMARY_COLOR, width=1)
    
    # 标签
    tags = ["8700+ Stars", "开源免费", "变现神器"]
    tag_y = line_y + 20
    total_width = sum([len(t) * 24 for t in tags]) + len(tags) * 40
    x = (WIDTH - total_width) // 2
    for tag in tags:
        draw.text((x, tag_y), tag, font=font_tag, fill=MUTED_COLOR)
        tb = draw.textbbox((0, 0), tag, font=font_tag)
        x += (tb[2] - tb[0]) + 40
    
    # 底部链接
    bottom_y = HEIGHT - 40
    link_text = "GitHub: Huanshere/VideoLingo"
    lb = draw.textbbox((0, 0), link_text, font=font_tag)
    lw = lb[2] - lb[0]
    lx = (WIDTH - lw) // 2
    draw.text((lx, bottom_y), link_text, font=font_tag, fill=(100, 116, 139))
    
    # 保存
    output_path = os.path.join(ASSETS_DIR, "cover-wechat.png")
    img.save(output_path, "PNG", quality=95)
    print(f"✅ 微信公众号封面已保存: {output_path}")
    return output_path

if __name__ == "__main__":
    create_cover()