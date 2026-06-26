#!/usr/bin/env python3
"""
Skills 封面生成脚本 - Cyberpunk 风格
元素上下左右居中显示，布局合理
"""
from PIL import Image, ImageDraw, ImageFont
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/skills-video"
ASSETS_DIR = os.path.join(PROJECT_DIR, "docs/assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

# Cyberpunk 配色
BG_COLOR = (10, 10, 20)      # 深紫黑色
NEON_PINK = (255, 0, 128)     # 霓虹粉
NEON_CYAN = (0, 255, 255)     # 霓虹青
NEON_PURPLE = (138, 43, 226)  # 霓虹紫
NEON_YELLOW = (255, 255, 0)    # 霓虹黄
TEXT_COLOR = (255, 255, 255)  # 白色
MUTED = (128, 128, 144)       # 灰色

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
    """绘制带霓虹发光效果的文字"""
    for offset in range(15, 0, -2):
        alpha = 255 // (offset * 2)
        if alpha > 0:
            draw.text((x, y), text, font=font, fill=glow_color[:3] + (alpha,))
    draw.text((x, y), text, font=font, fill=text_color)

def create_cover_16_9():
    """生成9:16竖屏封面 (1080×1920)"""
    WIDTH, HEIGHT = 1080, 1920
    img = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)
    
    # 渐变背景
    draw_bg_gradient(draw, WIDTH, HEIGHT)
    
    # 网格
    draw_grid(draw, WIDTH, HEIGHT, NEON_PINK, 60, 15)
    draw_grid(draw, WIDTH, HEIGHT, NEON_CYAN, 120, 8)
    
    center_x = WIDTH // 2
    
    # ========== 计算布局 ==========
    title_font = load_font(140)
    subtitle_font = load_font(44)
    skill_font = load_font(32)
    tag_font = load_font(24)
    
    # 主标题
    title_text = "极简创业"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    
    # 副标题
    sub_text = "一人公司的9个AI Skills"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=subtitle_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    
    # 分隔线宽度
    line_w = 400
    
    # 9个Skills流程 - 横向3个为一组
    skills = [
        ("01", "找社区"), ("02", "验证需求"), ("03", "MVP"),
        ("04", "首批客户"), ("05", "定价"), ("06", "营销计划"),
        ("07", "可持续增长"), ("08", "价值观"), ("09", "核心复盘"),
    ]
    
    # 计算每个技能标签的宽度
    skill_label_w = 0
    for num, name in skills:
        bbox = draw.textbbox((0, 0), f"{num} {name}", font=skill_font)
        w = bbox[2] - bbox[0]
        if w > skill_label_w:
            skill_label_w = w
    
    skill_label_h = 40
    
    # 计算总高度
    gap_small = 30
    gap_medium = 50
    gap_large = 80
    
    total_h = (
        title_h +                    # 主标题
        gap_small +                  # 间距
        sub_h +                      # 副标题
        gap_medium +                  # 间距
        20 +                         # 分隔线高度
        gap_medium +                  # 间距
        skill_label_h +              # 技能行高度
        gap_small +                  # 技能行间距
        skill_label_h +              # 技能行高度
        gap_small +                  # 技能行间距
        skill_label_h +              # 技能行高度
        gap_large +                  # 间距
        30 +                         # 底部标签高度
        gap_large +                  # 间距
        30                           # 底部链接
    )
    
    # 起始Y（居中）
    start_y = (HEIGHT - total_h) // 2
    
    # ========== 绘制元素 ==========
    current_y = start_y
    
    # 主标题（居中）
    title_x = center_x - title_w // 2
    draw_glow_text(draw, title_x, current_y, title_text, title_font, NEON_PINK, TEXT_COLOR)
    current_y += title_h + gap_small
    
    # 副标题（居中）
    sub_x = center_x - sub_w // 2
    draw_glow_text(draw, sub_x, current_y, sub_text, subtitle_font, NEON_CYAN, NEON_CYAN)
    current_y += sub_h + gap_medium
    
    # 分隔线（居中）
    line_y = current_y
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
    current_y += 20 + gap_medium
    
    # 9个Skills - 3x3网格布局
    colors = [NEON_PINK, NEON_CYAN, NEON_PURPLE]
    
    card_w = 300
    card_h = 60
    gap_x = 30
    gap_y = 20
    
    grid_start_x = center_x - (card_w * 3 + gap_x * 2) // 2
    
    for idx, (num, name) in enumerate(skills):
        row = idx // 3
        col = idx % 3
        x = grid_start_x + col * (card_w + gap_x)
        y = current_y + row * (card_h + gap_y)
        
        card_color = colors[col]
        
        # 卡片背景
        for i in range(card_h):
            ratio = 1 - abs(card_h/2 - i) / (card_h/2)
            r = int(card_color[0] * ratio * 0.15)
            g = int(card_color[1] * ratio * 0.15)
            b = int(card_color[2] * ratio * 0.15)
            draw.line([(x, y+i), (x+card_w, y+i)], fill=(r, g, b), width=1)
        
        # 卡片边框
        draw.rectangle([x, y, x+card_w, y+card_h], outline=card_color, width=2)
        
        # 文字
        label = f"{num} {name}"
        bbox = draw.textbbox((0, 0), label, font=skill_font)
        label_w = bbox[2] - bbox[0]
        label_h = bbox[3] - bbox[1]
        label_x = x + (card_w - label_w) // 2
        label_y = y + (card_h - label_h) // 2
        
        draw.text((label_x, label_y), label, font=skill_font, fill=card_color)
    
    current_y += (card_h + gap_y) * 3 + gap_large
    
    # 底部标签（居中）
    tags = ["一人公司", "创业指南", "AI Skills"]
    total_tags_w = sum([draw.textbbox((0, 0), t, font=tag_font)[2] for t in tags]) + len(tags) * 30
    tags_start_x = center_x - total_tags_w // 2
    tags_y = current_y
    
    cur_x = tags_start_x
    for tag in tags:
        bbox = draw.textbbox((0, 0), tag, font=tag_font)
        tag_w = bbox[2] - bbox[0]
        draw.rectangle([cur_x-10, tags_y-5, cur_x+tag_w+10, tags_y+35], fill=NEON_PINK + (30,))
        draw.text((cur_x, tags_y), tag, font=tag_font, fill=NEON_YELLOW)
        cur_x += tag_w + 30
    
    current_y += 50 + gap_large
    
    # 底部链接（居中）
    link_font = load_font(22)
    link_text = "GitHub: slavingia/skills"
    bbox = draw.textbbox((0, 0), link_text, font=link_font)
    link_w = bbox[2] - bbox[0]
    link_x = center_x - link_w // 2
    draw.text((link_x, current_y), link_text, font=link_font, fill=MUTED)
    
    output_path = os.path.join(ASSETS_DIR, "cover.png")
    img = img.convert('RGB')
    img.save(output_path, "PNG", quality=95)
    print(f"✅ 封面已保存: {output_path} ({WIDTH}×{HEIGHT})")
    return output_path

def create_cover_wechat():
    """生成微信公众号封面 (900×383)"""
    WIDTH, HEIGHT = 900, 383
    img = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)
    
    # 渐变背景
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(10 + ratio * 20)
        g = int(10 + ratio * 10)
        b = int(20 + ratio * 30)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    # 网格
    draw_grid(draw, WIDTH, HEIGHT, NEON_PINK, 45, 12)
    
    center_x = WIDTH // 2
    
    title_font = load_font(80)
    subtitle_font = load_font(32)
    link_font = load_font(20)
    
    # 主标题
    title_text = "极简创业"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    
    # 副标题
    sub_text = "一人公司的9个AI Skills"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=subtitle_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    
    # 计算总高度
    total_h = title_h + 15 + sub_h + 20 + 30
    start_y = (HEIGHT - total_h) // 2
    
    # 主标题（居中）
    title_x = center_x - title_w // 2
    draw_glow_text(draw, title_x, start_y, title_text, title_font, NEON_PINK, TEXT_COLOR)
    
    # 副标题（居中）
    sub_x = center_x - sub_w // 2
    sub_y = start_y + title_h + 15
    draw_glow_text(draw, sub_x, sub_y, sub_text, subtitle_font, NEON_CYAN, NEON_CYAN)
    
    # 分隔线
    line_y = sub_y + sub_h + 20
    line_w = 300
    for i in range(line_w):
        x = center_x - line_w // 2 + i
        ratio = i / line_w
        color = NEON_PINK if ratio < 0.5 else NEON_CYAN
        draw.line([(x, line_y), (x+1, line_y)], fill=color, width=1)
    
    # 底部链接
    link_text = "GitHub: slavingia/skills"
    bbox = draw.textbbox((0, 0), link_text, font=link_font)
    link_w = bbox[2] - bbox[0]
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