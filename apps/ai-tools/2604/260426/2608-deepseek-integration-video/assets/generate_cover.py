#!/usr/bin/env python3
"""DeepSeek 实用集成 - 大字体居中封面"""
from PIL import Image, ImageDraw, ImageFont
import os

# 封面尺寸（9:16 竖屏）
WIDTH = 1080
HEIGHT = 1920

# 赛博朋克颜色
BG_COLOR = (13, 13, 26)
NEON_CYAN = (0, 255, 255)
NEON_MAGENTA = (255, 0, 255)
NEON_PURPLE = (157, 0, 255)
GRID_COLOR = (26, 26, 58)
TEXT_COLOR = (255, 255, 255)
MUTED_COLOR = (136, 136, 170)

# 字体路径
FONT_PATH = "/System/Library/Fonts/STHeiti Medium.ttc"
FONT_PINGFANG = "/System/Library/Fonts/PingFang.ttc"

def create_cover():
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # 绘制背景网格
    for x in range(0, WIDTH, 60):
        draw.line([(x, 0), (x, HEIGHT)], fill=GRID_COLOR, width=1)
    for y in range(0, HEIGHT, 60):
        draw.line([(0, y), (WIDTH, y)], fill=GRID_COLOR, width=1)

    # 顶部霓虹光效
    for i in range(100):
        alpha = int(50 * (1 - i / 100))
        draw.rectangle([(0, i * 4), (WIDTH, i * 4 + 10)], fill=(0, 255, 255, alpha))

    # 底部霓虹光效
    for i in range(80):
        alpha = int(45 * (1 - i / 80))
        draw.rectangle([(0, HEIGHT - 80 * 4 + i * 4), (WIDTH, HEIGHT - 80 * 4 + i * 4 + 10)], fill=(255, 0, 255, alpha))

    # 字体设置 - 超大字体
    try:
        font_deepseek = ImageFont.truetype(FONT_PATH, 400)  # 主标题 400px
        font_jiti = ImageFont.truetype(FONT_PATH, 280)      # 副标题 280px
        font_desc = ImageFont.truetype(FONT_PINGFANG, 100)  # 描述 100px
        font_link = ImageFont.truetype(FONT_PINGFANG, 36)   # 链接 36px
    except:
        font_deepseek = ImageFont.load_default()
        font_jiti = ImageFont.load_default()
        font_desc = ImageFont.load_default()
        font_link = ImageFont.load_default()

    # 计算文本实际宽度，确保居中且不超出边界
    def get_center_x(text, font):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        return (WIDTH - text_w) // 2

    # 主标题
    deepseek_text = "DeepSeek"
    deepseek_y = HEIGHT // 2 - 300
    for offset in range(6, 0, -1):
        for dx, dy in [(0, -offset), (0, offset), (-offset, 0), (offset, 0)]:
            draw.text((get_center_x(deepseek_text, font_deepseek) + dx, deepseek_y + dy), deepseek_text, font=font_deepseek, fill=(0, 255, 255, 40))
    x = get_center_x(deepseek_text, font_deepseek)
    draw.text((x, deepseek_y), deepseek_text, font=font_deepseek, fill=NEON_CYAN)

    # 副标题
    jiti_text = "实用集成"
    jiti_y = deepseek_y + 420
    for offset in range(4, 0, -1):
        for dx, dy in [(0, -offset), (0, offset), (-offset, 0), (offset, 0)]:
            draw.text((get_center_x(jiti_text, font_jiti) + dx, jiti_y + dy), jiti_text, font=font_jiti, fill=(255, 0, 255, 40))
    x = get_center_x(jiti_text, font_jiti)
    draw.text((x, jiti_y), jiti_text, font=font_jiti, fill=NEON_MAGENTA)

    # 描述
    desc_text = "将大模型能力接入各类软件"
    desc_y = jiti_y + 300
    x = get_center_x(desc_text, font_desc)
    draw.text((x, desc_y), desc_text, font=font_desc, fill=NEON_PURPLE)

    # 底部链接
    link_text = "github.com/deepseek-ai/awesome-deepseek-integration"
    link_y = HEIGHT - 120
    x = get_center_x(link_text, font_link)
    draw.text((x, link_y), link_text, font=font_link, fill=MUTED_COLOR)

    # 保存
    output_path = os.path.join(os.path.dirname(__file__), "cover.png")
    img.save(output_path, "PNG", optimize=True)
    print(f"✅ 封面已生成: {output_path}")
    print(f"   尺寸: {WIDTH}x{HEIGHT}")
    print(f"   主标题: 400px, 副标题: 280px, 描述: 100px")

if __name__ == "__main__":
    create_cover()
