#!/usr/bin/env python3
"""
智能字幕生成器 - FaceFusion 视频专用
多行同屏显示：同一个时间窗口内，多条字幕用 \\N 连接，同时叠加展示
每行约12-15字符视觉宽度，WrapStyle=0 自动堆叠
"""

import re
import sys

def format_ass_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:05.2f}"

def chinese_len(s):
    return sum(1.0 if '\u4e00' <= c <= '\u9fff' else 0.5 for c in s)

def semantic_lines(text, max_chars=15):
    """语义断行：完整短句优先，超长句在逗号处拆分"""
    if not text or not text.strip():
        return []

    text = text.strip()
    raw_sentences = re.split(r'(?<=[。！？；])', text)
    sentences = [s.strip() for s in raw_sentences if s.strip()]
    if not sentences:
        sentences = [text]

    result_lines = []
    current = ""

    for sent in sentences:
        clen = chinese_len(current)
        slen = chinese_len(sent)

        if re.search(r'[。！？；]$', sent):
            if not current:
                result_lines.append(sent)
            elif clen + slen <= max_chars:
                current += sent
                result_lines.append(current)
                current = ""
            else:
                if current:
                    result_lines.append(current)
                result_lines.append(sent)
                current = ""
            continue

        # 无句末标点的长句，在逗号/顿号处拆分
        parts = re.split(r'([，、])', sent)
        merged = []
        buf = ""
        for j, part in enumerate(parts):
            if j % 2 == 0:
                buf += part
            else:
                if buf:
                    merged.append(buf + part)
                buf = ""
        if buf:
            merged.append(buf)

        for part in merged:
            part = part.strip()
            part = re.sub(r'^[，、]+', '', part)
            if not part:
                continue

            plen = chinese_len(part)
            if not current:
                current = part
            elif chinese_len(current) + plen <= max_chars:
                current += part
                result_lines.append(current)
                current = ""
            else:
                result_lines.append(current)
                current = part

    if current:
        result_lines.append(current)

    return [line.strip() for line in result_lines if line.strip()]


def generate_ass(duration, output_path):
    S4 = ('现实中已经在发生。"领导"视频连线让你转账，脸是AI换的。"亲属"视频求助借钱，'
          '声音加脸都是合成的。虚假身份认证过KYC，用换脸骗过人脸识别。'
          '杀猪盘里高颜值对象的视频聊天，全是实时换脸。')

    segments = [
        {"start": 0.0,  "end": 3.0,  "text": "AI换脸诈骗，已经在发生了。不是未来，是现在。"},
        {"start": 3.0,  "end": 12.0, "text": "这个工具叫FaceFusion，GitHub上2.7万星。AI换脸加口型同步加人脸增强，开源免费，门槛极低。"},
        {"start": 12.0, "end": 24.0, "text": "它有四个特性让人细思极恐。第一，换脸加口型同步，能让任何人的脸说出任何话，嘴型还能精确对上。第二，不只是静态图片，动态视频也能换。第三，有批量处理模式，规模化制作成本极低。第四，一键安装器，技术门槛已经低到普通人也能跑起来。"},
        {"start": 24.0, "end": 38.0, "text": S4},
        {"start": 38.0, "end": 48.0, "text": "这不是技术问题，是社会问题。工具开源且免费，门槛持续降低，但普通人的防范意识远远没跟上。"},
        {"start": 48.0, "end": 57.0, "text": "最后四个自保建议。视频通话不等于本人，要求对方做随机动作验证。涉及转账的紧急请求，挂掉电话用已知号码回拨确认。留意AI换脸容易穿替的细节，画面边缘、耳朵、头发。告诉你身边的人，眼见不一定为实。"},
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
        # 竖屏标准：PingFang SC 10px，黄色，底部居中，1px黑描边
        # MarginV=30 距底边30px（3行字幕约需45-60px）
        'Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134',
        '',
        '[Events]',
        'Format: Layer, Start, End, Style, Text',
    ]

    total_lines = 0

    for seg in segments:
        text = seg["text"]
        start_sec = seg["start"]
        end_sec = seg["end"]

        lines = semantic_lines(text, max_chars=15)
        if not lines:
            continue

        start_str = format_ass_time(start_sec)
        end_str = format_ass_time(end_sec)

        # 关键：同一时间窗口内所有行用 \N 连接为一个 Dialogue 条目
        # \N 是 ASS 硬换行符，WrapStyle=0 下多行自动垂直堆叠显示
        safe_lines = []
        for line in lines:
            safe_line = line.replace('\\', '\\\\').replace('{', '\\{').replace('}', '\\}')
            safe_lines.append(safe_line)

        # 用 \N 连接所有行（同一时间窗口叠加显示）
        combined_text = '\\N'.join(safe_lines)
        ass_lines.append(f"Dialogue: 0,{start_str},{end_str},Default,{combined_text}")
        total_lines += len(lines)

    ass_content = '\n'.join(ass_lines)
    with open(output_path, 'w', encoding='utf-8-sig') as f:
        f.write(ass_content)

    print(f"✅ 字幕生成完成: {output_path}")
    print(f"   分段: {len(segments)}段, 总行: {total_lines}")
    print(f"   策略: \\N同屏多行, WrapStyle=0垂直堆叠, MarginV=30")
    return ass_content


if __name__ == '__main__':
    if len(sys.argv) >= 3:
        duration = float(sys.argv[1])
        output_path = sys.argv[2]
    else:
        print("用法: python3 gen_subtitles.py <时长(秒)> <输出路径>")
        sys.exit(1)
    generate_ass(duration, output_path)
