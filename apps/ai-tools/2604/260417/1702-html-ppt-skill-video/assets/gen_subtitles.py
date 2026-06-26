#!/usr/bin/env python3
"""Generate ASS subtitle file for html-ppt-skill video"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/html-ppt-skill-video"

NL = "\\N"

lines = [
    (0.50, 3.50, f"PPT这件事，大多数人还在{NL}用错误的方式做。"),
    (3.50, 8.50, f"用PowerPoint、Keynote点来点去，{NL}改一个主题全部返工，{NL}换个字体整个样式崩掉，{NL}做完还长得像2010年企业汇报。"),
    (8.50, 11.50, f"有人做了一个{NL}AI Agent技能，{NL}直接解决这个问题。"),
    (11.50, 17.50, f"html-ppt-skill，{NL}是一套专门给AI Agent调用的{NL}HTML幻灯片生成系统，{NL}纯静态，无需依赖任何传统PPT软件。"),
    (17.50, 23.00, f"它提供了24套精美主题，{NL}覆盖商务、科技、创意、{NL}学术等场景。"),
    (23.00, 28.00, f"31种专业布局，{NL}从封面到结尾全覆盖。"),
    (28.00, 33.50, f"20多种动画效果，{NL}打字机、渐入、滑动{NL}应有尽有。"),
    (33.50, 38.50, f"纯HTML实现，{NL}浏览器直接打开，{NL}跨平台零障碍。"),
    (38.50, 47.50, f"对比传统PPT，{NL}html-ppt-skill做到了{NL}主题更换一键完成，{NL}字体样式自动适配，{NL}动画声明式配置。"),
    (47.50, 53.00, f"更重要的是，{NL}它原生支持AI Agent集成，{NL}让你的AI助手{NL}真正帮你做PPT。"),
    (53.00, 57.00, f"完整项目链接见描述。"),
]

def format_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:05.2f}"

# Alignment=2: bottom center
# MarginL=30, MarginR=30: 30px from left and right edges
# MarginV=30: 30px from bottom edge
ass_content = """[Script Info]
Title: html-ppt-skill subtitles
ScriptType: v4.00+
PlayDepth: 0
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,12,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

for start, end, text in lines:
    start_str = format_time(start)
    end_str = format_time(end)
    ass_content += f"Dialogue: 0,{start_str},{end_str},Default,,30,30,30,,{text}\n"

output_path = os.path.join(PROJECT_DIR, "audio", "subtitles_58s.ass")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ass_content)

print(f"ASS subtitle file generated: {output_path}")
print(f"MarginL=30, MarginR=30, MarginV=30")
print(f"Alignment=2 (bottom center)")
print(f"WrapStyle=0 (multi-line with \\N)")
