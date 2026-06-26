#!/usr/bin/env python3
"""Generate ASS subtitle file for html-ppt-skill video"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/html-ppt-skill-video"
AUDIO_DURATION = 57.74

# Subtitle lines with start times (seconds)
# Format: (start_time, end_time, text)
# Estimated based on ~170 words in ~57.74 seconds = ~2.94 words/sec

lines = [
    (0.50, 3.50, "PPT这件事，大多数人还在用错误的方式做。"),
    (3.50, 8.50, "用PowerPoint、Keynote点来点去，改一个主题全部返工，换个字体整个样式崩掉，做完还长得像2010年企业汇报。"),
    (8.50, 11.50, "有人做了一个AI Agent技能，直接解决这个问题。"),
    (11.50, 17.50, "html-ppt-skill，是一套专门给AI Agent调用的HTML幻灯片生成系统，纯静态，无需依赖任何传统PPT软件。"),
    (17.50, 23.00, "它提供了24套精美主题，覆盖商务、科技、创意、学术等场景。"),
    (23.00, 28.00, "31种专业布局，从封面到结尾全覆盖。"),
    (28.00, 33.50, "20多种动画效果，打字机、渐入、滑动应有尽有。"),
    (33.50, 38.50, "纯HTML实现，浏览器直接打开，跨平台零障碍。"),
    (38.50, 47.50, "对比传统PPT，html-ppt-skill做到了主题更换一键完成，字体样式自动适配，动画声明式配置。"),
    (47.50, 53.00, "更重要的是，它原生支持AI Agent集成，让你的AI助手真正帮你做PPT。"),
    (53.00, 57.00, "完整项目链接见描述。"),
]

def format_time(seconds):
    """Convert seconds to ASS time format (H:MM:SS.cc)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:05.2f}"

ass_content = f"""[Script Info]
Title: html-ppt-skill subtitles
ScriptType: v4.00+
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,10,10,30,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

for i, (start, end, text) in enumerate(lines):
    start_str = format_time(start)
    end_str = format_time(end)
    ass_content += f"Dialogue: 0,{start_str},{end_str},Default,,0,0,30,,{text}\n"

output_path = os.path.join(PROJECT_DIR, "audio", "subtitles_58s.ass")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ass_content)

print(f"ASS subtitle file generated: {output_path}")
print(f"Total lines: {len(lines)}")
print(f"Total duration: {AUDIO_DURATION:.2f}s")
