#!/usr/bin/env python3
"""Erduo Skills 字幕生成脚本 - 8px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/erduo-skills-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "Erduo Skills，耳朵技能库，为 AI Agent 赋能"),
    (3, 6, "六大核心技能"),
    (6, 9, "每日日报：多源抓取自动生成技术日报"),
    (9, 12, "Master-Worker 架构并行抓取"),
    (12, 15, "AK RSS 精选：十分制打分过滤"),
    (15, 18, "仅输出七分以上高质量内容"),
    (18, 21, "转录精修师：语音转文字精修为可读文章"),
    (21, 24, "保留原句原词，拒绝高度概括"),
    (24, 27, "翻译精修师：四步工作流"),
    (27, 30, "分析、初译、审校、终稿"),
    (30, 33, "支持中英、中日双向翻译"),
    (33, 36, "Web To Markdown：URL 路由抓取输出干净 Markdown"),
    (36, 39, "Gemini 水印移除：逆向 Alpha 算法去除水印"),
    (39, 42, "安装超简单：npx skills add erduo-skills"),
    (42, 46, "开源免费，MIT License"),
    (46, 50, "GitHub：rookie-ricardo slash erduo-skills"),
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
    lines.append("Title: Erduo Skills")
    lines.append("ScriptType: v4.00+")
    lines.append("Collisions: Normal")
    lines.append("PlayDepth: 0")
    lines.append("")
    lines.append("[V4+ Styles]")
    lines.append("Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding")
    lines.append("Style: Default,PingFang SC,8,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,1")
    lines.append("")
    lines.append("[Events]")
    lines.append("Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text")

    for start, end, text in SUBTITLES:
        start_t = format_time(start)
        end_t = format_time(end)
        line = f"Dialogue: 0,{start_t},{end_t},Default,,30,30,30,,{text}"
        lines.append(line)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"✅ 字幕已生成: {OUTPUT_PATH}")
    print(f"   字号: 8px | 共 {len(SUBTITLES)} 条")

if __name__ == "__main__":
    generate_ass()
