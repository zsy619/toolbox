#!/usr/bin/env python3
"""tarot-skill 字幕生成脚本 - 8px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/tarot-skill-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "Tarot Skill，AI 塔罗占卜 Agent Skill"),
    (3, 6, "想学塔罗占卜？"),
    (6, 9, "牌义太多记不住"),
    (9, 12, "牌阵太复杂不知道怎么用"),
    (12, 15, "Tarot Skill 帮你搞定"),
    (15, 18, "为 Cursor、Claude Code、OpenClaw"),
    (18, 21, "等 AI agent 提供专业级塔罗解读能力"),
    (21, 24, "核心特性：78张完整牌义"),
    (24, 27, "韦特、托特、现代心理塔罗三大系统融合"),
    (27, 30, "每张大阿卡纳含心理原型与托特视角"),
    (30, 33, "6种牌阵"),
    (33, 36, "单张、三牌阵、五牌阵"),
    (36, 39, "月亮牌阵、马蹄形、凯尔特十字"),
    (39, 42, "真随机抽牌脚本 draw.py"),
    (42, 45, "密码学安全随机源"),
    (45, 48, "支持三大平台"),
    (48, 51, "Cursor、Claude Code、OpenClaw agents"),
    (51, 54, "AI 加塔罗"),
    (54, 57, "专业级塔罗解读"),
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
    lines.append("Title: tarot-skill")
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
