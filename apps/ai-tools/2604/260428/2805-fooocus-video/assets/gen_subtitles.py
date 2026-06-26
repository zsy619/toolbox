#!/usr/bin/env python3
"""
Fooocus 字幕生成脚本
基于实际音频时长 52.115秒
"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/fooocus-video"
AUDIO_DIR = os.path.join(PROJECT_DIR, "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

FPS = 60
DURATION = 52.115
TOTAL_FRAMES = int(DURATION * FPS)

SCENES = [
    (0, 180, "想用AI生成Midjourney级别的图片，却不想付费？"),
    (180, 480, "Midjourney每月至少两百块，Stable Diffusion操作复杂门槛高，提示词调参更是让人头疼。"),
    (480, 900, "现在Fooocus来了。完全免费，开源离线可用，从下载到出第一张图，鼠标点击不超过三次。"),
    (900, 1500, "它内置GPT-2提示词引擎，帮你优化提示词。支持图生图、局部重绘、多种风格预设，效果媲美Midjourney。"),
    (1500, 2280, "变现思路很简单。接电商卖家的单，帮他们把商品P到各种高端背景；或者帮网文作者生成定制的小说推文插画。熟练之后出图极快，赚的是工具效率差。"),
    (2280, 2700, "用起来也简单，Windows用户下载解压运行run.bat，或者用GitHub上的Colab链接云端免费跑。"),
    (2700, 3127, "GitHub已斩获三万多星，完全开源免费。工具效率差就在那里，就看你能不能抓住。"),
]

def frame_to_time(frame):
    total = frame / FPS
    h = int(total // 3600)
    m = int((total % 3600) // 60)
    s = int(total % 60)
    cs = int((total % 1) * 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def split_text(text, max_chars=20):
    lines, current = [], ""
    for c in text:
        if c in "，、。；：！？""''（）":
            current += c
        elif len(current) >= max_chars:
            lines.append(current)
            current = ""
        else:
            current += c
    if current:
        lines.append(current)
    return lines or [text]

def generate_ass():
    ass = f"""[Script Info]
Title: Fooocus 字幕
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    for start, end, text in SCENES:
        lines = split_text(text)
        content = "\\N".join(lines)
        ass += f"Dialogue: 0,{frame_to_time(start)},{frame_to_time(end)},Default,,30,30,30,,{content}\n"
    return ass

output = os.path.join(AUDIO_DIR, "subtitles.ass")
with open(output, 'w', encoding='utf-8') as f:
    f.write(generate_ass())
print(f"✅ 字幕已保存: {output}")
print(f"📊 总时长: {DURATION:.3f}秒, 总帧数: {TOTAL_FRAMES}")