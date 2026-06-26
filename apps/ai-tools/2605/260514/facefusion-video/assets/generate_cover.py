#!/usr/bin/env python3
"""
FaceFusion 视频封面生成
9:16 竖屏 1080×1920，科技警示风格
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 封面尺寸
W, H = 1080, 1920

# 颜色配置（科技警示风）
BG_TOP = (15, 5, 5)       # 深红黑渐变顶部
BG_BOTTOM = (5, 10, 20)   # 深蓝黑渐变底部
RED = (239, 68, 68)        # 警示红 #EF4444
GOLD = (251, 191, 36)      # 金色 #FBBF24
WHITE = (241, 245, 249)    # 白色 #F1F5F9
MUTED = (148, 163, 184)    # 灰色 #94A3B8
DARK_RED = (127, 29, 29)   # 深红 #7F1D1D

def create_gradient(img):
    """创建垂直渐变背景"""
    draw = ImageDraw.Draw(img)
    for y in range(H):
        ratio = y / H
        r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * ratio)
        g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * ratio)
        b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
    return img

def get_font(size, bold=False):
    """获取系统字体"""
    font_paths = [
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
    return ImageFont.load_default()

def draw_centered_text(draw, text, y, font, color, max_width=None):
    """绘制居中文字，支持自动换行"""
    if max_width is None:
        max_width = W - 80

    # 简单换行处理
    lines = []
    current = ""
    for char in text:
        test = current + char
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = char
    if current:
        lines.append(current)

    line_h = font.size * 1.4
    total_h = line_h * len(lines)
    start_y = y - total_h / 2

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        text_w = bbox[2] - bbox[0]
        x = (W - text_w) // 2
        draw.text((x, start_y + i * line_h), line, font=font, fill=color)

    return start_y, len(lines)

def create_cover():
    img = Image.new("RGB", (W, H), (0, 0, 0))
    img = create_gradient(img)
    draw = ImageDraw.Draw(img)

    # === 顶部警示标签 ===
    tag_font = get_font(28)
    tag = "⚠️ 安全警示"
    bbox = draw.textbbox((0, 0), tag, font=tag_font)
    tag_w = bbox[2] - bbox[0]
    tag_h = bbox[3] - bbox[1]
    tag_x = (W - tag_w) // 2
    tag_y = 180

    # 标签背景
    draw.rounded_rectangle(
        [tag_x - 20, tag_y - 8, tag_x + tag_w + 20, tag_y + tag_h + 8],
        radius=20, fill=(239, 68, 68, 30)
    )
    draw.text((tag_x, tag_y), tag, font=tag_font, fill=RED)

    # === 主标题 ===
    title_font_large = get_font(130, bold=True)
    title1 = "AI换脸诈骗"
    title2 = "已经在发生了"

    # 计算位置
    combined = title1 + "\n" + title2
    lines = combined.split("\n")
    total_text_h = 0
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=title_font_large)
        total_text_h += (bbox[3] - bbox[1]) * 1.1
    start_y = (H // 2) - (total_text_h // 2) - 30

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=title_font_large)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        x = (W - text_w) // 2
        y = start_y + i * text_h * 1.1
        color = RED if i == 1 else WHITE
        draw.text((x, y), line, font=title_font_large, fill=color)

    # === 分隔线 ===
    line_y = start_y + total_text_h + 30
    draw.line([(W * 0.2, line_y), (W * 0.8, line_y)], fill=GOLD, width=2)

    # === GitHub Stars 徽章 ===
    badge_font = get_font(32)
    badge = "⭐ GitHub 27,500 Stars"
    bbox = draw.textbbox((0, 0), badge, font=badge_font)
    badge_w = bbox[2] - bbox[0]
    badge_h = bbox[3] - bbox[1]
    badge_x = (W - badge_w) // 2
    badge_y = line_y + 25

    draw.rounded_rectangle(
        [badge_x - 16, badge_y - 6, badge_x + badge_w + 16, badge_y + badge_h + 6],
        radius=14, fill=(59, 130, 246, 30)
    )
    draw.text((badge_x, badge_y), badge, font=badge_font, fill=(96, 165, 250))

    # === 底部副标题 ===
    subtitle_font = get_font(36)
    subtitle = "FaceFusion 开源AI换脸风险警示"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    sub_w = bbox[2] - bbox[0]
    sub_x = (W - sub_w) // 2
    sub_y = H - 200
    draw.text((sub_x, sub_y), subtitle, font=subtitle_font, fill=MUTED)

    # === 右上角装饰光效 ===
    for i in range(5):
        alpha = 40 - i * 7
        size = 300 + i * 60
        offset = (W - size) // 2
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)
        # 用椭圆模拟光晕
        odraw.ellipse(
            [offset - 200, -100, offset + size + 200, 500],
            fill=(220, 38, 38, alpha)
        )
        img = Image.alpha_composite(img.convert("RGBA"), overlay)

    return img.convert("RGB")

if __name__ == "__main__":
    output_path = "/Volumes/OpenClawDrive/.openclaw/workspace/facefusion-video/docs/assets/cover.png"
    cover = create_cover()
    cover.save(output_path, "PNG", quality=95)
    print(f"✅ 封面已生成: {output_path}")
    print(f"   尺寸: {cover.size[0]}×{cover.size[1]}")
