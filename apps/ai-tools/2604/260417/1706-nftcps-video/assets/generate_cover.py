#!/usr/bin/env python3
"""封面图生成器 - agency-agents 项目"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1920

def get_font(size, bold=False):
    candidates = [
        f"/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else f"/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/System/Library/Fonts/PingFang.ttc",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def draw_centered(draw, text, cy, font, color, max_width=None):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    if max_width and tw > max_width:
        # Scale down
        scale = max_width / tw
        new_size = int(font.size * scale)
        font = get_font(new_size, bold=True)
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    draw.text((x, cy), text, font=font, fill=color)

def create_cover():
    img = Image.new('RGB', (W, H), color='#0F172A')
    draw = ImageDraw.Draw(img)

    # Background gradient circles (blue/purple tech feel)
    for cx, cy, r, color in [
        (900, -100, 600, (59, 130, 246, 0.12)),
        (200, 1600, 500, (124, 58, 237, 0.10)),
        (800, 1800, 400, (59, 130, 246, 0.08)),
    ]:
        overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        r_hex = '#{:02X}{:02X}{:02X}'.format(*[int(c*255) for c in color[:3]])
        alpha = int(color[3] * 255)
        import math
        for dx in range(0, W, 2):
            for dy in range(0, H, 2):
                dist = math.sqrt((dx - cx)**2 + (dy - cy)**2)
                if dist < r:
                    dist_ratio = 1 - (dist / r)
                    a = int(alpha * dist_ratio)
                    if a > 0:
                        overlay.putpixel((dx, dy), (int(color[0]*255), int(color[1]*255), int(color[2]*255), a))
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')

    # Tag label
    f_tag = get_font(28, bold=True)
    tag_text = "⚡ GitHub Trending · AI 工具"
    draw_centered(draw, tag_text, 160, f_tag, '#94A3B8')

    # Main title - line 1
    f_title = get_font(105, bold=True)
    draw_centered(draw, "还在自己写", 480, f_title, '#F1F5F9', max_width=980)
    draw_centered(draw, "系统提示词？", 600, f_title, '#EF4444', max_width=980)

    # Subtitle
    f_sub = get_font(52, bold=True)
    draw_centered(draw, "这个开源项目", 820, f_sub, '#F1F5F9', max_width=980)
    draw_centered(draw, "领先你一个版本", 890, f_sub, '#3B82F6', max_width=980)

    # Separator
    sep_y = 1040
    draw.rectangle([360, sep_y, 720, sep_y + 3], fill='#3B82F6')

    # Stats block
    f_stat_title = get_font(32, bold=True)
    f_stat_val = get_font(56, bold=True)
    draw_centered(draw, "80+", 1120, f_stat_val, '#3B82F6')
    draw_centered(draw, "AI 专家代理", 1190, f_stat_title, '#94A3B8')
    draw_centered(draw, "按真实公司部门组织", 1250, f_stat_title, '#64748B')

    # Departments
    deps = [("💻 工程", '#3B82F6'), ("🎨 设计", '#8B5CF6'), ("📢 营销", '#F97316'), ("💼 销售", '#10B981')]
    f_dep = get_font(30, bold=True)
    total_w = sum([draw.textbbox((0, 0), d[0], font=f_dep)[2] + 30 for d in deps])
    start_x = (W - total_w) // 2
    x = start_x
    for label, color in deps:
        bbox = draw.textbbox((0, 0), label, font=f_dep)
        tw = bbox[2] - bbox[0]
        draw.text((x, 1400), label, font=f_dep, fill=color)
        x += tw + 30

    # Bottom CTA
    f_cta = get_font(34, bold=True)
    draw_centered(draw, "🔗 github.com/msitarzewski/agency-agents", 1680, f_cta, '#64748B')

    # Border
    draw.rectangle([0, 0, W-1, H-1], outline='#334155', width=2)

    path = "/Volumes/OpenClawDrive/.openclaw/workspace/nftcps-video/docs/assets/cover.png"
    img.save(path, 'PNG', quality=95)
    print(f"✅ 封面已生成: {path} ({W}×{H})")

if __name__ == '__main__':
    create_cover()
