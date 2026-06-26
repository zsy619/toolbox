#!/usr/bin/env python3
"""
Kronos 视频字幕生成脚本
基于实际音频时长 58.496秒
"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/kronos-video"
AUDIO_DIR = os.path.join(PROJECT_DIR, "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

# 实际音频参数
FPS = 60
DURATION = 58.496
TOTAL_FRAMES = int(DURATION * FPS)  # 3509帧

# 场景比例（按配音文本长度分配）
SCENES = [
    (0, 180, "金融市场的预测，一直是AI最难攻克的领域。"),       # 0-3s
    (180, 480, "通用AI改出来的模型，根本不理解K线的语言。数据噪声大，预测精度更是惨不忍睹。"),  # 3-8s
    (480, 900, "现在，Kronos来了。这是首个专门为金融市场打造的开源基础大模型，从底层架构开始，就是为K线和交易逻辑而生。"),  # 8-15s
    (900, 1320, "它靠45家交易所、120亿条数据训练而成，覆盖币安、纽交所、纳斯达克等全球主要交易所。"),  # 15-22s
    (1320, 1800, "从400万到4.99亿参数，共4个版本。最小那个，笔记本直接跑。零样本覆盖所有资产类别。"),  # 22-30s
    (1800, 2400, "实测效果更是夸张。准确率比主流时序模型高出93%，比顶尖非预训练模型高出87%。不用微调，拿来就用。"),  # 30-40s
    (2400, 2880, "对比一下：对冲基金定制模型要几百万，彭博终端年费2.4万美金。而Kronos完全免费，MIT协议开源，几行Python就能调用。"),  # 40-48s
    (2880, 3509, "清华团队研发，入选2026 AAAI顶会。GitHub斩获1.16万星、2400次复刻。已上架Hugging Face，100%开源。"),  # 48-58.5s
]

def frame_to_time(frame):
    total_seconds = frame / FPS
    h = int(total_seconds // 3600)
    m = int((total_seconds % 3600) // 60)
    s = int(total_seconds % 60)
    cs = int((total_seconds % 1) * 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def split_text(text, max_chars=20):
    lines = []
    current = ""
    for c in text:
        if c in "，、。；：！？""''（）":
            current += c
        elif c == "\n":
            if current:
                lines.append(current)
            current = ""
        elif len(current) >= max_chars:
            lines.append(current)
            current = ""
        else:
            current += c
    if current:
        lines.append(current)
    return lines or [text]

def generate_ass():
    ass = f"""[Script Info]
Title: Kronos 字幕
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    for start, end, text in SCENES:
        lines = split_text(text)
        content = "\\N".join(lines)
        ass += f"Dialogue: 0,{frame_to_time(start)},{frame_to_time(end)},Default,,30,30,30,,{content}\n"
    return ass

output = os.path.join(AUDIO_DIR, "subtitles.ass")
with open(output, 'w', encoding='utf-8') as f:
    f.write(generate_ass())
print(f"✅ 字幕已保存: {output}")
print(f"📊 总时长: {DURATION:.3f}秒, 总帧数: {TOTAL_FRAMES}")