#!/usr/bin/env python3
"""字幕生成脚本 - ASS 格式"""
import sys
import re
import os

OUTPUT_PATH = "/Users/zhushuyan/VideoProjects/wx-favorites-viz/audio/subtitles.ass"
FONT_NAME = "PingFang SC"
FONT_SIZE = 10
PRIMARY_COLOR = "&H00FFFF"
OUTLINE = 1
ALIGNMENT = 2
MARGIN_L = 30
MARGIN_R = 30
MARGIN_V = 30

NARRATION = """微信收藏了 1000 多篇文章，却从来没再看过？今天分享一个 Claude Code Skill，叫"微信收藏可视化"。只需要对 Claude Code 说一句"微信收藏可视化"，它就能自动完成全流程。整个技术管线分三步：第一步，用 frida hook 系统函数，提取微信 Mac 版的加密密钥；第二步，用 AES-256-CBC 配合 PBKDF2 算法解密本地数据库；第三步，用 ECharts 把数据变成交互式 HTML 报告。报告包含统计仪表盘、月度趋势图、内容类型分布、来源排行榜、词云、标签云，还有可筛选可搜索的收藏浏览区。实现过程中踩了 8 个坑，迭代了 6 轮才跑通。特别要注意的是微信 4.x 的表结构变化，收藏密钥只在打开收藏页面时才加载。项目已经开源在 GitHub，有兴趣可以去围观。"""

def split_text_simple(text):
    """按完整句子分段，保留标点"""
    # 先按句子分割
    sentences = re.split(r'([。！？])', text)
    result = []
    current = ""
    
    for part in sentences:
        if part in '。！？':
            if current:
                result.append(current + part)
                current = ""
        elif part.strip():
            # 尝试把这段加入当前句子
            if len(current) + len(part) <= 45:
                current += part
            else:
                if current:
                    result.append(current)
                # 如果单个part超过45字，按50字强制分
                while len(part) > 45:
                    result.append(part[:45])
                    part = part[45:]
                current = part
    
    if current:
        result.append(current)
    
    return [s for s in result if s.strip()]

def generate_ass(subtitles, duration):
    """生成 ASS 文件"""
    ass = f"""[Script Info]
Title: wx-favorites-viz Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{FONT_NAME},{FONT_SIZE},{PRIMARY_COLOR},&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,{OUTLINE},0,{ALIGNMENT},{MARGIN_L},{MARGIN_R},{MARGIN_V},134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    
    if not subtitles:
        return ass
    
    # 等分时长
    n = len(subtitles)
    sub_duration = duration / n
    
    for i, text in enumerate(subtitles):
        start = i * sub_duration
        end = (i + 1) * sub_duration
        
        start_fmt = format_time(start + 0.2)
        end_fmt = format_time(min(end - 0.1, duration - 0.1))
        
        display_text = text.replace('/', '／')
        ass += f"Dialogue: 0,{start_fmt},{end_fmt},Default,,30,30,30,,{display_text}\n"
    
    return ass

def format_time(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    cs = int((seconds % 1) * 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

if __name__ == '__main__':
    duration = float(sys.argv[1]) if len(sys.argv) > 1 else 45.57
    subtitles = split_text_simple(NARRATION)
    print(f"生成了 {len(subtitles)} 条字幕")
    for i, s in enumerate(subtitles):
        print(f"  {i+1}: {s}")
    ass_content = generate_ass(subtitles, duration)
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(ass_content)
    print(f"✅ 字幕已生成: {OUTPUT_PATH}")
