#!/usr/bin/env python3
"""智能字幕生成器 - agency-agents 视频专用"""
import re, sys

def format_ass_time(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h}:{m:02d}:{s:05.2f}"

def chinese_len(s):
    return sum(1.0 if '\u4e00' <= c <= '\u9fff' else 0.5 for c in s)

def semantic_lines(text, max_chars=15):
    if not text or not text.strip():
        return []
    text = text.strip()
    raw = re.split(r'(?<=[。！？；])', text)
    sentences = [s.strip() for s in raw if s.strip()]
    if not sentences:
        sentences = [text]
    result_lines, current = [], ""
    for sent in sentences:
        clen = chinese_len(current)
        slen = chinese_len(sent)
        if re.search(r'[。！？；]$', sent) and slen <= max_chars:
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
        parts = re.split(r'([，、])', sent)
        merged, buf = [], ""
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
            part = re.sub(r'^[，、]+', '', part).strip()
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
    return [l.strip() for l in result_lines if l.strip()]

def generate_ass(duration, output_path):
    S = [
        {"start": 0.0,  "end": 3.0,  "text": "用 Claude Code 还在自己写系统提示词？你已经落后一个版本了。"},
        {"start": 3.0,  "end": 6.0,  "text": "有人把一整个 AI 代理公司全部开源了。agency-agents，80加个 AI 专家代理。"},
        {"start": 6.0,  "end": 12.0, "text": "工程部门，前端开发、后端架构、AI工程师、安全工程师、智能合约工程师、SRE、数据库优化，开发链条上你能想到的岗位全有。"},
        {"start": 12.0, "end": 16.0, "text": "设计部门，UI设计师、UX研究员、图片提示词工程师，甚至还有专门往产品里注入趣味感的 Whimsy Injector。"},
        {"start": 16.0, "end": 20.0, "text": "营销部门，Reddit社区运营、TikTok策略师、小红书专家、微信公众号运营。"},
        {"start": 20.0, "end": 24.0, "text": "销售部门，外呼策略师、竞品分析师、提案专家、销售管道分析。"},
        {"start": 24.0, "end": 32.0, "text": "这些代理不是简单角色描述。每个都定义了：具体的沟通风格，完整的作业流程，实际交付物示例。"},
        {"start": 32.0, "end": 38.0, "text": "支持几乎所有主流 AI 编程工具。Claude Code、Cursor、Copilot、Aider、Windsurf、Gemini CLI、OpenCode，一行脚本直接装进去。"},
        {"start": 38.0, "end": 48.0, "text": "你现在怎么用 AI 工具，决定了你和别人的效率差距有多大。大多数人还在帮我写个函数的阶段，顶层玩家已经在调度专家团队了。这个差距不会等你。"},
        {"start": 48.0, "end": 57.0, "text": "GitHub: msitarzewski/agency-agents。80加个 AI 专家代理，按真实公司部门组织。"},
    ]

    ass = [
        '[Script Info]',
        'Title: agency-agents AI代理公司 字幕',
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

    total = 0
    for seg in S:
        text, ss, es = seg["text"], seg["start"], seg["end"]
        seg_dur = es - ss
        lines = semantic_lines(text, max_chars=15)
        if not lines:
            continue
        n = len(lines)
        line_dur = seg_dur / n
        ss_str, es_str = format_ass_time(ss), format_ass_time(es)
        safe = '\\N'.join(l.replace('\\', '\\\\').replace('{', '\\{').replace('}', '\\}') for l in lines)
        ass.append(f"Dialogue: 0,{ss_str},{es_str},Default,{safe}")
        total += len(lines)

    with open(output_path, 'w', encoding='utf-8-sig') as f:
        f.write('\n'.join(ass))

    print(f"✅ 字幕生成: {output_path} ({len(S)}段/{total}行)")
    return ass

if __name__ == '__main__':
    dur = float(sys.argv[1]) if len(sys.argv) > 1 else 57.0
    out = sys.argv[2] if len(sys.argv) > 2 else "subtitles.ass"
    generate_ass(dur, out)
