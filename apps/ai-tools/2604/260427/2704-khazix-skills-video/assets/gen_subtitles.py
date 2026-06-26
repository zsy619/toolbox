#!/usr/bin/env python3
"""Khazix Skills 字幕生成脚本 - 10px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/khazix-skills-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "Khazix Skills"),
    (3, 5, "数字生命卡兹克的 AI 工具箱"),
    (5, 8, "Prompts 和 Skills 合集，把方法论变成可复用的工具"),
    (8, 11, "Prompts 轻量级，复制粘贴到任何 AI 对话就能用"),
    (11, 14, "Skills 重量级，Agent 自动加载，开箱即用"),
    (14, 17, "hv-analysis 是横纵分析法深度研究 Skill"),
    (17, 20, "自动联网收集信息，纵向追时间深度，横向追竞争广度"),
    (20, 23, "输出 PDF 报告，半小时出一份万字研究报告"),
    (23, 26, "khazix-writer 是公众号长文写作 Skill"),
    (26, 29, "包含写作风格规则、四层自检体系"),
    (29, 32, "内容方法论和风格示例库"),
    (32, 35, "安装超简单"),
    (35, 38, "在 Claude Code 里说「安装这个 skill」"),
    (38, 41, "加上 GitHub 地址就行"),
    (41, 44, "支持 Claude Code、OpenClaw、Codex"),
    (44, 48, "开源免费，MIT License"),
    (48, 52, "GitHub：KKKKhazix slash khazix-skills"),
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
    lines.append("Title: Khazix Skills")
    lines.append("ScriptType: v4.00+")
    lines.append("Collisions: Normal")
    lines.append("PlayDepth: 0")
    lines.append("")
    lines.append("[V4+ Styles]")
    lines.append("Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding")
    lines.append("Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,1")
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
    print(f"   字号: 10px | 共 {len(SUBTITLES)} 条")

if __name__ == "__main__":
    generate_ass()
