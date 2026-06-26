#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import re
import os

def wrap_text(text, max_chars=25):
    """对单条字幕智能换行"""
    if len(text) <= max_chars:
        return text
    # 在逗号/顿号处找换行点
    for m in reversed(list(re.finditer(r'[，、]', text))):
        pos = m.start()
        if 5 < pos < max_chars + 10:
            return text[:pos+1] + r'\N' + text[pos+1:]
    # 无合适位置，强制截断
    return text[:max_chars] + r'\N' + text[max_chars:]

def process_narration(text):
    """处理配音文本：按句子分割，每句单独换行"""
    # 先按标点分割成完整句子
    sentences = []
    current = ""
    for char in text:
        current += char
        if char in '。！？':
            sentences.append(current)
            current = ""
    if current.strip():
        sentences.append(current)
    
    # 每句单独处理换行
    result = []
    for sent in sentences:
        sent = sent.strip()
        if not sent:
            continue
        result.append(wrap_text(sent, 25))
    return result

def generate_ass(subtitles, duration, output_path):
    ass = """[Script Info]
Title: Smart Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    n = len(subtitles)
    sub_dur = duration / n
    for i, text in enumerate(subtitles):
        start = i * sub_dur + 0.2
        end = (i + 1) * sub_dur - 0.1
        h, m, s, cs = int(start//3600), int((start%3600)//60), int(start%60), int((start%1)*100)
        start_fmt = f"{h}:{m:02d}:{s:02d}.{cs:02d}"
        h, m, s, cs = int(end//3600), int((end%3600)//60), int(end%60), int((end%1)*100)
        end_fmt = f"{h}:{m:02d}:{s:02d}.{cs:02d}"
        display = text.replace('/', '／')
        ass += f"Dialogue: 0,{start_fmt},{end_fmt},Default,,30,30,30,,{display}\n"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ass)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 gen_subtitles.py <duration> <output_path>")
        sys.exit(1)
    duration = float(sys.argv[1])
    output_path = sys.argv[2]
    narration = os.environ.get('NARRATION', '') or sys.stdin.read().strip()
    if not narration:
        print("Error: No narration")
        sys.exit(1)
    subtitles = process_narration(narration)
    print(f"Generated {len(subtitles)} subtitles:")
    for i, s in enumerate(subtitles):
        print(f"  {i+1}: {s[:70]}")
    generate_ass(subtitles, duration, output_path)
    print(f"Done: {output_path}")
