#!/usr/bin/env python3
"""
ASS 字幕生成脚本
用法: python3 gen_subtitles.py [音频时长(秒)]
"""
import sys
import math

DURATION = float(sys.argv[1]) if len(sys.argv) > 1 else 57.0

SUBTITLE_TEXT = """花半小时写了一套 Skills，AI 第一次用还行，后面越用越乱。
输出的代码风格不统一，有时候还忽略关键步骤。
这不是 Skills 不行，而是 Skills 设计有问题。
今天聊聊 Skills 的 4 个设计原则，全是真实踩坑经验。
看完这篇，你的 Skills 应该能让 AI 稳定输出，少返工。
先说结论：大部分 Skills 问题，不是写得太少，而是写得太模糊。
我 review 过十几个读者的 Skills，常见问题就 3 个。
目标不清晰，"写高质量的代码"，AI 不知道什么叫高质量。
步骤不完整，"先分析需求，再写代码"，漏掉边界条件和错误处理。
约束不具体，"用 Python 写"，没说版本、风格、依赖限制。
Skills 的本质，是把你的思考过程显性化。
AI 不是看不懂，是你没说清楚。
好 Skills 有 4 个标准。第一，目标可验证，用"必须满足"代替"尽量"，用具体数字代替形容词。
第二，步骤可执行，每一步都有明确的产出物，AI 知道什么叫"做完"。
第三，约束可落地，约束要具体到能判断对错的程度。
第四，示例可参考，示例要说明"为什么好"和"为什么不好"。
再说 4 个血泪教训。
Skills 写太长，AI 记不住，拆分成多个，按场景调用。
Skills 不更新，越用越乱，加版本号，每次大更新时 review。
只写要做什么，没写不要做什么，在约束里明确写"禁止 XX"。
没有自检环节，AI 输出完就结束，质量问题靠我发现，在步骤最后加一步"自检：是否满足目标"。
总结：重复性工作多、团队协作，Skills 必写；探索性项目，慎用。
建议从小场景开始，边用边改，保存历史版本。
Skills 不是写完就完事，是要让 AI 真正能照着做。"""

def split_text(text, max_chars=25):
    """将文本分割成适合字幕的片段"""
    sentences = text.replace('。', '。\n').replace('，', '，\n').split('\n')
    lines = []
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if len(s) <= max_chars:
            lines.append(s)
        else:
            words = s.split('，')
            current = ''
            for w in words:
                if len(current) + len(w) + 1 <= max_chars:
                    current = (current + '，' + w).strip('，')
                else:
                    if current:
                        lines.append(current)
                    current = w
            if current:
                lines.append(current)
    return lines

def format_ass_time(seconds):
    """将秒数格式化为 ASS 时间码 (H:MM:SS.cc)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:05.2f}"

def generate_ass(text, duration, output_path):
    lines = split_text(text)
    n = len(lines)
    segment_duration = duration / n

    ass_lines = [
        '[Script Info]',
        'Title: Skills 字幕',
        'ScriptType: v4.00+',
        'WrapStyle: 0',
        'ScaledBorderAndShadow: yes',
        'YCbCr Matrix: None',
        '',
        '[V4+ Styles]',
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
        f'Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134',
        '',
        '[Events]',
        'Format: Layer, Start, End, Style, Text, Text, Text',
    ]

    for i, line in enumerate(lines):
        start = i * segment_duration
        end = start + segment_duration - 0.1
        start_str = format_ass_time(start)
        end_str = format_ass_time(end)
        text_escaped = line.replace('\\', '\\\\').replace('{', '\\{').replace('}', '\\}')
        ass_lines.append(f"Dialogue: 0,{start_str},{end_str},Default,{text_escaped},,0,0,0,,")

    ass_content = '\n'.join(ass_lines)
    with open(output_path, 'w', encoding='utf-8-sig') as f:
        f.write(ass_content)
    print(f"✅ 字幕生成完成: {output_path}")
    print(f"   时长: {duration:.1f}s, 片段数: {n}, 每段约 {segment_duration:.2f}s")
    return ass_content

if __name__ == '__main__':
    out_path = f'/Users/zhushuyan/.openclaw/workspace/toutiao-video/audio/subtitles_{int(DURATION)}s.ass'
    generate_ass(SUBTITLE_TEXT.strip(), DURATION, out_path)
