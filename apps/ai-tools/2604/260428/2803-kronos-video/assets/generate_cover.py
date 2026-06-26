#!/usr/bin/env python3
"""
Kronos 视频封面生成脚本
使用 PIL 生成 1080x1920 竖屏封面
"""
from PIL import Image, ImageDraw, ImageFont
import os

# 项目目录
PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/kronos-video"
ASSETS_DIR = os.path.join(PROJECT_DIR, "docs/assets")

# 确保目录存在
os.makedirs(ASSETS_DIR, exist_ok=True)

# 封面尺寸
WIDTH = 1080
HEIGHT = 1920

# 主题配色
BG_COLOR = (15, 23, 42)       # #0F172A 深空黑
PRIMARY_COLOR = (37, 99, 235)  # #2563EB 科技蓝
ACCENT_COLOR = (16, 185, 129)   # #10B981 活力绿
TEXT_COLOR = (248, 250, 252)    # #F8FAFC 纯白

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
    # 回退到默认字体
    return ImageFont.load_default()

def draw_particles(draw, width, height, count=80):
    """绘制粒子装饰"""
    import random
    random.seed(42)
    for _ in range(count):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(2, 5)
        opacity = random.randint(50, 150)
        color = (37, 99, 235, opacity)
        draw.ellipse([x, y, x+size, y+size], fill=color)

def draw_gradient_bg(img):
    """绘制渐变背景"""
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(15 + ratio * 20)
        g = int(23 + ratio * 30)
        b = int(42 + ratio * 20)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    return img

def create_cover():
    """生成封面图"""
    # 创建空白图像
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    
    # 绘制渐变背景
    img = draw_gradient_bg(img)
    
    # 创建绘图对象
    draw = ImageDraw.Draw(img)
    
    # 绘制粒子装饰
    draw_particles(draw, WIDTH, HEIGHT)
    
    # 加载字体
    try:
        font_large = load_font(160)
        font_medium = load_font(56)
        font_small = load_font(36)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # 计算居中位置
    center_x = WIDTH // 2
    
    # 绘制主标题 "KRONOS"
    title = "KRONOS"
    title_bbox = draw.textbbox((0, 0), title, font=font_large)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    title_x = (WIDTH - title_width) // 2
    title_y = 600
    
    # 绘制标题阴影
    draw.text((title_x + 4, title_y + 4), title, font=font_large, fill=(0, 0, 0, 128))
    # 绘制标题
    draw.text((title_x, title_y), title, font=font_large, fill=TEXT_COLOR)
    
    # 绘制副标题
    subtitle = "首个金融K线基础大模型"
    sub_bbox = draw.textbbox((0, 0), subtitle, font=font_medium)
    sub_width = sub_bbox[2] - sub_bbox[0]
    sub_x = (WIDTH - sub_width) // 2
    sub_y = title_y + title_height + 60
    draw.text((sub_x, sub_y), subtitle, font=font_medium, fill=ACCENT_COLOR)
    
    # 绘制底部信息栏
    info_y = HEIGHT - 250
    info_items = [
        ("清华团队研发", PRIMARY_COLOR),
        ("AAAI 2026", ACCENT_COLOR),
        ("MIT 开源", PRIMARY_COLOR),
    ]
    
    total_width = sum([len(item[0]) * 30 for item in info_items]) + len(info_items) * 100
    start_x = (WIDTH - total_width) // 2
    
    x = start_x
    for text, color in info_items:
        bbox = draw.textbbox((0, 0), text, font=font_small)
        text_width = bbox[2] - bbox[0]
        draw.text((x, info_y), text, font=font_small, fill=color)
        x += text_width + 100
    
    # 绘制底部装饰线
    line_y = HEIGHT - 180
    draw.line([(200, line_y), (WIDTH - 200, line_y)], fill=PRIMARY_COLOR, width=2)
    
    # 绘制 GitHub Stars 信息
    stars_text = "GitHub 1.16万星 · Hugging Face 已上架"
    stars_bbox = draw.textbbox((0, 0), stars_text, font=font_small)
    stars_width = stars_bbox[2] - stars_bbox[0]
    stars_x = (WIDTH - stars_width) // 2
    stars_y = HEIGHT - 130
    draw.text((stars_x, stars_y), stars_text, font=font_small, fill=(148, 163, 184))
    
    # 保存封面
    output_path = os.path.join(ASSETS_DIR, "cover.png")
    img.save(output_path, "PNG", quality=95)
    print(f"✅ 封面已保存: {output_path}")
    return output_path

if __name__ == "__main__":
    create_cover()