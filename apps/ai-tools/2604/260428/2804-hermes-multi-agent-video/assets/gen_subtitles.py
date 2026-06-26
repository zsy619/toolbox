#!/usr/bin/env python3
"""Multi-Agent Team 字幕生成脚本 - 8px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/hermes-multi-agent-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "Multi-Agent Team，让 AI 各司其职"),
    (3, 6, "大多数人会选择一个 AI 助手"),
    (6, 9, "试图让它同时成为研究员、作家、程序员"),
    (9, 12, "项目经理和运营者"),
    (12, 15, "这通常能撑一段时间"),
    (15, 18, "然后，人格开始混乱"),
    (18, 21, "解决方案是构建 Multi-Agent Team"),
    (21, 24, "让研究员 Agent 专注信息搜集和分析"),
    (24, 27, "让作家 Agent 专注内容创作"),
    (27, 30, "让程序员 Agent 专注代码编写"),
    (30, 33, "让项目经理 Agent 专注任务协调"),
    (33, 36, "让运营 Agent 专注执行落地"),
    (36, 39, "各司其职，效率翻倍"),
    (39, 42, "专注力更强，一致性更高"),
    (42, 45, "可扩展，可协作"),
    (45, 48, "在 Hermes 中轻松构建 Multi-Agent Team"),
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
    lines.append("Title: Multi-Agent Team")
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
