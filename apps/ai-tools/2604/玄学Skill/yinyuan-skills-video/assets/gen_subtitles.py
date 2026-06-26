#!/usr/bin/env python3
"""yinyuan-skills 字幕生成脚本 - 8px 竖屏标准"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/yinyuan-skills-video"
OUTPUT_PATH = os.path.join(PROJECT_DIR, "audio/subtitles.ass")

SUBTITLES = [
    (0, 3, "月老 · 姻缘测算 Skills，让 Claude Code 帮你算姻缘"),
    (3, 6, "想知道姻缘？传统测算太复杂"),
    (6, 9, "AI 测算又不靠谱"),
    (9, 12, "赛博月老帮你搞定"),
    (12, 15, "用中华传统术数帮你算姻缘"),
    (15, 18, "六大测算模式"),
    (18, 21, "八字合婚，看两个人的八字配不配"),
    (21, 24, "生肖配对，用生肖看合不合"),
    (24, 27, "紫微夫妻宫，看命盘里的婚姻格局"),
    (27, 30, "求签问姻缘，抽一支姻缘签"),
    (30, 33, "桃花运势，看近期的感情运势"),
    (33, 36, "红线测算，综合分析正缘特征和时间"),
    (36, 39, "不再依赖 AI 玄学幻觉"),
    (39, 42, "Prompt 约束加结构化知识库"),
    (42, 45, "姻缘测算透明可控"),
    (45, 48, "帮我测姻缘，我和某某配不配"),
    (48, 51, "什么时候能遇到对的人"),
    (51, 54, "姻缘天注定，幸福自己争"),
    (54, 57, "早日觅得良缘"),
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
    lines.append("Title: yinyuan-skills")
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
