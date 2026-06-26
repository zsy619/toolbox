#!/usr/bin/env python3
"""Generate cyberpunk-style cover image for warp-terminal-video"""

from PIL import Image, ImageDraw, ImageFont
import os

# Colors
BG = "#0D0D1A"
NEON_CYAN = "#00FFFF"
NEON_MAGENTA = "#FF00FF"
NEON_GREEN = "#00FF88"
DARK_PURPLE = "#1A1A3A"
GRID_LINE = "#1A1A3A"
TEXT = "#FFFFFF"
MUTED = "#8888AA"

def get_font(size, bold=False):
    font_paths = [
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
    return ImageFont.loaddefault()

def draw_grid(draw, width, height):
    grid_size = min(width, height) * 0.05
    for x in range(0, width, int(grid_size)):
        draw.line([(x, 0), (x, height)], fill=GRID_LINE, width=1)
    for y in range(0, height, int(grid_size)):
        draw.line([(0, y), (width, y)], fill=GRID_LINE, width=1)

def draw_glow(draw, x, y, radius, color):
    for r in range(int(radius), 0, -5):
        alpha = int(255 * (1 - r / radius) * 0.3)
        draw.ellipse([x-r, y-r, x+r, y+r], fill=color + hex(alpha)[2:].zfill(2))

def create_cover(width, height, title, subtitle, filename, icon="🤖", tag="Agentic Development Environment"):
    img = Image.new('RGB', (width, height), BG)
    draw = ImageDraw.Draw(img)

    # Grid background
    draw_grid(draw, width, height)

    # Corner glows
    draw_glow(draw, int(width * 0.1), int(height * 0.1), height * 0.2, NEON_CYAN)
    draw_glow(draw, int(width * 0.9), int(height * 0.9), height * 0.2, NEON_MAGENTA)

    # Calculate font sizes based on cover type
    if height < 500:  # WeChat cover (short and wide)
        title_size = int(width * 0.07) - 20
        subtitle_size = int(width * 0.045)
        icon_size = int(width * 0.12)
        tag_size = int(width * 0.028)
        url_size = int(width * 0.022)
        title_y = height * 0.30
        subtitle_y = height * 0.50
        icon_y = height * 0.65
        tag_y = height * 0.82
        url_y = height * 0.95
    elif width > 1200:  # Xiaohongshu (tall)
        title_size = 120
        subtitle_size = int(height * 0.04)
        icon_size = int(height * 0.055)
        tag_size = int(height * 0.025)
        url_size = int(height * 0.018)
        title_y = height * 0.25
        subtitle_y = height * 0.40
        icon_y = height * 0.52
        tag_y = height * 0.62
        url_y = height * 0.92
    else:  # Vertical (1080x1920)
        title_size = 80
        subtitle_size = int(height * 0.04)
        icon_size = int(height * 0.055)
        tag_size = int(height * 0.025)
        url_size = int(height * 0.018)
        title_y = height * 0.25
        subtitle_y = height * 0.40
        icon_y = height * 0.52
        tag_y = height * 0.62
        url_y = height * 0.92

    title_font = get_font(title_size)
    subtitle_font = get_font(subtitle_size)
    icon_font = get_font(icon_size)
    tag_font = get_font(tag_size)
    url_font = get_font(url_size)

    # Title shadow/glow effect
    for offset in range(3, 0, -1):
        shadow_color = NEON_CYAN if offset == 1 else (50, 50, 50)
        draw.text((width//2 + offset, title_y + offset), title, font=title_font, fill=shadow_color, anchor='mm')

    draw.text((width//2, title_y), title, font=title_font, fill=TEXT, anchor='mm')

    # Subtitle with neon glow
    draw.text((width//2, subtitle_y), subtitle, font=subtitle_font, fill=NEON_CYAN, anchor='mm')

    # Icon
    draw.text((width//2, icon_y), icon, font=icon_font, anchor='mm')

    # Tag
    draw.text((width//2, tag_y), tag, font=tag_font, fill=MUTED, anchor='mm')

    # URL
    draw.text((width//2, url_y), "warp.dev", font=url_font, fill=NEON_GREEN, anchor='mm')

    img.save(filename, 'PNG')
    print(f"Generated: {filename} (title_size={title_size}, subtitle_size={subtitle_size})")

def main():
    base = os.path.dirname(os.path.abspath(__file__))

    # Vertical 1080x1920
    create_cover(1080, 1920, "Agentic Development\nEnvironment", "终端里的 AI 开发环境", os.path.join(base, "cover.png"))

    # WeChat 900x383
    create_cover(900, 383, "Agentic Development Environment", "终端里的 AI 开发环境", os.path.join(base, "cover-wechat.png"))

    # Xiaohongshu 1440x2560
    create_cover(1440, 2560, "Agentic Development\nEnvironment", "终端里的 AI 开发环境", os.path.join(base, "cover-xhs.png"))

if __name__ == '__main__':
    main()
