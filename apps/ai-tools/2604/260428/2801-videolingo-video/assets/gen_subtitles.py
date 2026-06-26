#!/usr/bin/env python3
"""
VideoLingo 字幕生成脚本
基于实际音频时长 48.081秒
"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/videolingo-video"
AUDIO_DIR = os.path.join(PROJECT_DIR, "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

FPS = 60
DURATION = 48.081
TOTAL_FRAMES = int(DURATION * FPS)

SCENES = [
    (0, 180, "你想过把YouTube博主的视频翻译成中文，发到B站月入过万吗？"),
    (180, 480, "现在市面上的翻译工具，机器翻译生硬、字幕拆行混乱、配音听着像机器人。"),
    (480, 900, "VideoLingo来了。它能做出媲美Netflix级别的字幕效果，用三步翻译-反思-适应流程，消除生硬机器翻译。"),
    (900, 1500, "它用WhisperX做词级识别，NLP加持智能断句，只出单行字幕告别拆行混乱，然后通过多TTS接口配上自然配音。"),
    (1500, 2100, "变现思路很简单：把YouTube上的前沿播客翻译成中文发B站，或者把国内爆款翻译成英文发TikTok。纯靠打破语言壁垒赚流量分成。"),
    (2100, 2520, "用起来也简单，git clone，setup，自动配置环境，streamlit一键启动。"),
    (2520, 3000, "GitHub已斩获八千七百星，Apache 2.0协议完全免费。还在等什么？"),
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
Title: VideoLingo 字幕
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