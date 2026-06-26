#!/usr/bin/env python3
r"""Generate ASS subtitles - 铁律标准文件

⚠️⚠️⚠️ 字幕铁律（video-creator 技能强制要求，违反会导致字幕溢出/无法显示）⚠️⚠️⚠️

| 参数 | 铁律值 | 说明 |
|------|--------|------|
| Fontsize | 60-72px | 竖屏必须≥72px（当前60px防止溢出） |
| Font | PingFang SC | macOS可用中文字体 |
| Color | &H00FFFF | 青色/黄色 |
| Alignment | 2 | 底部居中 |
| MarginL/MarginR | 30px | 左右边距30px |
| MarginV | 30px | 底部边距30px |
| Outline | 1px | 轮廓1px |
| PlayResX/PlayResY | 1080x1920 | 竖屏分辨率 |
| WrapStyle | 0 | 多行支持 |
| 换行符 | \N | ASS格式必须用\N，不是\n |
| 每行字数 | ≤25字符 | 60px字体下25字符约900px，1080px内安全 |
"""

import re
import os
import subprocess

def parse_srt(srt_path):
    with open(srt_path, 'r', encoding='utf-8') as f:
        content = f.read()
    entries = []
    blocks = re.split(r'\n\n+', content.strip())
    for block in blocks:
        lines = block.split('\n')
        if len(lines) >= 3:
            try:
                time_line = lines[1]
                text = '\n'.join(lines[2:])
                times = time_line.split(' --> ')
                start = parse_time(times[0])
                end = parse_time(times[1])
                entries.append({'start': start, 'end': end, 'text': text})
            except:
                pass
    return entries

def parse_time(time_str):
    time_str = time_str.strip().replace(',', '.')
    parts = time_str.split(':')
    h = int(parts[0])
    m = int(parts[1])
    s = float(parts[2])
    return h * 3600 + m * 60 + s

def format_time_ass(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h}:{m:02d}:{s:05.2f}"

def smart_wrap(text, max_chars_per_line=25):
    r"""Smart text wrapping - use \N for line breaks in ASS format"""
    lines = text.split('\n')
    wrapped_lines = []
    for line in lines:
        if len(line) <= max_chars_per_line:
            wrapped_lines.append(line)
        else:
            chunks = []
            current = ""
            for char in line:
                if len(current) >= max_chars_per_line:
                    chunks.append(current)
                    current = ""
                current += char
            if current:
                chunks.append(current)
            wrapped_lines.extend(chunks)
    return '\\N'.join(wrapped_lines)

def generate_ass(srt_path, output_path, duration):
    entries = parse_srt(srt_path)
    ass_content = f"""[Script Info]
Title: Warp Terminal
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,60,&H00FFFF,&H0000FFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    for entry in entries:
        start = format_time_ass(entry['start'])
        end = format_time_ass(entry['end'])
        text = smart_wrap(entry['text'].replace('<[^>]+>', ''), 25)
        text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        ass_content += f"Dialogue: 0,{start},{end},Default,,30,30,30,,{text}\n"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ass_content)
    print(f"Generated: {output_path}")
    print(f"Duration: {duration}s, Entries: {len(entries)}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(os.path.dirname(script_dir))
    audio_dir = os.path.join(project_dir, 'audio')
    srt_path = os.path.join(audio_dir, 'subtitles.srt')
    ass_path = os.path.join(audio_dir, 'subtitles.ass')
    audio_path = os.path.join(audio_dir, 'neural_1_2x.m4a')
    result = subprocess.run(['ffprobe', '-i', audio_path, '-show_entries', 'format=duration', '-v', 'quiet', '-of', 'csv=p=0'], capture_output=True, text=True)
    duration_str = result.stdout.strip()
    duration = float(duration_str) if duration_str else 21.17
    generate_ass(srt_path, ass_path, duration)
    print("✅ ASS subtitles generated")
