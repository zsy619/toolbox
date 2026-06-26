#!/usr/bin/env python3
"""
一键生成 吴恩达 AI Prompting for Everyone 原文章节阅读 HTML 网页
- 保持 21 集原始内容
- 阅读位置记忆（localStorage）
- 字体大小/底色可自定义（localStorage 记忆）
- 多端适配
- 合理命名：wunengda_reader.html
"""

import json
import re
import html as html_lib
from pathlib import Path

# 输入输出路径
INPUT_FILE = '/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/吴恩达AI_Prompting_for_Everyone_完整中文文字稿.txt'
OUTPUT_FILE = '/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/wunengda_reader.html'


def parse_episodes():
    """解析 txt 文件，提取 21 集内容"""
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    raw_blocks = re.split(r'={20,}', content)
    episodes = []

    for raw in raw_blocks:
        raw = raw.strip('\n').strip()
        if not raw:
            continue

        lines = raw.split('\n')
        title_line_idx = None
        ep_num = None

        for i, line in enumerate(lines):
            m = re.match(r'^\s*第\s*(\d+)\s*集\s*$', line)
            if m:
                title_line_idx = i
                ep_num = int(m.group(1))
                break

        if title_line_idx is None:
            continue

        # 提取内容
        content_lines = lines[title_line_idx + 1:]
        paragraphs = []
        current = []

        for line in content_lines:
            line = line.rstrip()
            if not line:
                if current:
                    paragraphs.append('\n'.join(current).strip())
                    current = []
            else:
                current.append(line)
        if current:
            paragraphs.append('\n'.join(current).strip())

        paragraphs = [p for p in paragraphs if p]

        episodes.append({
            "id": ep_num,
            "title": f"第 {ep_num:02d} 集",
            "paragraphs": paragraphs
        })

    return episodes


def build_html(episodes):
    """构建完整的阅读器 HTML"""

    # 将 episodes 序列化为 JSON 字符串
    episodes_json = json.dumps(episodes, ensure_ascii=False, separators=(',', ':'))

    # 集数字数统计
    total_chars = sum(sum(len(p) for p in ep["paragraphs"]) for ep in episodes)
    total_paras = sum(len(ep["paragraphs"]) for ep in episodes)

    html = '''<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark" data-font-size="medium" data-line-height="comfortable">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>吴恩达 AI Prompting for Everyone · 原文阅读器 | 21集完整版</title>
    <meta name="description" content="吴恩达《AI Prompting for Everyone》课程 21 集完整原文阅读器，支持阅读位置记忆、字体大小与底色自定义，所有设置自动保存。">
    <meta name="keywords" content="吴恩达, AI Prompting, 原文阅读, 课程文字稿, 提示工程, AI高级用户">
    <meta name="author" content="DeepLearning.AI 课程整理">
    <meta name="robots" content="index, follow">

    <link rel="canonical" href="https://tools.yy24365.com/apps/ai-tools/wunengda_reader.html">

    <meta property="og:type" content="article">
    <meta property="og:title" content="吴恩达 AI Prompting for Everyone · 原文阅读器">
    <meta property="og:description" content="21集完整原文 · 阅读位置记忆 · 个性化设置自动保存">
    <meta property="og:url" content="https://tools.yy24365.com/apps/ai-tools/wunengda_reader.html">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:site_name" content="AI 工具箱">

    <meta name="theme-color" content="#0F172A">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": "吴恩达 AI Prompting for Everyone 完整中文文字稿",
        "author": {
            "@type": "Person",
            "name": "Andrew Ng (吴恩达)"
        },
        "inLanguage": "zh-CN",
        "numberOfPages": 21,
        "bookFormat": "EBook"
    }
    </script>

    <style>
    /* ========== 主题变量 ========== */
    :root {
        /* 暗夜黑（默认） */
        --bg-color: #0F172A;
        --bg-card: #1E293B;
        --bg-elevated: #273449;
        --text-primary: #F1F5F9;
        --text-secondary: #94A3B8;
        --text-muted: #64748B;
        --border: #334155;
        --accent: #3B82F6;
        --accent-light: #60A5FA;
        --shadow: rgba(0, 0, 0, 0.3);
    }

    /* 护眼绿 */
    [data-theme="green"] {
        --bg-color: #1B2A1F;
        --bg-card: #243B2A;
        --bg-elevated: #2D4A35;
        --text-primary: #E8F0E5;
        --text-secondary: #A8BFA0;
        --text-muted: #7A8F75;
        --border: #3A5A42;
        --accent: #4ADE80;
        --accent-light: #86EFAC;
        --shadow: rgba(0, 0, 0, 0.2);
    }

    /* 米黄纸 */
    [data-theme="sepia"] {
        --bg-color: #F5E6D3;
        --bg-card: #EBDFC8;
        --bg-elevated: #E0D2B8;
        --text-primary: #3D2F1F;
        --text-secondary: #6B5A45;
        --text-muted: #8B7A65;
        --border: #C9B89A;
        --accent: #B8763D;
        --accent-light: #D49A5C;
        --shadow: rgba(120, 90, 50, 0.15);
    }

    /* 纯白 */
    [data-theme="light"] {
        --bg-color: #FFFFFF;
        --bg-card: #F8FAFC;
        --bg-elevated: #F1F5F9;
        --text-primary: #1E293B;
        --text-secondary: #64748B;
        --text-muted: #94A3B8;
        --border: #E2E8F0;
        --accent: #2563EB;
        --accent-light: #3B82F6;
        --shadow: rgba(0, 0, 0, 0.05);
    }

    /* 暗夜紫 */
    [data-theme="purple"] {
        --bg-color: #1A1625;
        --bg-card: #251F35;
        --bg-elevated: #2D2640;
        --text-primary: #E8E5F0;
        --text-secondary: #A09BC0;
        --text-muted: #7A7590;
        --border: #3A3252;
        --accent: #A78BFA;
        --accent-light: #C4B5FD;
        --shadow: rgba(0, 0, 0, 0.3);
    }

    /* ========== 字体大小 ========== */
    [data-font-size="small"]   { --reading-font-size: 15px; }
    [data-font-size="medium"]  { --reading-font-size: 17px; }
    [data-font-size="large"]   { --reading-font-size: 19px; }
    [data-font-size="xlarge"]  { --reading-font-size: 22px; }

    /* ========== 行高 ========== */
    [data-line-height="compact"]      { --reading-line-height: 1.6; }
    [data-line-height="comfortable"]  { --reading-line-height: 1.85; }
    [data-line-height="loose"]        { --reading-line-height: 2.1; }

    /* ========== 基础样式 ========== */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
        background: var(--bg-color);
        color: var(--text-primary);
        line-height: var(--reading-line-height);
        min-height: 100vh;
        transition: background 0.3s, color 0.3s;
    }

    /* ========== 跳转到内容（无障碍） ========== */
    .skip-link {
        position: absolute;
        top: -100px;
        left: 8px;
        background: var(--accent);
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        z-index: 9999;
        text-decoration: none;
        font-weight: 600;
        transition: top 0.3s;
    }
    .skip-link:focus { top: 8px; }

    /* ========== 顶部导航 ========== */
    .reader-header {
        position: sticky;
        top: 0;
        background: var(--bg-color);
        border-bottom: 1px solid var(--border);
        z-index: 100;
        padding: 12px 0;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        background: color-mix(in srgb, var(--bg-color) 90%, transparent);
    }

    .reader-header-inner {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    .reader-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--text-primary);
    }

    .reader-brand-icon { font-size: 24px; }

    .reader-brand-title {
        font-size: 16px;
        font-weight: 700;
    }

    .reader-brand-sub {
        font-size: 12px;
        color: var(--text-muted);
    }

    .reader-toolbar {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .toolbar-group {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 2px;
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 8px;
    }

    .toolbar-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s;
    }

    .toolbar-btn:hover {
        background: var(--bg-card);
        color: var(--text-primary);
    }

    .toolbar-btn[aria-pressed="true"] {
        background: var(--accent);
        color: white;
    }

    .toolbar-btn-text {
        width: auto;
        padding: 0 10px;
        font-size: 13px;
        font-weight: 600;
    }

    .toolbar-divider {
        width: 1px;
        height: 20px;
        background: var(--border);
        margin: 0 4px;
    }

    .toolbar-mobile-toggle {
        display: none;
    }

    /* ========== 主体布局 ========== */
    .reader-layout {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 0;
        min-height: calc(100vh - 60px);
    }

    /* ========== 侧边栏 ========== */
    .reader-sidebar {
        background: var(--bg-card);
        border-right: 1px solid var(--border);
        padding: 20px 0;
        height: calc(100vh - 60px);
        overflow-y: auto;
        position: sticky;
        top: 60px;
    }

    .reader-sidebar-header {
        padding: 0 20px 16px;
        border-bottom: 1px solid var(--border);
        margin-bottom: 12px;
    }

    .reader-sidebar-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 4px;
    }

    .reader-sidebar-meta {
        font-size: 12px;
        color: var(--text-muted);
    }

    .reader-progress-bar {
        margin-top: 12px;
        height: 4px;
        background: var(--bg-elevated);
        border-radius: 2px;
        overflow: hidden;
    }

    .reader-progress-fill {
        height: 100%;
        background: var(--accent);
        transition: width 0.3s;
        width: 0%;
    }

    .reader-episode-list {
        list-style: none;
    }

    .reader-episode-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        cursor: pointer;
        border-left: 3px solid transparent;
        transition: all 0.2s;
    }

    .reader-episode-item:hover {
        background: var(--bg-elevated);
    }

    .reader-episode-item.is-active {
        background: var(--bg-elevated);
        border-left-color: var(--accent);
    }

    .reader-episode-item.is-read .episode-list-num {
        background: var(--accent);
        color: white;
    }

    .episode-list-num {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--bg-elevated);
        color: var(--text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        flex-shrink: 0;
        border: 1px solid var(--border);
    }

    .reader-episode-item.is-active .episode-list-num {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
    }

    .episode-list-info {
        flex: 1;
        min-width: 0;
    }

    .episode-list-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 2px;
    }

    .reader-episode-item.is-active .episode-list-title {
        color: var(--accent-light);
    }

    .episode-list-meta {
        font-size: 11px;
        color: var(--text-muted);
    }

    /* ========== 主阅读区 ========== */
    .reader-main {
        padding: 40px 60px 80px;
        max-width: 820px;
        margin: 0 auto;
        width: 100%;
    }

    .reader-episode-header {
        margin-bottom: 32px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border);
    }

    .reader-episode-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        font-size: 12px;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .reader-episode-num {
        background: var(--accent);
        color: white;
        padding: 3px 10px;
        border-radius: 50px;
        font-weight: 700;
    }

    .reader-episode-title {
        font-size: 32px;
        font-weight: 800;
        color: var(--text-primary);
        line-height: 1.3;
    }

    .reader-episode-content {
        font-size: var(--reading-font-size);
        line-height: var(--reading-line-height);
        color: var(--text-primary);
    }

    .reader-paragraph {
        margin-bottom: 1.2em;
        text-align: justify;
        text-justify: inter-ideograph;
    }

    .reader-paragraph:first-letter {
        /* 可选：首字下沉效果 */
    }

    /* ========== 上下集导航 ========== */
    .reader-episode-nav {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 60px;
        padding-top: 32px;
        border-top: 1px solid var(--border);
    }

    .reader-nav-btn {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 16px 20px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 12px;
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.2s;
        cursor: pointer;
    }

    .reader-nav-btn:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--shadow);
    }

    .reader-nav-btn.is-disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
    }

    .reader-nav-btn.next {
        text-align: right;
        align-items: flex-end;
    }

    .reader-nav-label {
        font-size: 12px;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .reader-nav-title {
        font-size: 15px;
        font-weight: 700;
        color: var(--text-primary);
    }

    .reader-nav-arrow {
        font-size: 18px;
        color: var(--accent);
    }

    /* ========== 回到顶部 ========== */
    .reader-back-top {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--accent);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px var(--shadow);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;
        z-index: 50;
    }

    .reader-back-top.is-visible {
        opacity: 1;
        pointer-events: auto;
    }

    .reader-back-top:hover {
        transform: translateY(-2px);
    }

    /* ========== 设置面板（移动端） ========== */
    .reader-settings-panel {
        position: fixed;
        top: 0;
        right: -320px;
        width: 320px;
        max-width: 90vw;
        height: 100vh;
        background: var(--bg-card);
        border-left: 1px solid var(--border);
        z-index: 200;
        padding: 24px;
        transition: right 0.3s;
        overflow-y: auto;
    }

    .reader-settings-panel.is-open { right: 0; }

    .reader-settings-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 199;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }

    .reader-settings-overlay.is-open {
        opacity: 1;
        pointer-events: auto;
    }

    .settings-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 24px;
    }

    .settings-group {
        margin-bottom: 24px;
    }

    .settings-group-title {
        font-size: 12px;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .settings-options {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
    }

    .settings-option {
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 10px 4px;
        cursor: pointer;
        font-size: 12px;
        color: var(--text-secondary);
        text-align: center;
        transition: all 0.2s;
    }

    .settings-option:hover {
        border-color: var(--accent);
        color: var(--text-primary);
    }

    .settings-option.is-active {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
    }

    .settings-theme-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
    }

    .settings-theme {
        cursor: pointer;
        text-align: center;
    }

    .settings-theme-color {
        width: 100%;
        height: 36px;
        border-radius: 8px;
        border: 2px solid var(--border);
        margin-bottom: 4px;
        transition: all 0.2s;
    }

    .settings-theme.is-active .settings-theme-color {
        border-color: var(--accent);
        transform: scale(1.05);
    }

    .settings-theme-name {
        font-size: 11px;
        color: var(--text-secondary);
    }

    .settings-theme.is-active .settings-theme-name {
        color: var(--accent-light);
        font-weight: 600;
    }

    /* ========== 响应式 ========== */
    @media (max-width: 1024px) {
        .reader-layout {
            grid-template-columns: 1fr;
        }

        .reader-sidebar {
            position: fixed;
            top: 60px;
            left: -300px;
            width: 300px;
            max-width: 85vw;
            z-index: 150;
            height: calc(100vh - 60px);
            transition: left 0.3s;
        }

        .reader-sidebar.is-open { left: 0; }

        .reader-main {
            padding: 32px 32px 80px;
        }
    }

    @media (max-width: 768px) {
        .reader-header-inner { padding: 0 12px; }
        .reader-brand-sub { display: none; }
        .reader-main { padding: 24px 20px 60px; }
        .reader-episode-title { font-size: 24px; }
        .toolbar-mobile-toggle { display: flex; }
        .toolbar-group { display: none; }
        .toolbar-group.theme-group { display: flex; }
    }

    @media (max-width: 480px) {
        .reader-episode-nav {
            grid-template-columns: 1fr;
        }
        .reader-nav-btn.next {
            text-align: left;
            align-items: flex-start;
        }
        .reader-toolbar { gap: 4px; }
    }

    /* 焦点可见性 */
    a:focus-visible, button:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* 减少动画 */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* 滚动条 */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
    </style>
</head>
<body>
    <a href="#reader-main" class="skip-link">跳转到阅读内容</a>

    <!-- ========== 顶部工具栏 ========== -->
    <header class="reader-header" role="banner">
        <div class="reader-header-inner">
            <a href="#" class="reader-brand" aria-label="返回首页">
                <span class="reader-brand-icon" aria-hidden="true">📖</span>
                <div>
                    <div class="reader-brand-title">Prompting 原文阅读器</div>
                    <div class="reader-brand-sub">吴恩达 · 21集完整版</div>
                </div>
            </a>

            <nav class="reader-toolbar" role="toolbar" aria-label="阅读设置">
                <!-- 字体大小 -->
                <div class="toolbar-group" role="group" aria-label="字体大小">
                    <button class="toolbar-btn" data-action="font-decrease" aria-label="减小字体" title="减小字体">A-</button>
                    <button class="toolbar-btn" data-action="font-increase" aria-label="增大字体" title="增大字体">A+</button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- 行高 -->
                <div class="toolbar-group" role="group" aria-label="行高">
                    <button class="toolbar-btn" data-action="line-compact" aria-label="紧凑行高" title="紧凑">≡</button>
                    <button class="toolbar-btn" data-action="line-comfortable" aria-label="标准行高" title="标准">≣</button>
                    <button class="toolbar-btn" data-action="line-loose" aria-label="宽松行高" title="宽松">☰</button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- 主题（移动端始终显示） -->
                <div class="toolbar-group theme-group" role="group" aria-label="主题切换">
                    <button class="toolbar-btn" data-theme-btn="dark" aria-label="暗夜黑主题" title="暗夜黑">🌙</button>
                    <button class="toolbar-btn" data-theme-btn="green" aria-label="护眼绿主题" title="护眼绿">🌿</button>
                    <button class="toolbar-btn" data-theme-btn="sepia" aria-label="米黄纸主题" title="米黄纸">📜</button>
                    <button class="toolbar-btn" data-theme-btn="light" aria-label="纯白主题" title="纯白">☀️</button>
                    <button class="toolbar-btn" data-theme-btn="purple" aria-label="暗夜紫主题" title="暗夜紫">🍇</button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- 移动端侧边栏切换 -->
                <button class="toolbar-btn toolbar-mobile-toggle" data-action="toggle-sidebar" aria-label="打开章节列表">☰</button>
            </nav>
        </div>
    </header>

    <!-- ========== 主体布局 ========== -->
    <div class="reader-layout">
        <!-- 侧边栏：章节列表 -->
        <aside class="reader-sidebar" id="reader-sidebar" role="navigation" aria-label="章节列表">
            <div class="reader-sidebar-header">
                <div class="reader-sidebar-title">📚 全部 21 集</div>
                <div class="reader-sidebar-meta">共 <span id="total-chars">0</span> 字 · <span id="read-percent">0%</span> 已读</div>
                <div class="reader-progress-bar">
                    <div class="reader-progress-fill" id="progress-fill"></div>
                </div>
            </div>
            <ul class="reader-episode-list" id="episode-list" role="list">
                <!-- JS 动态生成 -->
            </ul>
        </aside>

        <!-- 移动端侧边栏遮罩 -->
        <div class="reader-settings-overlay" id="sidebar-overlay"></div>

        <!-- 主阅读区 -->
        <main class="reader-main" id="reader-main" role="main">
            <article class="reader-article" id="reader-article">
                <header class="reader-episode-header">
                    <div class="reader-episode-meta">
                        <span class="reader-episode-num" id="article-num">第 01 集</span>
                        <span id="article-progress">第 1 / 21 集</span>
                    </div>
                    <h1 class="reader-episode-title" id="article-title">加载中...</h1>
                </header>
                <div class="reader-episode-content" id="article-content">
                    <!-- JS 动态填充 -->
                </div>

                <nav class="reader-episode-nav" aria-label="上下集导航">
                    <a href="#" class="reader-nav-btn prev" id="nav-prev" data-action="prev-episode">
                        <span class="reader-nav-label">← 上一集</span>
                        <span class="reader-nav-title" id="nav-prev-title">第 20 集</span>
                    </a>
                    <a href="#" class="reader-nav-btn next" id="nav-next" data-action="next-episode">
                        <span class="reader-nav-label">下一集 →</span>
                        <span class="reader-nav-title" id="nav-next-title">第 02 集</span>
                    </a>
                </nav>
            </article>
        </main>
    </div>

    <!-- 回到顶部 -->
    <button class="reader-back-top" id="back-top" aria-label="回到顶部">↑</button>

    <!-- ========== 数据与脚本 ========== -->
    <script>
    // ====== 课程数据（21 集原文）======
    const EPISODES_DATA = ''' + episodes_json + ''';

    // ====== localStorage 键命名（统一前缀避免冲突）======
    const STORAGE_KEYS = {
        currentEpisode: 'wunegnda_reader:current_episode',
        scrollPosition: 'wunegnda_reader:scroll_position',
        fontSize: 'wunegnda_reader:font_size',
        lineHeight: 'wunegnda_reader:line_height',
        theme: 'wunegnda_reader:theme',
        readSet: 'wunegnda_reader:read_set'
    };

    // ====== 默认设置 ======
    const DEFAULTS = {
        fontSize: 'medium',
        lineHeight: 'comfortable',
        theme: 'dark',
        currentEpisode: 1,
        scrollPosition: 0
    };

    // ====== 工具函数 ======
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    function loadPref(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v !== null ? v : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function savePref(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (e) {
            console.warn('localStorage save failed:', e);
        }
    }

    function loadReadSet() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.readSet);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch (e) {
            return new Set();
        }
    }

    function saveReadSet(set) {
        try {
            localStorage.setItem(STORAGE_KEYS.readSet, JSON.stringify([...set]));
        } catch (e) {}
    }

    // ====== 状态 ======
    const state = {
        currentEpisode: parseInt(loadPref(STORAGE_KEYS.currentEpisode, DEFAULTS.currentEpisode), 10) || 1,
        fontSize: loadPref(STORAGE_KEYS.fontSize, DEFAULTS.fontSize),
        lineHeight: loadPref(STORAGE_KEYS.lineHeight, DEFAULTS.lineHeight),
        theme: loadPref(STORAGE_KEYS.theme, DEFAULTS.theme),
        readSet: loadReadSet()
    };

    // ====== 应用设置到 DOM ======
    function applySettings() {
        document.documentElement.setAttribute('data-theme', state.theme);
        document.documentElement.setAttribute('data-font-size', state.fontSize);
        document.documentElement.setAttribute('data-line-height', state.lineHeight);

        // 更新主题按钮 aria-pressed
        $$('[data-theme-btn]').forEach(btn => {
            const pressed = btn.getAttribute('data-theme-btn') === state.theme;
            btn.setAttribute('aria-pressed', String(pressed));
        });

        // 更新行高按钮
        const lineMap = {
            'line-compact': 'compact',
            'line-comfortable': 'comfortable',
            'line-loose': 'loose'
        };
        $$('[data-action^="line-"]').forEach(btn => {
            const pressed = lineMap[btn.getAttribute('data-action')] === state.lineHeight;
            btn.setAttribute('aria-pressed', String(pressed));
        });
    }

    // ====== 渲染侧边栏章节列表 ======
    function renderEpisodeList() {
        const list = $('#episode-list');
        list.innerHTML = EPISODES_DATA.map(ep => {
            const isActive = ep.id === state.currentEpisode;
            const isRead = state.readSet.has(ep.id);
            const charCount = ep.paragraphs.reduce((sum, p) => sum + p.length, 0);
            return `
                <li class="reader-episode-item ${isActive ? 'is-active' : ''} ${isRead ? 'is-read' : ''}"
                    data-episode-id="${ep.id}" tabindex="0"
                    role="button"
                    aria-label="跳转到第 ${ep.id} 集（${charCount} 字）">
                    <div class="episode-list-num">${isRead ? '✓' : ep.id}</div>
                    <div class="episode-list-info">
                        <div class="episode-list-title">第 ${String(ep.id).padStart(2, '0')} 集</div>
                        <div class="episode-list-meta">${charCount} 字 · ${ep.paragraphs.length} 段</div>
                    </div>
                </li>
            `;
        }).join('');

        // 总字数
        const totalChars = EPISODES_DATA.reduce((sum, ep) =>
            sum + ep.paragraphs.reduce((s, p) => s + p.length, 0), 0);
        $('#total-chars').textContent = totalChars.toLocaleString();
    }

    // ====== 渲染当前章节 ======
    function renderCurrentEpisode() {
        const ep = EPISODES_DATA.find(e => e.id === state.currentEpisode);
        if (!ep) return;

        // 标题
        $('#article-num').textContent = ep.title;
        $('#article-progress').textContent = `第 ${ep.id} / 21 集`;
        $('#article-title').textContent = '原文章节';

        // 内容：每段一个 <p>
        const contentHtml = ep.paragraphs
            .map(p => `<p class="reader-paragraph">${escapeHtml(p)}</p>`)
            .join('');
        $('#article-content').innerHTML = contentHtml;

        // 上下集导航
        const prevEp = EPISODES_DATA.find(e => e.id === state.currentEpisode - 1);
        const nextEp = EPISODES_DATA.find(e => e.id === state.currentEpisode + 1);

        const prevBtn = $('#nav-prev');
        const nextBtn = $('#nav-next');

        if (prevEp) {
            prevBtn.classList.remove('is-disabled');
            prevBtn.removeAttribute('aria-disabled');
            $('#nav-prev-title').textContent = `第 ${String(prevEp.id).padStart(2, '0')} 集`;
        } else {
            prevBtn.classList.add('is-disabled');
            prevBtn.setAttribute('aria-disabled', 'true');
            $('#nav-prev-title').textContent = '已是第一集';
        }

        if (nextEp) {
            nextBtn.classList.remove('is-disabled');
            nextBtn.removeAttribute('aria-disabled');
            $('#nav-next-title').textContent = `第 ${String(nextEp.id).padStart(2, '0')} 集`;
        } else {
            nextBtn.classList.add('is-disabled');
            nextBtn.setAttribute('aria-disabled', 'true');
            $('#nav-next-title').textContent = '已是最后一集';
        }

        // 更新 URL hash
        history.replaceState(null, '', `#episode-${ep.id}`);

        // 更新侧边栏 active 状态
        $$('.reader-episode-item').forEach(item => {
            const id = parseInt(item.getAttribute('data-episode-id'), 10);
            item.classList.toggle('is-active', id === state.currentEpisode);
        });

        // 标记已读
        state.readSet.add(state.currentEpisode);
        saveReadSet(state.readSet);
        updateProgress();
    }

    // ====== HTML 转义 ======
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ====== 进度更新 ======
    function updateProgress() {
        const percent = Math.round((state.readSet.size / EPISODES_DATA.length) * 100);
        $('#progress-fill').style.width = percent + '%';
        $('#read-percent').textContent = percent + '%';
    }

    // ====== 切换到指定集 ======
    function switchToEpisode(epId) {
        epId = parseInt(epId, 10);
        if (epId < 1 || epId > EPISODES_DATA.length) return;
        state.currentEpisode = epId;
        savePref(STORAGE_KEYS.currentEpisode, epId);
        renderCurrentEpisode();
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // 移动端关闭侧边栏
        if (window.innerWidth <= 1024) {
            toggleSidebar(false);
        }
    }

    // ====== 字体大小调节 ======
    const FONT_SIZES = ['small', 'medium', 'large', 'xlarge'];
    function setFontSize(size) {
        if (!FONT_SIZES.includes(size)) return;
        state.fontSize = size;
        savePref(STORAGE_KEYS.fontSize, size);
        document.documentElement.setAttribute('data-font-size', size);
    }

    function adjustFontSize(delta) {
        const idx = FONT_SIZES.indexOf(state.fontSize);
        const newIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, idx + delta));
        setFontSize(FONT_SIZES[newIdx]);
    }

    // ====== 行高调节 ======
    function setLineHeight(size) {
        state.lineHeight = size;
        savePref(STORAGE_KEYS.lineHeight, size);
        document.documentElement.setAttribute('data-line-height', size);
        applySettings();
    }

    // ====== 主题切换 ======
    function setTheme(theme) {
        state.theme = theme;
        savePref(STORAGE_KEYS.theme, theme);
        document.documentElement.setAttribute('data-theme', theme);
        applySettings();
    }

    // ====== 侧边栏开关 ======
    function toggleSidebar(force) {
        const sidebar = $('#reader-sidebar');
        const overlay = $('#sidebar-overlay');
        const isOpen = sidebar.classList.contains('is-open');
        const shouldOpen = force !== undefined ? force : !isOpen;

        if (shouldOpen) {
            sidebar.classList.add('is-open');
            overlay.classList.add('is-open');
        } else {
            sidebar.classList.remove('is-open');
            overlay.classList.remove('is-open');
        }
    }

    // ====== 回到顶部 ======
    function setupBackToTop() {
        const btn = $('#back-top');
        window.addEventListener('scroll', () => {
            btn.classList.toggle('is-visible', window.scrollY > 400);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ====== 阅读位置记忆 ======
    let scrollSaveTimer = null;
    function setupScrollMemory() {
        // 恢复滚动位置（在内容渲染后）
        const savedScroll = parseInt(loadPref(STORAGE_KEYS.scrollPosition, '0'), 10) || 0;
        if (savedScroll > 0) {
            // 延迟一帧，确保内容已渲染
            requestAnimationFrame(() => {
                window.scrollTo(0, savedScroll);
            });
        }

        // 保存滚动位置（节流：500ms）
        window.addEventListener('scroll', () => {
            if (scrollSaveTimer) clearTimeout(scrollSaveTimer);
            scrollSaveTimer = setTimeout(() => {
                savePref(STORAGE_KEYS.scrollPosition, window.scrollY);
            }, 500);
        }, { passive: true });
    }

    // ====== 事件绑定 ======
    function bindEvents() {
        // 工具栏按钮
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            e.preventDefault();
            const action = btn.getAttribute('data-action');

            switch (action) {
                case 'font-decrease': adjustFontSize(-1); break;
                case 'font-increase': adjustFontSize(+1); break;
                case 'line-compact': setLineHeight('compact'); break;
                case 'line-comfortable': setLineHeight('comfortable'); break;
                case 'line-loose': setLineHeight('loose'); break;
                case 'toggle-sidebar': toggleSidebar(); break;
                case 'prev-episode': switchToEpisode(state.currentEpisode - 1); break;
                case 'next-episode': switchToEpisode(state.currentEpisode + 1); break;
            }
        });

        // 主题按钮
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-theme-btn]');
            if (!btn) return;
            e.preventDefault();
            setTheme(btn.getAttribute('data-theme-btn'));
        });

        // 章节列表点击
        $('#episode-list').addEventListener('click', (e) => {
            const item = e.target.closest('[data-episode-id]');
            if (!item) return;
            switchToEpisode(item.getAttribute('data-episode-id'));
        });

        // 章节列表键盘
        $('#episode-list').addEventListener('keydown', (e) => {
            const item = e.target.closest('[data-episode-id]');
            if (!item) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchToEpisode(item.getAttribute('data-episode-id'));
            }
        });

        // 侧边栏遮罩
        $('#sidebar-overlay').addEventListener('click', () => toggleSidebar(false));

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 忽略输入框内的按键
            if (e.target.matches('input, textarea, select')) return;

            if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                switchToEpisode(state.currentEpisode - 1);
            } else if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                switchToEpisode(state.currentEpisode + 1);
            } else if (e.key === '+' || e.key === '=') {
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    adjustFontSize(+1);
                }
            } else if (e.key === '-') {
                if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    adjustFontSize(-1);
                }
            }
        });

        // 响应 hash 变化
        window.addEventListener('hashchange', () => {
            const m = location.hash.match(/^#episode-(\d+)$/);
            if (m) switchToEpisode(m[1]);
        });
    }

    // ====== 初始化 ======
    function init() {
        // 处理初始 hash
        const m = location.hash.match(/^#episode-(\d+)$/);
        if (m) {
            const epId = parseInt(m[1], 10);
            if (epId >= 1 && epId <= EPISODES_DATA.length) {
                state.currentEpisode = epId;
            }
        }

        applySettings();
        renderEpisodeList();
        renderCurrentEpisode();
        bindEvents();
        setupBackToTop();
        setupScrollMemory();
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    </script>
</body>
</html>'''
    return html


def main():
    print("📖 正在解析原文...")
    episodes = parse_episodes()
    print(f"✅ 成功解析 {len(episodes)} 集")

    for ep in episodes:
        char_count = sum(len(p) for p in ep["paragraphs"])
        print(f"  第 {ep['id']:02d} 集: {char_count} 字, {len(ep['paragraphs'])} 段")

    print("\n🔨 正在构建 HTML...")
    html_content = build_html(episodes)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html_content)

    size_kb = Path(OUTPUT_FILE).stat().st_size / 1024
    print(f"\n✅ 阅读器已生成：{OUTPUT_FILE}")
    print(f"   文件大小：{size_kb:.1f} KB")


if __name__ == '__main__':
    main()