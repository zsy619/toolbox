#!/usr/bin/env python3
"""
Skills 字幕生成脚本 - 参考 quantdinger 格式
- 字号10px（ASS标准）
- 每行约10个字符
- 使用 \\N 换行
"""
import os

PROJECT_DIR = "/Users/zhushuyan/.openclaw/workspace/skills-video"
AUDIO_DIR = os.path.join(PROJECT_DIR, "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

FPS = 60
DURATION = 125.159
TOTAL_FRAMES = int(DURATION * FPS)

SCENES = [
    (0, 300, "Gumroad创始人给出了另一条路：\\N先找社区，再看需求，最后写代码。"),
    (300, 600, "他把《极简创业》的精髓，\\N开源成了9个可交互的AI Agent Skills。\\N这是一套一人公司赚钱必备的生存指南。"),
    (600, 900, "这9个Skill连起来，\\N刚好拼成了一个反直觉的商业闭环。"),
    (900, 1500, "第一个Skill叫找社区。\\N把起点从'我想做个什么东西'\\N变成'我懂哪个群体、能持续提供什么价值'。\\N避开想象中的市场，去真实的抱怨里找机会。"),
    (1500, 2100, "第二个Skill是验证需求。\\N这个阶段只看交易信号，不看口头夸奖。\\N个人精力最怕消耗在伪需求和错误的假设上。"),
    (2100, 2700, "第三个Skill是最小可行性产品。\\N先手工交付，梳理流程，最后产品化。\\N早期跑得通的MVP\\N往往也就是几个表单或列表。"),
    (2700, 3300, "第四个Skill是搞定首批客户。\\N前100个客户基本都是挨个聊出来的。\\N与其幻想发布即爆红，\\N不如借着逐个沟通的机会，\\N做最深度的客户和需求理解。"),
    (3300, 3900, "第五个Skill是定价。\\N尽早收费。\\N定价不仅是填个数字，\\N更是测算商业闭环的探针。\\N如果跑不通，尽早收费就能尽早暴露问题。"),
    (3900, 4500, "第六个Skill是营销计划。\\N有了100个真客户，再谈营销。\\N把营销看作规模化的销售，\\N而不是烧钱投流。"),
    (4500, 5100, "第七个Skill是可续持增长。\\N活下去是底线。\\N要护好现金流。\\N能用软件和代码解决就不加人，\\N避开租场地等不可逆开销。"),
    (5100, 5700, "第八个Skill是公司价值观。\\N一人公司也要有红线。\\N在准备迈向多人协作前先理清楚：\\N什么行为有奖，什么事情业绩再好也不能忍。"),
    (5700, 6300, "第九个Skill是核心复盘。\\N想加功能、投广告、招人或融资前，\\N用底层原则重新审视一遍，\\N防止动作变形。"),
    (6300, 6900, "这就是Gumroad创始人开源的\\N9个AI Agent Skills。\\N它们不是假装替你干活的玩具，\\N而是随时拉你回现实的务实教练。"),
    (6900, 7510, "先找社区，再看需求，最后写代码。\\N极简创业，一人公司赚钱必备的生存指南。"),
]

def frame_to_time(frame):
    total = frame / FPS
    h = int(total // 3600)
    m = int((total % 3600) // 60)
    s = int(total % 60)
    cs = int((total % 1) * 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def generate_ass():
    ass = """[Script Info]
Title: Skills 极简创业 字幕
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,10,&H00FFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,30,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    for start, end, text in SCENES:
        ass += f"Dialogue: 0,{frame_to_time(start)},{frame_to_time(end)},Default,,30,30,30,,{text}\n"
    return ass

output = os.path.join(AUDIO_DIR, "subtitles.ass")
with open(output, 'w', encoding='utf-8') as f:
    f.write(generate_ass())
print(f"✅ 字幕已保存: {output}")
print(f"📊 总时长: {DURATION:.3f}秒, 总帧数: {TOTAL_FRAMES}")
print(f"📊 参考 quantdinger 格式：字号10px，每行约10字")