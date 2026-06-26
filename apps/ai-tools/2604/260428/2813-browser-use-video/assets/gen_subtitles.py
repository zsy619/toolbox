#!/usr/bin/env python3
"""
Browser Use 字幕生成脚本 - 大字号36px
基于实际音频时长 47.067秒
"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/browser-use-video"
AUDIO_DIR = os.path.join(PROJECT_DIR, "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

FPS = 60
DURATION = 47.067
TOTAL_FRAMES = int(DURATION * FPS)

SCENES = [
    (0, 180, "你想过让AI像真人一样自动操作浏览器吗？"),
    (180, 480, "手动搜索效率低，爬虫技术门槛高，精准客户难找。"),
    (480, 900, "现在Browser Use来了。你只要给它一句话，它就能像真人一样自动操作浏览器。"),
    (900, 1500, "它支持自然语言驱动，自动点击输入，云端隐身浏览器还能解决验证码。GitHub已斩获五万多星。"),
    (1500, 2280, "变现思路很简单。接了留学的单子，让它去小红书搜索'想去英国留学'的帖子，把博主ID提取到表格里。拿到这些精准客户名单，卖给中介或者自己做业务，都是实打实的需求。"),
    (2280, 2700, "用起来也简单。给它一句话任务，AI自动执行，结果直接返回。"),
    (2700, 2824, "GitHub已斩获五万多星，MIT协议完全免费。自动化获客，就在今天。"),
]

def frame_to_time(frame):
    total = frame / FPS
    h = int(total // 3600)
    m = int((total % 3600) // 60)
    s = int(total % 60)
    cs = int((total % 1) * 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def split_text(text, max_chars=10):
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
Title: Browser Use 字幕
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,36,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,30,30,60,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    for start, end, text in SCENES:
        lines = split_text(text)
        content = "\\N".join(lines)
        ass += f"Dialogue: 0,{frame_to_time(start)},{frame_to_time(end)},Default,,30,30,60,,{content}\n"
    return ass

output = os.path.join(AUDIO_DIR, "subtitles.ass")
with open(output, 'w', encoding='utf-8') as f:
    f.write(generate_ass())
print(f"✅ 字幕已保存: {output}")
print(f"📊 总时长: {DURATION:.3f}秒, 总帧数: {TOTAL_FRAMES}")
print(f"📊 帧率: {FPS}fps, 字号: 36px, 底部边距: 60px")