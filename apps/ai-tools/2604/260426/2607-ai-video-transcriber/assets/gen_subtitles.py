#!/usr/bin/env python3
"""AI Video Transcriber 字幕生成脚本 - 10px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/ai-video-transcriber"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

# 字幕内容（按时间轴分配，52秒视频分9个场景）
SUBTITLES = [
    (0, 3, "AI Video Transcriber"),
    (3, 5, "用AI转录和总结视频/播客"),
    (5, 8, "想看YouTube教程但没时间？"),
    (8, 10, "播客太干货听不完？"),
    (10, 13, "AI Video Transcriber帮你快速转成文字"),
    (13, 16, "🎥 支持30+平台"),
    (16, 18, "YouTube、TikTok、Bilibili"),
    (18, 20, "Apple Podcasts、SoundCloud"),
    (20, 23, "⚡ 字幕优先架构"),
    (23, 25, "有字幕直接提取，几秒搞定"),
    (25, 28, "没有字幕，Whisper自动转录"),
    (28, 31, "🤖 AI自动优化"),
    (31, 33, "自动纠错 · 智能分段落"),
    (33, 36, "🌍 支持100+语言"),
    (36, 39, "自动检测 · 条件翻译"),
    (39, 42, "🚀 三步搞定"),
    (42, 44, "① 粘贴视频链接"),
    (44, 46, "② 选择输出语言"),
    (46, 48, "③ 点击转录"),
    (48, 52, "⭐ github.com/wendy7756/AI-Video-Transcriber"),
]

def format_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    cs = int((secs - int(secs)) * 100)
    return f"{hours}:{minutes:02d}:{int(secs):02d}.{cs:02d}"

def generate_ass():
    lines = []
    lines.append("[Script Info]")
    lines.append("Title: AI Video Transcriber")
    lines.append("ScriptType: v4.00+")
    lines.append("Collisions: Normal")
    lines.append("PlayDepth: 0")
    lines.append("")
    lines.append("[V4+ Styles]")
    lines.append("Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding")
    # 10px 字体，黄色，底部居中，1px黑色描边
    lines.append("Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,1")
    lines.append("")
    lines.append("[Events]")
    lines.append("Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text")

    for start, end, text in SUBTITLES:
        start_t = format_time(start)
        end_t = format_time(end)
        line = f"Dialogue: 0,{start_t},{end_t},Default,,30,30,30,,{text}"
        lines.append(line)

    content = "\n".join(lines)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ 字幕已生成: {OUTPUT_PATH}")
    print(f"   字号: 10px（竖屏标准）")
    print(f"   共 {len(SUBTITLES)} 条字幕")

if __name__ == "__main__":
    generate_ass()
