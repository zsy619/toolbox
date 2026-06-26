#!/usr/bin/env python3
"""Article Tools 字幕生成脚本 - ASS 格式"""
import sys

OUTPUT = "/Volumes/OpenClawDrive/.hermes/workspace/article-tools/audio/subtitles_72s.ass"
DURATION = 72.0

subtitle_lines = [
    (0.0, 3.5, "写文章 5 分钟，排版却要 1 小时？"),
    (3.5, 6.5, "你不是效率低，是工具没选对。"),
    (6.5, 10.0, "今天给你介绍一套浏览器端排版神器，"),
    (10.0, 12.0, "零安装，打开即用。"),
    (12.0, 15.5, "第一个工具：封面生成器。"),
    (15.5, 20.0, "支持多种配色风格，多种装饰效果，"),
    (20.0, 23.5, "还能添加素材图片，一键导出 PNG。"),
    (23.5, 27.0, "第二个工具：Markdown 转微信公众号排版。"),
    (27.0, 31.0, "左边粘贴 Markdown，右边实时预览公众号样式，"),
    (31.0, 34.0, "一键复制，完全不用操心格式。"),
    (34.0, 38.0, "第三个工具：Markdown 转 X 排版。"),
    (38.0, 42.0, "自动处理换行、emoji、话题标签，"),
    (42.0, 44.5, "粘贴就能发。"),
    (44.5, 49.0, "三个工具，覆盖你内容发布的全部场景。"),
    (49.0, 53.0, "写作 5 分钟，排版 1 秒搞定。"),
    (53.0, 58.0, "零安装、不联网、不注册，"),
    (58.0, 62.0, "打开浏览器就能用。"),
    (62.0, 68.0, "工具链接我放在评论区，欢迎体验。"),
    (68.0, 72.0, "谢谢观看。"),
]

ass_content = f"""[Script Info]
Title: Article Tools Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,18,&H0000FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

for i, (start, end, text) in enumerate(subtitle_lines):
    start_str = f"{int(start//3600)}:{int((start%3600)//60):02d}:{start%60:05.2f}"
    end_str = f"{int(end//3600)}:{int((end%3600)//60):02d}:{end%60:05.2f}"
    text_escaped = text.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}")
    ass_content += f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{text_escaped}\n"

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(ass_content)

print(f"✅ 字幕已生成: {OUTPUT} ({len(subtitle_lines)} 条)")
