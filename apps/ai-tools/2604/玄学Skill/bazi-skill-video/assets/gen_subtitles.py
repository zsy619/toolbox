#!/usr/bin/env python3
"""bazi-skill 字幕生成脚本 - 8px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/bazi-skill-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "赛博算命 Skill，让 Claude Code 帮你批八字"),
    (3, 6, "想批八字？查书太麻烦"),
    (6, 9, "找大师太贵，等待时间太长"),
    (9, 12, "赛博算命 Skill 帮你搞定"),
    (12, 15, "基于 Claude Code 的八字排盘与命理分析工具"),
    (15, 18, "通过交互式对话收集出生信息"),
    (18, 21, "排出四柱八字"),
    (21, 24, "三大功能：信息收集、排盘计算、综合分析"),
    (24, 27, "参照九本经典典籍"),
    (27, 30, "穷通宝典、三命通会、滴天髓"),
    (30, 33, "渊海子平、千里命稿、协纪辨方书"),
    (33, 36, "果老星宗、子平真诠、神峰通考"),
    (36, 39, "在 Claude Code 中输入关键词即可触发"),
    (39, 42, "算八字、看八字、批八字、排八字"),
    (42, 45, "科技与传统结合"),
    (45, 48, "让命理分析更简单"),
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
    lines.append("Title: bazi-skill")
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
