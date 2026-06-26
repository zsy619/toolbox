#!/usr/bin/env python3
"""字幕生成器 - 从文本生成 ASS 格式字幕"""

import re
import math

DURATION = 45.0  # 视频时长（秒）
FONT = "PingFang SC"
FONT_SIZE = 10
PRIMARY_COLOR = "&H0000FFFF"  # 黄色
OUTLINE_COLOR = "&H00000000"  # 黑色
BACK_COLOR = "&H00000000"
OUTLINE = 1
SHADOW = 0
ALIGN = 2  # 底部居中
MARGIN_L = 30
MARGIN_R = 30
MARGIN_V = 30
WRAP_STYLE = 0

# 字幕文本（按时间顺序排列）
SUBTITLES = [
    (0.0, 4.0, "Obscura 是一个用 Rust 编写的开源无头浏览器"),
    (4.0, 8.0, "专为 AI Agent 自动化和网页抓取设计"),
    (8.0, 13.0, "传统无头浏览器内存占用大、启动慢、容易被检测"),
    (13.0, 17.0, "Obscura 完美解决了这些问题"),
    (17.0, 21.0, "内存仅 30MB，速度 85ms"),
    (21.0, 26.0, "内置反检测功能，Stealth 模式"),
    (26.0, 30.0, "兼容 Puppeteer 和 Playwright"),
    (30.0, 34.0, "一行命令安装，无需 Chrome 或 Node.js"),
    (34.0, 38.0, "GitHub 搜索 obscura"),
    (38.0, 43.0, "802 Stars，Apache 2.0 开源"),
]

def format_time(seconds):
    """将秒数转换为 ASS 时间格式 (H:MM:SS.CC)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:05.2f}"

def wrap_text(text, max_chars=20):
    """智能换行"""
    if len(text) <= max_chars:
        return [text]
    
    words = text.split()
    lines = []
    current_line = []
    current_len = 0
    
    for word in words:
        if current_len + len(word) + 1 <= max_chars:
            current_line.append(word)
            current_len += len(word) + 1
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
            current_len = len(word)
    
    if current_line:
        lines.append(' '.join(current_line))
    
    return lines if lines else [text]

def generate_ass():
    """生成 ASS 字幕文件"""
    ass_content = f"""[Script Info]
Title: Obscura 字幕
ScriptType: v4.00+
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{FONT},{FONT_SIZE},{PRIMARY_COLOR},{PRIMARY_COLOR},{OUTLINE_COLOR},{BACK_COLOR},0,0,0,0,100,100,0,0,1,{OUTLINE},{SHADOW},{ALIGN},{MARGIN_L},{MARGIN_R},{MARGIN_V},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    
    for start, end, text in SUBTITLES:
        wrapped_lines = wrap_text(text, 25)
        for line in wrapped_lines:
            start_time = format_time(start)
            end_time = format_time(end)
            ass_content += f"Dialogue: 0,{start_time},{end_time},Default,,0,0,0,,{line}\n"
    
    return ass_content

if __name__ == "__main__":
    import os
    PROJECT = '/Users/zhushuyan/VideoProjects/obscura-video'
    OUTPUT = f"{PROJECT}/audio/subtitles.ass"
    
    os.makedirs(f"{PROJECT}/audio", exist_ok=True)
    
    ass_content = generate_ass()
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(ass_content)
    
    print(f"✅ 字幕已生成: {OUTPUT}")
    print(f"   时长: {DURATION}秒")
    print(f"   字幕数: {len(SUBTITLES)}条")