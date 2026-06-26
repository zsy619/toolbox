#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解析吴恩达 AI Prompting for Everyone 完整中文文字稿
生成 JS 数据数组，供 HTML 阅读器使用
"""
import re
import json
import os

# 源文件路径
SRC = "/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/吴恩达AI_Prompting_for_Everyone_完整中文文字稿.txt"

# 输出文件路径
OUT = "/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/wunengda_data.js"

# 读取源文件
with open(SRC, 'r', encoding='utf-8') as f:
    text = f.read()

# 按分隔符切分
# 分隔符是连续的 === 符号
# 我们用正则切分
parts = re.split(r'={60,}', text)

# 过滤空字符串
parts = [p.strip() for p in parts if p.strip()]

# 每两段组成一集：标题 + 内容
episodes = []
i = 0
while i < len(parts):
    title = parts[i].strip()
    # 验证标题格式："第 XX 集"
    if re.match(r'^第\s*\d+\s*集$', title):
        if i + 1 < len(parts):
            content = parts[i + 1].strip()
            # 按空行分割段落
            paragraphs = [p.strip() for p in re.split(r'\n\s*\n', content) if p.strip()]
            episodes.append({
                'id': len(episodes) + 1,
                'title': title,
                'paragraphs': paragraphs
            })
            i += 2
        else:
            # 没有对应内容
            episodes.append({
                'id': len(episodes) + 1,
                'title': title,
                'paragraphs': []
            })
            i += 1
    else:
        # 不是标题，可能跳过了
        i += 1

print(f"共解析 {len(episodes)} 集")
total_chars = 0
for ep in episodes:
    chars = sum(len(p) for p in ep['paragraphs'])
    total_chars += chars
    print(f"  {ep['title']}: {len(ep['paragraphs'])} 段, {chars} 字")
print(f"总字数: {total_chars}")

# 写出为 JS 文件
with open(OUT, 'w', encoding='utf-8') as f:
    f.write("// 自动生成的吴恩达 AI Prompting for Everyone 课程数据\n")
    f.write(f"// 共 {len(episodes)} 集, {total_chars} 字\n")
    f.write("const EPISODES_DATA = ")
    # 用 json.dumps 输出，注意 ensure_ascii=False 保留中文
    f.write(json.dumps(episodes, ensure_ascii=False, indent=2))
    f.write(";\n")

print(f"\n数据已写入: {OUT}")
print(f"文件大小: {os.path.getsize(OUT)} bytes")
