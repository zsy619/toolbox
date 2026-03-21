
import os
import re

# File description mapping based on README.md
file_descriptions = {
    "202602top.html": "2026年2月热度最高的AI工具趋势报告，涵盖软件自动化、视觉创作等领域的最新变革。",
    "ai_calendar.html": "AI万年历日历生成器，支持自定义样式和节日标注。",
    "ai_course.html": "24节气幼儿园烹饪课程AI生成器，结合传统节气与现代饮食教育。",
    "ai_coursex.html": "AI课程生成器（实验版X），探索更多教育场景。",
    "ai_coursey.html": "AI课程生成器（实验版Y），优化的课程结构。",
    "ai_dream.html": "Web3梦境解析与周公解梦AI，用科技解读潜意识。",
    "deep-research-tools.html": "深度调研工具分级指南，帮助你找到最适合的研究辅助工具。",
    "ai_scene.html": "AI应用场景分析表，系统化梳理AI落地的具体场景与价值。",
    "ai_scene_chart.html": "AI应用场景深度分析图表，可视化呈现AI技术的影响力。",
    "ai_scene_search.html": "AI场景搜索功能，快速定位你需要的AI解决方案。",
    "ai_syxr.html": "Web3 AI评估 | 四有信人框架，建立可信的人工智能评价体系。",
    "bzg.html": "冬季鼻干综合调理指南，科学有效的缓解方案。",
    "seedance2.0.html": "Seedance 2.0 搞钱路子与红利分析，抓住AI视频时代的机遇。",
    "weixiguan.html": "微习惯知识卡片：让坚持变简单，基于《微习惯》的科学养成法。",
    "index.html": "AI工具箱目录索引，汇集实用AI工具与分析报告。"
}

# Common image path
og_image_path = "https://tools.yy24365.com/assets/images/dev-tools-og.png"

def update_html_file(filename, description):
    file_path = os.path.join(".", filename)
    if not os.path.exists(file_path):
        print(f"Skipping {filename}: File not found")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update/Add Meta Tags (Existing Logic)
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    if title_match:
        title = title_match.group(1).strip()
    else:
        title = description.split('，')[0]

    meta_tags = f"""
    <!-- 微信/OpenGraph 卡片信息 -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:url" content="./{filename}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="{og_image_path}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{og_image_path}">

    <meta itemprop="name" content="{title}">
    <meta itemprop="description" content="{description}">
    <meta itemprop="image" content="{og_image_path}">
    """

    # Remove old meta blocks to allow update
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if any(x in line for x in ['property="og:', 'name="twitter:', 'itemprop="', '微信/OpenGraph']):
            continue
        new_lines.append(line)
    content = '\n'.join(new_lines)

    if '</head>' in content:
        content = content.replace('</head>', f'{meta_tags}\n</head>')

    # 2. WeChat Specific Optimization: Hidden Image at start of Body
    # Regex to find the opening body tag
    body_pattern = re.compile(r'(<body[^>]*>)', re.IGNORECASE)
    
    # Check if we already injected the hidden image
    # Note: We use a specific ID or class to identify our injection? Or just check content.
    # Let's check for the exact image path in a hidden div
    wechat_hack_html = f'\n    <!-- Wechat Share Image Hack -->\n    <div style="display:none; visibility:hidden;"><img src="{og_image_path}" alt="wechat-share-icon" width="400" height="400"></div>'
    
    # Remove previous hack if exists (simple check)
    if '<!-- Wechat Share Image Hack -->' in content:
        # A bit risky to regex replace blindly, but for this task it's okay to just append if missing, 
        # or we rely on the user not running it 100 times. 
        # Let's try to remove it first using a simple string replace if it matches exactly what we wrote before?
        # Actually, let's just use regex to remove any similar structure if we want to be clean.
        # For safety, I'll just check if it exists. If it exists, I assume it's correct.
        pass 
    elif body_pattern.search(content):
        # Insert after <body>
        content = body_pattern.sub(r'\1' + wechat_hack_html, content, count=1)
        print(f"Added WeChat hidden image to {filename}")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = "/Volumes/E/JYW/工具箱/apps/ai-tools"
    os.chdir(root_dir)
    
    for filename, description in file_descriptions.items():
        update_html_file(filename, description)

if __name__ == "__main__":
    main()
