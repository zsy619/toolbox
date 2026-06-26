#!/usr/bin/env python3
"""
智能字幕生成器 - FaceFusion 视频专用
生成标准 ASS 格式字幕，支持多行显示，避免屏幕溢出
"""

import re
import sys
from datetime import datetime

def format_ass_time(seconds):
    """将秒数转换为 ASS 时间格式 H:MM:SS.cc"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:05.2f}"

def wrap_chinese_text(text, max_chars=18):
    """将中文文本智能分词，确保每行不超过max_chars个字符"""
    # 移除首尾空白
    text = text.strip()
    if not text:
        return []

    # 按句子分割
    sentences = []
    current = ""
    i = 0
    while i < len(text):
        c = text[i]
        current += c
        # 遇到句末标点时分割
        if c in '。！？；' and len(sentences) + len(current) < 4:
            sentences.append(current)
            current = ""
        i += 1
    if current.strip():
        sentences.append(current)

    # 合并短句成行
    lines = []
    current_line = ""

    for sent in sentences:
        sent = sent.strip()
        if not sent:
            continue
        # 如果单句超过max_chars，尝试在逗号/顿号处分段
        if len(sent) > max_chars:
            if current_line:
                lines.append(current_line)
                current_line = ""
            # 按逗号/顿号分割
            parts = re.split(r'([，、])', sent)
            merged = ""
            for j, part in enumerate(parts):
                if j % 2 == 0:  # 文本片段
                    if len(merged) + len(part) <= max_chars:
                        merged += part
                    else:
                        if merged:
                            lines.append(merged)
                        merged = part
                else:  # 分隔符
                    merged += part
            if merged.strip():
                lines.append(merged)
        else:
            if len(current_line) + len(sent) <= max_chars:
                current_line += sent
            else:
                if current_line:
                    lines.append(current_line)
                current_line = sent

    if current_line.strip():
        lines.append(current_line)

    return lines

def generate_ass(text, duration, output_path):
    # 将完整文案按场景分段，每段分配等时
    segments = [
        (0, 3, "AI换脸诈骗，已经在发生了。不是未来，是现在。"),
        (3, 12, "这个工具叫FaceFusion，GitHub上2.7万星，AI换脸加口型同步加人脸增强，开源免费，门槛极低。"),
        (12, 24, "它有四个特性让人细思极恐。第一，换脸加口型同步，能让任何人的脸说出任何话，嘴型还能精确对上。第二，不只是静态图片，动态视频也能换。第三，有批量处理模式，规模化制作成本极低。第四，一键安装器，技术门槛已经低到普通人也能跑起来。"),
        (24, 38, '"领导"视频连线让你转账，脸是AI换的。"亲属"视频求助借钱，声音加脸都是合成的。虚假身份认证过KYC，用换脸骗过人脸识别。杀猪盘里高颜值对象的视频聊天，全是实时换脸。'),
        (38, 48, "这不是技术问题，是社会问题。工具开源且免费，门槛持续降低，但普通人的防范意识远远没跟上。"),
        (48, 57, "最后四个自保建议。视频通话不等于本人，要求对方做随机动作验证。涉及转账的紧急请求，挂掉电话用已知号码回拨确认。留意AI换脸容易穿帮的细节，画面边缘、耳朵、头发。告诉你身边的人，眼见不一定为实。"),
    ]

    ass_lines = [
        '[Script Info]',
        'Title: FaceFusion AI换脸风险警示 字幕',
        'ScriptType: v4.00+',
        'WrapStyle: 0',
        'ScaledBorderAndShadow: yes',
        'YCbCr Matrix: None',
        '',
        '[V4+ Styles]',
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
        'Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134',
        '',
        '[Events]',
        'Format: Layer, Start, End, Style, Text',
    ]

    for start_sec, end_sec, seg_text in segments:
        seg_duration = end_sec - start_sec
        # 把这段文字按 max_chars=16 分行
        lines = wrap_chinese_text(seg_text, max_chars=16)
        n = len(lines)
        if n == 0:
            continue
        line_duration = seg_duration / n

        for i, line in enumerate(lines):
            line_start = start_sec + i * line_duration
            line_end = line_start + line_duration - 0.05
            start_str = format_ass_time(line_start)
            end_str = format_ass_time(line_end)
            # ASS 换行用 \N
            text_escaped = line.replace('\\', '\\\\').replace('{', '\\{').replace('}', '\\}')
            ass_lines.append(f"Dialogue: 0,{start_str},{end_str},Default,{text_escaped}")

    ass_content = '\n'.join(ass_lines)
    with open(output_path, 'w', encoding='utf-8-sig') as f:
        f.write(ass_content)

    total_lines = len(ass_lines) - 12  # subtract header lines
    print(f"✅ 字幕生成完成: {output_path}")
    print(f"   时长: {duration:.1f}s, 分段数: {len(segments)}, 总字幕行: {total_lines}")
    return ass_content

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        duration = float(sys.argv[1])
        output_path = sys.argv[2]
    else:
        print("用法: python3 gen_subtitles.py <时长(秒)> <输出路径>")
        sys.exit(1)

    generate_ass(None, duration, output_path)
