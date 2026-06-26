#!/usr/bin/env python3
"""
解析 txt 文件，将 21 集内容提取为结构化 JSON 数据
"""

import json
import re
import os

INPUT_FILE = '/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/吴恩达AI_Prompting_for_Everyone_完整中文文字稿.txt'
OUTPUT_FILE = '/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/_reader_data.json'


def parse_episodes():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 分割每一集
    # 集之间用 ====  分隔
    raw_blocks = re.split(r'={20,}', content)

    episodes = []

    for block in raw_blocks:
        block = block.strip()
        if not block:
            continue

        # 匹配 "第 XX 集"
        m = re.match(r'^第\s*(\d+)\s*集\s*$', block, re.MULTILINE)
        if not m:
            continue

        ep_num = int(m.group(1))

        # 移除标题行
        lines = block.split('\n')
        content_lines = []
        for line in lines[1:]:  # 跳过第一行 "第 XX 集"
            content_lines.append(line)

        # 合并段落：连续空行表示段落分隔
        paragraphs = []
        current_para = []

        for line in content_lines:
            line = line.rstrip()
            if not line:
                if current_para:
                    paragraphs.append('\n'.join(current_para).strip())
                    current_para = []
            else:
                current_para.append(line)

        if current_para:
            paragraphs.append('\n'.join(current_para).strip())

        # 第一段通常是简要的"开场"
        title_text = ''
        if paragraphs:
            title_text = paragraphs[0]

        episodes.append({
            "id": ep_num,
            "title": f"第 {ep_num:02d} 集",
            "paragraphs": paragraphs
        })

    return episodes


def main():
    episodes = parse_episodes()
    print(f"成功解析 {len(episodes)} 集")

    # 输出每一集的字数统计
    for ep in episodes:
        char_count = sum(len(p) for p in ep["paragraphs"])
        print(f"  第 {ep['id']:02d} 集: {char_count} 字, {len(ep['paragraphs'])} 段")

    # 保存为 JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(episodes, f, ensure_ascii=False, indent=2)

    print(f"\n数据已保存到 {OUTPUT_FILE}")


if __name__ == '__main__':
    main()