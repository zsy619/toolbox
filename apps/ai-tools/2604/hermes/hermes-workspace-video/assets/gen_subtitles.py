#!/usr/bin/env python3
"""Hermes Workspace 字幕生成脚本 - 10px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/hermes-workspace-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "Hermes Workspace"),
    (3, 5, "微信中的 AI 助手"),
    (5, 8, "你有没有遇到过这些情况？"),
    (8, 11, "在外面收到工作消息，要打开电脑才能处理"),
    (11, 14, "想让 AI 助手帮忙查东西，得专门打开对话界面"),
    (14, 17, "今天推荐一个开源工具 Hermes Workspace"),
    (17, 20, "用它可以在微信里直接控制 Hermes Agent"),
    (20, 23, "这个工具最牛的地方就是 WeChat 桥接功能"),
    (23, 26, "在微信中发送指令给 Agent"),
    (26, 29, "Agent 自动执行任务"),
    (29, 32, "结果实时推送回微信"),
    (32, 35, "就像有了24小时在线的 AI 助理"),
    (35, 38, "随时响应你的微信消息"),
    (38, 41, "适用场景：日程管理自动化、信息查询、任务提醒"),
    (41, 44, "技术特点：实时 SSE 流零延迟"),
    (44, 47, "安全认证数据有保障"),
    (47, 50, "PWA 手机电脑同步"),
    (50, 53, "Docker 一键部署"),
    (53, 56, "一条命令 docker compose up"),
    (56, 60, "开源免费 GitHub：outsourc-e slash hermes-workspace"),
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
    lines.append("Title: Hermes Workspace")
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
