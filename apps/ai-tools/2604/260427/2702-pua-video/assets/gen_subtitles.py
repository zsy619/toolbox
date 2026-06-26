#!/usr/bin/env python3
"""PUA 字幕生成脚本 - 8px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/pua-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "PUA，让 AI 不敢偷懒的技能插件"),
    (3, 6, "大部分人以为是在搞抽象，其实这是最大的误解"),
    (6, 9, "让你的 Claude Code 效率翻倍，产出翻倍"),
    (9, 12, "用中西大厂 PUA 话术驱动 AI"),
    (12, 15, "穷尽所有方案才允许放弃"),
    (15, 18, "三重能力：PUA 话术让 AI 不敢放弃"),
    (18, 21, "调试方法论让 AI 有能力不放弃"),
    (21, 24, "能动性鞭策让 AI 主动出击"),
    (24, 27, "AI 的五大偷懒模式"),
    (27, 30, "暴力重试跑三遍说搞不定"),
    (30, 33, "甩锅用户建议手动处理"),
    (33, 36, "工具闲置有搜索不搜"),
    (36, 39, "磨洋工原地打转"),
    (39, 42, "被动等待修完就停"),
    (42, 45, "真实案例：MCP Server 调试"),
    (45, 48, "AI 原地打转多次后，PUA 触发七项检查清单"),
    (48, 51, "系统化检查找到根因"),
    (51, 54, "支持九大平台：Claude Code、Cursor、VSCode Copilot 等"),
    (54, 57, "安装超简单，一条命令搞定"),
    (57, 61, "开源免费，GitHub：tanweai slash pua"),
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
    lines.append("Title: PUA")
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
