#!/usr/bin/env python3
"""
ASS字幕生成脚本 - PenPot 开源设计平台
"""
import math

# 音频时长（秒）
DURATION = 73.752

# 场景帧分布（60fps）
# 封面: 0-180 (3s), 开源平台: 180-900 (12s), 自托管: 900-1620 (12s)
# 实时协作: 1620-2340 (12s), 设计令牌: 2340-3240 (15s), MCP服务器: 3240-3960 (12s)
# 代码检查: 3960-4680 (12s), CTA: 4680-5100 (7s, 实际到4425帧 = 73.75s)

SCENES = [
    (0, 3, "PenPot 开源设计平台"),
    (3, 10, "完全自主可控的设计基础设施"),
    (10, 16, "支持浏览器或自有服务器运行"),
    (16, 22, "实时协作让团队更高效"),
    (22, 28, "Design Tokens 统一设计开发语言"),
    (28, 34, "Best-in-class 原生设计令牌"),
    (34, 40, "MCP服务器 AI工作流集成"),
    (40, 46, "多方向设计代码协同"),
    (46, 52, "Inspect模式 一键查看代码"),
    (52, 58, "SVG CSS HTML 即时访问"),
    (58, 64, "Components Variants 构建设计系统"),
    (64, 70, "插件系统 自动化工作流"),
    (70, 73.75, "开源免费 立即体验 penpot.app"),
]

def ms_to_timestamp(ms):
    """Convert milliseconds to ASS timestamp format: H:MM:SS.cc"""
    h = ms // 3600000
    m = (ms % 3600000) // 60000
    s = (ms % 60000) // 1000
    cs = (ms % 1000) // 10
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def generate_ass(duration, scenes, output_path):
    fps = 60
    total_frames = math.ceil(duration * fps)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        # Script Info
        f.write("[Script Info]\n")
        f.write("Title: PenPot 开源设计平台\n")
        f.write("ScriptType: v4.00+\n")
        f.write("WrapStyle: 0\n")
        f.write("PlayResX: 1080\n")
        f.write("PlayResY: 1920\n")
        f.write("ScaledBorderAndShadow: Yes\n")
        f.write("\n")
        
        # Styles
        f.write("[V4+ Styles]\n")
        f.write("Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n")
        f.write("Style: Default,PingFang SC,72,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,50,1\n")
        f.write("\n")
        
        # Events
        f.write("[Events]\n")
        f.write("Format: Layer, Start, End, Style, Text\n")
        
        for start, end, text in scenes:
            start_ms = int(start * 1000)
            end_ms = int(min(end, duration) * 1000)
            start_ts = ms_to_timestamp(start_ms)
            end_ts = ms_to_timestamp(end_ms)
            # Escape commas and backslashes in text
            text_escaped = text.replace('\\', '\\\\').replace(',', '，')
            f.write(f"Dialogue: 0,{start_ts},{end_ts},Default,,0,0,0,,{text_escaped}\n")
    
    print(f"Generated: {output_path}")

if __name__ == '__main__':
    generate_ass(DURATION, SCENES, "audio/subtitles.ass")
    print(f"Duration: {DURATION}s, Total frames: {math.ceil(DURATION * 60)}")