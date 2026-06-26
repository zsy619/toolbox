#!/usr/bin/env python3
"""
bm.md 封面生成脚本 - Cyberpunk 风格
元素上下左右居中显示
"""
from PIL import Image, ImageDraw, ImageFont
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/bm-md-video"
ASSETS_DIR = os.path.join(PROJECT_DIR, "docs/assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

# Cyberpunk 配色
BG_COLOR = (10, 10, 20)      # 深紫黑色
NEON_PINK = (255, 0, 128)     # 霓虹粉
NEON_CYAN = (0, 255, 255)     # 霓虹青
NEON_PURPLE = (138, 43, 226)  # 霓虹紫
NEON_YELLOW = (255, 255, 0)    # 霓虹黄
TEXT_COLOR = (255, 255, 255)    # 白色
MUTED = (128, 128, 144)        # 灰色

def load_font(size):
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

def draw_bg_gradient(draw, width, height):
    for y in range(height):
        ratio = y / height
        r = int(10 + ratio * 25)
        g = int(10 + ratio * 10)
        b = int(20 + ratio * 35)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def draw_grid(draw, width, height, color, spacing=60, alpha=20):
    for x in range(0, width, spacing):
        draw.line([(x, 0), (x, height)], fill=color + (alpha,), width=1)
    for y in range(0, height, spacing):
        draw.line([(0, y), (width, y)], fill=color + (alpha,), width=1)

def draw_glow_text(draw, x, y, text, font, glow_color, text_color):
    for offset in range(15, 0, -2):
        alpha = 255 // (offset * 2)
        if alpha > 0:
            draw.text((x, y), text, font=font, fill=glow_color[:3] + (alpha,))
    draw.text((x, y), text, font=font, fill=text_color)

def create_cover_16_9():
    WIDTH, HEIGHT = 1080, 1920
    img = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)
    
    draw_bg_gradient(draw, WIDTH, HEIGHT)
    draw_grid(draw, WIDTH, HEIGHT, NEON_PINK, 60, 15)
    draw_grid(draw, WIDTH, HEIGHT, NEON_CYAN, 120, 8)
    
    center_x = WIDTH // 2
    
    title_font = load_font(140)
    subtitle_font = load_font(48)
    tag_font = load_font(28)
    link_font = load_font(22)
    
    # 主标题
    title_text = "bm.md"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    title_x = center_x - title_w // 2
    title_y = 300
    draw_glow_text(draw, title_x, title_y, title_text, title_font, NEON_PINK, TEXT_COLOR)
    
    # 副标题
    sub_text = "排版神器"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=subtitle_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_x = center_x - sub_w // 2
    sub_y = title_y + title_h + 20
    draw_glow_text(draw, sub_x, sub_y, sub_text, subtitle_font, NEON_CYAN, NEON_CYAN)
    
    # 分隔线
    line_y = sub_y + sub_bbox[3] - sub_bbox[1] + 50
    line_w = 400
    for i in range(line_w):
        x = center_x - line_w // 2 + i
        ratio = i / line_w
        if ratio < 0.33:
            color = NEON_PINK
        elif ratio < 0.66:
            color = NEON_PURPLE
        else:
            color = NEON_CYAN
        draw.line([(x, line_y), (x+1, line_y)], fill=color, width=2)
    
    # 核心卖点
    features = [
        "实时预览",
        "14种样式",
        "14种代码主题",
        "一键适配"
    ]
    
    feature_y = line_y + 80
    for i, feature in enumerate(features):
        feat_font = load_font(44)
        feat_bbox = draw.textbbox((0, 0), feature, font=feat_font)
        feat_w = feat_bbox[2] - feat_bbox[0]
        feat_x = center_x - feat_w // 2
        feat_y = feature_y + i * 80
        colors = [NEON_PINK, NEON_CYAN, NEON_PURPLE, NEON_YELLOW]
        draw_glow_text(draw, feat_x, feat_y, feature, feat_font, colors[i], TEXT_COLOR)
    
    # 底部标签
    tag_y = HEIGHT - 200
    tags = ["Markdown", "排版工具", "写作效率"]
    total_tags_w = sum([draw.textbbox((0, 0), t, font=tag_font)[2] for t in tags]) + len(tags) * 30
    tags_start_x = center_x - total_tags_w // 2
    cur_x = tags_start_x
    for tag in tags:
        tag_bbox = draw.textbbox((0, 0), tag, font=tag_font)
        tag_w = tag_bbox[2] - tag_bbox[0]
        draw.rectangle([cur_x-10, tag_y-5, cur_x+tag_w+10, tag_y+35], fill=NEON_PINK + (30,))
        draw.text((cur_x, tag_y), tag, font=tag_font, fill=NEON_YELLOW)
        cur_x += tag_w + 30
    
    # 底部链接
    link_text = "GitHub: miantiao-me/bm.md"
    link_bbox = draw.textbbox((0, 0), link_text, font=link_font)
    link_w = link_bbox[2] - link_bbox[0]
    link_x = center_x - link_w // 2
    draw.text((link_x, HEIGHT - 80), link_text, font=link_font, fill=MUTED)
    
    output_path = os.path.join(ASSETS_DIR, "cover.png")
    img = img.convert('RGB')
    img.save(output_path, "PNG", quality=95)
    print(f"✅ 封面已保存: {output_path} ({WIDTH}×{HEIGHT})")
    return output_path

def create_cover_wechat():
    WIDTH, HEIGHT = 900, 383
    img = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)
    
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(10 + ratio * 20)
        g = int(10 + ratio * 10)
        b = int(20 + ratio * 30)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    draw_grid(draw, WIDTH, HEIGHT, NEON_PINK, 45, 12)
    
    center_x = WIDTH // 2
    
    title_font = load_font(80)
    subtitle_font = load_font(32)
    link_font = load_font(20)
    
    title_text = "bm.md"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    title_x = center_x - title_w // 2
    title_y = 60
    draw_glow_text(draw, title_x, title_y, title_text, title_font, NEON_PINK, TEXT_COLOR)
    
    sub_text = "写完Markdown之后，专治排版烦恼"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=subtitle_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_x = center_x - sub_w // 2
    sub_y = title_y + title_h + 10
    draw_glow_text(draw, sub_x, sub_y, sub_text, subtitle_font, NEON_CYAN, NEON_CYAN)
    
    line_y = sub_y + sub_bbox[3] - sub_bbox[1] + 20
    line_w = 300
    for i in range(line_w):
        x = center_x - line_w // 2 + i
        ratio = i / line_w
        color = NEON_PINK if ratio < 0.5 else NEON_CYAN
        draw.line([(x, line_y), (x+1, line_y)], fill=color, width=1)
    
    link_text = "GitHub: miantiao-me/bm.md"
    link_bbox = draw.textbbox((0, 0), link_text, font=link_font)
    link_w = link_bbox[2] - link_bbox[0]
    link_x = center_x - link_w // 2
    link_y = HEIGHT - 50
    draw.text((link_x, link_y), link_text, font=link_font, fill=MUTED)
    
    output_path = os.path.join(ASSETS_DIR, "cover-wechat.png")
    img = img.convert('RGB')
    img.save(output_path, "PNG", quality=95)
    print(f"✅ 微信公众号封面已保存: {output_path} ({WIDTH}×{HEIGHT})")
    return output_path

if __name__ == "__main__":
    create_cover_16_9()
    create_cover_wechat()