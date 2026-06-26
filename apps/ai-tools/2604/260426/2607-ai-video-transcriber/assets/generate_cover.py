#!/usr/bin/env python3
"""
AI Video Transcriber 封面图生成脚本 - PIL纯代码版本
遵循 video-creator 技能规范，使用系统字体生成专业的 tech-modern 风格封面
"""
from PIL import Image, ImageDraw, ImageFont
import os

# 项目配置
PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/ai-video-transcriber"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "docs/assets/cover.png")

# 尺寸配置（竖屏 9:16）
WIDTH = 1080
HEIGHT = 1920

# 颜色配置
BG_COLOR = "#0F172A"        # 深色背景
PRIMARY_COLOR = "#3B82F6"   # 蓝色主色
SECONDARY_COLOR = "#22D3EE" # 青色辅助色
TEXT_COLOR = "#F8FAFC"      # 白色文字
ACCENT_COLOR = "#F97316"    # 橙色点缀

def get_system_font(size, weight="normal"):
    """获取系统字体"""
    font_paths = []
    if weight == "bold":
        font_paths.extend([
            "/System/Library/Fonts/STHeiti Medium.ttc",
            "/System/Library/Fonts/PingFang.ttc",
            "/System/Library/Fonts/Hiragino Sans GB.ttc",
            "/System/Library/Fonts/Arial Bold.ttf",
        ])
    else:
        font_paths.extend([
            "/System/Library/Fonts/STHeiti Light.ttc",
            "/System/Library/Fonts/PingFang.ttc",
            "/System/Library/Fonts/Hiragino Sans GB.ttc",
            "/System/Library/Fonts/Arial.ttf",
        ])
    
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_gradient_background(img):
    """绘制渐变背景"""
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(15 + ratio * 10)
        g = int(23 + ratio * 8)
        b = int(42 + ratio * 15)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    return draw

def draw_decorative_elements(draw):
    """绘制装饰性网格线和粒子"""
    # 网格线
    for i in range(-2, 3):
        y = HEIGHT // 2 + i * 120
        if 0 < y < HEIGHT:
            draw.line([(80, y), (WIDTH - 80, y)], fill=(59, 130, 246, 25), width=1)
    for i in range(-3, 4):
        x = WIDTH // 2 + i * 100
        if 0 < x < WIDTH:
            draw.line([(x, 300), (x, HEIGHT - 300)], fill=(59, 130, 246, 25), width=1)
    
    # 粒子效果（固定位置）
    import random
    random.seed(42)
    for _ in range(60):
        x = random.randint(50, WIDTH - 50)
        y = random.randint(50, HEIGHT - 50)
        size = random.randint(1, 3)
        alpha = random.randint(40, 120)
        color = (59, 130, 246, alpha)
        draw.ellipse([x-size, y-size, x+size, y+size], fill=color)

def draw_top_bottom_bars(draw):
    """绘制顶部和底部装饰条"""
    draw.rectangle([(0, 0), (WIDTH, 8)], fill=PRIMARY_COLOR)
    draw.rectangle([(0, HEIGHT - 8), (WIDTH, HEIGHT)], fill=PRIMARY_COLOR)

def draw_center_glow(draw):
    """绘制中心光晕效果"""
    # 左上角光晕
    draw.ellipse([(-200, -200), (400, 400)], fill=(59, 130, 246, 15))
    # 右下角光晕
    draw.ellipse([(WIDTH - 400, HEIGHT - 400), (WIDTH + 200, HEIGHT + 200)], fill=(34, 211, 238, 10))

def main():
    # 创建图片
    img = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # 绘制背景和装饰
    draw_gradient_background(img)
    draw_decorative_elements(draw)
    draw_center_glow(draw)
    draw_top_bottom_bars(draw)
    
    # 字体
    title_font = get_system_font(90, "bold")
    subtitle_font = get_system_font(38)
    tag_font = get_system_font(28)
    url_font = get_system_font(24)
    
    center_x = WIDTH // 2
    
    # 顶部标签
    tag_text = "🎬 开源项目"
    bbox = draw.textbbox((0, 0), tag_text, font=subtitle_font)
    text_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_w) // 2, 150), tag_text, fill=SECONDARY_COLOR, font=subtitle_font)
    
    # 主标题 - 第一行
    title1 = "AI Video"
    bbox = draw.textbbox((0, 0), title1, font=title_font)
    text_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_w) // 2, 300), title1, fill=TEXT_COLOR, font=title_font)
    
    # 主标题 - 第二行（蓝色渐变效果）
    title2 = "Transcriber"
    bbox = draw.textbbox((0, 0), title2, font=title_font)
    text_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_w) // 2, 390), title2, fill=PRIMARY_COLOR, font=title_font)
    
    # 副标题
    subtitle = "用AI转录和总结视频/播客"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    text_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_w) // 2, 560), subtitle, fill=TEXT_COLOR, font=subtitle_font)
    
    # 特性标签（两行，每行2个）
    tags_row1 = [("🎥", "30+平台", "#3B82F6"), ("⚡", "秒级提取", "#22D3EE")]
    tags_row2 = [("🤖", "AI优化", "#8B5CF6"), ("🌍", "100+语言", "#10B981")]
    
    tag_box_w = 200
    tag_box_h = 56
    tag_gap = 30
    
    # 第一行
    total_w = len(tags_row1) * tag_box_w + (len(tags_row1) - 1) * tag_gap
    start_x = (WIDTH - total_w) // 2
    y = 780
    
    for icon, text, color in tags_row1:
        x = start_x + tags_row1.index((icon, text, color)) * (tag_box_w + tag_gap)
        # 圆角矩形背景
        draw.rounded_rectangle([x, y, x + tag_box_w, y + tag_box_h], radius=14, fill=(30, 41, 59, 200))
        # 标签文字
        tag_str = f"{icon} {text}"
        bbox = draw.textbbox((0, 0), tag_str, font=tag_font)
        tw = bbox[2] - bbox[0]
        draw.text((x + (tag_box_w - tw) // 2, y + 14), tag_str, fill=TEXT_COLOR, font=tag_font)
    
    # 第二行
    total_w = len(tags_row2) * tag_box_w + (len(tags_row2) - 1) * tag_gap
    start_x = (WIDTH - total_w) // 2
    y = 850
    
    for icon, text, color in tags_row2:
        x = start_x + tags_row2.index((icon, text, color)) * (tag_box_w + tag_gap)
        draw.rounded_rectangle([x, y, x + tag_box_w, y + tag_box_h], radius=14, fill=(30, 41, 59, 200))
        tag_str = f"{icon} {text}"
        bbox = draw.textbbox((0, 0), tag_str, font=tag_font)
        tw = bbox[2] - bbox[0]
        draw.text((x + (tag_box_w - tw) // 2, y + 14), tag_str, fill=TEXT_COLOR, font=tag_font)
    
    # 底部信息
    github = "github.com/wendy7756/AI-Video-Transcriber"
    bbox = draw.textbbox((0, 0), github, font=url_font)
    text_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_w) // 2, HEIGHT - 220), github, fill=(148, 163, 184), font=url_font)
    
    star_text = "⭐ 开源免费 · 欢迎Star"
    bbox = draw.textbbox((0, 0), star_text, font=url_font)
    text_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_w) // 2, HEIGHT - 175), star_text, fill=SECONDARY_COLOR, font=url_font)
    
    # 保存
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    img.convert('RGB').save(OUTPUT_PATH, 'PNG', quality=95)
    
    # 验证
    from PIL import Image as PILImage
    img_verify = PILImage.open(OUTPUT_PATH)
    bright_pixels = sum(1 for p in img_verify.getdata() if max(p[:3]) > 100)
    print(f"✅ 封面已生成: {OUTPUT_PATH}")
    print(f"   尺寸: {img_verify.size[0]}x{img_verify.size[1]}")
    print(f"   亮色像素: {bright_pixels} (>0表示文字已渲染)")
    
    if bright_pixels == 0:
        print("⚠️ 警告：封面可能没有正确渲染文字")

if __name__ == "__main__":
    main()