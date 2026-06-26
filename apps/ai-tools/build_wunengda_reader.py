#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
构建吴恩达 AI Prompting for Everyone 章节阅读器 HTML（美化加强版）

特性：
1. 保持原有 21 章节与内容
2. 中文章节排版：首字下沉、章首/章末装饰、印章标签、装饰分隔
3. 三套字体：宋体（正文）+ 楷体（标题）+ 黑体（界面）
4. 阅读位置记忆（localStorage）
5. 字体大小、行高、底色可自定义（localStorage 记忆）
6. 6 套底色主题 + 阅读时间估算
"""
import os

# 源数据文件
DATA_FILE = "/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/wunengda_data.js"

# 输出 HTML 文件
OUT_FILE = "/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/wunengda_prompting_chapters.html"

# ============== HTML 模板 ==============
HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="zh-CN" data-bg-color="paper" data-font-size="medium" data-line-height="comfortable">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="format-detection" content="telephone=no">
    <meta name="theme-color" content="#F5EDE0">

    <title>吴恩达 · AI Prompting for Everyone · 原文章节阅读器（21集完整版）</title>
    <meta name="description" content="吴恩达《AI Prompting for Everyone》课程 21 集完整原文阅读器，支持阅读位置记忆、字体大小与底色自定义。">
    <meta name="keywords" content="吴恩达, AI Prompting, 提示工程, 原文阅读, 课程文字稿">
    <meta name="author" content="AI 工具箱">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="article">
    <meta property="og:title" content="吴恩达 · AI Prompting for Everyone · 原文阅读器">
    <meta property="og:description" content="21集完整原文 · 阅读位置记忆 · 字体与底色个性化">
    <meta property="og:locale" content="zh_CN">

    <style>
    /* ============== 字体栈 ============== */
    /* 优先思源宋体（开源、跨平台），降级系统宋体 */
    :root {
        --font-serif: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN',
                      'Songti SC', 'STSong', 'SimSun', '宋体', serif;
        --font-kai:   'Noto Serif SC', 'Kaiti SC', 'STKaiti', 'KaiTi', '楷体', serif;
        --font-sans:  'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      'Microsoft YaHei', 'Hiragino Sans GB', 'Source Han Sans SC', sans-serif;
    }

    /* ============== 主题变量 ============== */
    :root {
        --bg-color: #F5EDE0;
        --bg-card: #FBF7EE;
        --bg-elevated: #EDE4D2;
        --text-primary: #2A2419;
        --text-secondary: #5A4F3D;
        --text-muted: #8A7F68;
        --border: #D9CDB2;
        --border-light: #E8DCC2;
        --accent: #A0522D;
        --accent-light: #B8704E;
        --accent-soft: #D4A77A;
        --shadow: rgba(80, 50, 20, 0.08);
        --shadow-strong: rgba(80, 50, 20, 0.15);
        --highlight: rgba(160, 82, 45, 0.08);
    }

    /* 纯白 */
    [data-bg-color="white"] {
        --bg-color: #FFFFFF;
        --bg-card: #FCFCFC;
        --bg-elevated: #F4F4F4;
        --text-primary: #1A1A1A;
        --text-secondary: #4A4A4A;
        --text-muted: #888888;
        --border: #E0E0E0;
        --border-light: #EEEEEE;
        --accent: #2563EB;
        --accent-light: #3B82F6;
        --accent-soft: #93C5FD;
        --shadow: rgba(0, 0, 0, 0.05);
        --shadow-strong: rgba(0, 0, 0, 0.1);
        --highlight: rgba(37, 99, 235, 0.08);
    }

    /* 护眼绿 */
    [data-bg-color="green"] {
        --bg-color: #E5EDD8;
        --bg-card: #EEF3E2;
        --bg-elevated: #D8E3C0;
        --text-primary: #2A3520;
        --text-secondary: #4A5A3A;
        --text-muted: #6A7A5A;
        --border: #BFCDA8;
        --border-light: #D2DEBC;
        --accent: #5A8A3A;
        --accent-light: #7AAA5A;
        --accent-soft: #A8C688;
        --shadow: rgba(40, 60, 20, 0.08);
        --shadow-strong: rgba(40, 60, 20, 0.15);
        --highlight: rgba(90, 138, 58, 0.1);
    }

    /* 暗夜黑 */
    [data-bg-color="dark"] {
        --bg-color: #14181F;
        --bg-card: #1E232C;
        --bg-elevated: #2A2F38;
        --text-primary: #E5E2DA;
        --text-secondary: #A8A398;
        --text-muted: #6A6458;
        --border: #34394A;
        --border-light: #2A2F3A;
        --accent: #E8A55C;
        --accent-light: #F5C587;
        --accent-soft: #8A6A3E;
        --shadow: rgba(0, 0, 0, 0.4);
        --shadow-strong: rgba(0, 0, 0, 0.6);
        --highlight: rgba(232, 165, 92, 0.12);
    }

    /* 暖米色（默认） */
    [data-bg-color="paper"] {
        --bg-color: #F5EDE0;
        --bg-card: #FBF7EE;
        --bg-elevated: #EDE4D2;
        --text-primary: #2A2419;
        --text-secondary: #5A4F3D;
        --text-muted: #8A7F68;
        --border: #D9CDB2;
        --border-light: #E8DCC2;
        --accent: #A0522D;
        --accent-light: #B8704E;
        --accent-soft: #D4A77A;
        --shadow: rgba(80, 50, 20, 0.08);
        --shadow-strong: rgba(80, 50, 20, 0.15);
        --highlight: rgba(160, 82, 45, 0.08);
    }

    /* 羊皮卷 */
    [data-bg-color="sepia"] {
        --bg-color: #F0E5C8;
        --bg-card: #F8EFD8;
        --bg-elevated: #E5D6B0;
        --text-primary: #3D2F1F;
        --text-secondary: #5C4A35;
        --text-muted: #8A7A60;
        --border: #C9B68A;
        --border-light: #DCC8A0;
        --accent: #8B4513;
        --accent-light: #A0522D;
        --accent-soft: #B8704E;
        --shadow: rgba(120, 90, 50, 0.15);
        --shadow-strong: rgba(120, 90, 50, 0.25);
        --highlight: rgba(139, 69, 19, 0.1);
    }

    /* 灰蓝 */
    [data-bg-color="gray"] {
        --bg-color: #ECEEF2;
        --bg-card: #F4F6FA;
        --bg-elevated: #DCE0E8;
        --text-primary: #1F2937;
        --text-secondary: #4A5568;
        --text-muted: #6A7488;
        --border: #C8CFD8;
        --border-light: #DDE2EA;
        --accent: #4A5568;
        --accent-light: #6A7488;
        --accent-soft: #94A0B0;
        --shadow: rgba(0, 0, 0, 0.06);
        --shadow-strong: rgba(0, 0, 0, 0.12);
        --highlight: rgba(74, 85, 104, 0.08);
    }

    /* 雪青 */
    [data-bg-color="lavender"] {
        --bg-color: #EFEAF4;
        --bg-card: #F6F2FA;
        --bg-elevated: #DDD2E8;
        --text-primary: #2D2438;
        --text-secondary: #504060;
        --text-muted: #786890;
        --border: #C8BCD4;
        --border-light: #DDD0E5;
        --accent: #6B4A8A;
        --accent-light: #8A6AAA;
        --accent-soft: #B098D0;
        --shadow: rgba(60, 40, 80, 0.08);
        --shadow-strong: rgba(60, 40, 80, 0.15);
        --highlight: rgba(107, 74, 138, 0.1);
    }

    /* ============== 字体大小 ============== */
    [data-font-size="small"]   { --reading-font-size: 15px; --reading-line-height: 1.75; }
    [data-font-size="medium"]  { --reading-font-size: 17px; --reading-line-height: 1.85; }
    [data-font-size="large"]   { --reading-font-size: 19px; --reading-line-height: 1.95; }
    [data-font-size="xlarge"]  { --reading-font-size: 22px; --reading-line-height: 2.05; }
    [data-font-size="xxlarge"] { --reading-font-size: 26px; --reading-line-height: 2.15; }

    /* ============== 行高覆盖 ============== */
    [data-line-height="compact"][data-font-size="small"]   { --reading-line-height: 1.6; }
    [data-line-height="compact"][data-font-size="medium"]  { --reading-line-height: 1.7; }
    [data-line-height="compact"][data-font-size="large"]   { --reading-line-height: 1.8; }
    [data-line-height="compact"][data-font-size="xlarge"]  { --reading-line-height: 1.9; }
    [data-line-height="compact"][data-font-size="xxlarge"] { --reading-line-height: 2.0; }
    [data-line-height="loose"][data-font-size="small"]   { --reading-line-height: 2.0; }
    [data-line-height="loose"][data-font-size="medium"]  { --reading-line-height: 2.1; }
    [data-line-height="loose"][data-font-size="large"]   { --reading-line-height: 2.2; }
    [data-line-height="loose"][data-font-size="xlarge"]  { --reading-line-height: 2.3; }
    [data-line-height="loose"][data-font-size="xxlarge"] { --reading-line-height: 2.4; }

    /* ============== 基础重置 ============== */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html {
        scroll-behavior: smooth;
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: transparent;
    }

    body {
        font-family: var(--font-serif);
        background: var(--bg-color);
        color: var(--text-primary);
        line-height: var(--reading-line-height);
        min-height: 100vh;
        transition: background 0.3s ease, color 0.3s ease;
        font-size: var(--reading-font-size);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }

    button { font-family: var(--font-sans); }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ============== 无障碍跳链 ============== */
    .skip-link {
        position: absolute;
        top: -100px;
        left: 12px;
        background: var(--accent);
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        z-index: 9999;
        text-decoration: none;
        font-weight: 600;
        transition: top 0.2s;
    }
    .skip-link:focus { top: 12px; outline: none; }

    /* ============== 顶部导航 ============== */
    .reader-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--bg-color);
        border-bottom: 1px solid var(--border);
        backdrop-filter: blur(16px) saturate(180%);
        -webkit-backdrop-filter: blur(16px) saturate(180%);
        background: color-mix(in srgb, var(--bg-color) 88%, transparent);
    }
    .reader-header-inner {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        height: 60px;
    }
    .reader-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: var(--text-primary);
        min-width: 0;
    }
    .reader-brand-icon {
        font-size: 24px;
        flex-shrink: 0;
        filter: grayscale(0.2);
    }
    .reader-brand-text { min-width: 0; }
    .reader-brand-title {
        font-size: 15px;
        font-weight: 700;
        font-family: var(--font-kai);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 1px;
    }
    .reader-brand-sub {
        font-size: 11px;
        color: var(--text-muted);
        font-family: var(--font-sans);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .reader-toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .toolbar-group {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 3px;
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 10px;
    }
    .toolbar-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        width: 32px;
        height: 32px;
        border-radius: 7px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s;
        font-weight: 600;
        font-family: var(--font-sans);
    }
    .toolbar-btn:hover {
        background: var(--bg-card);
        color: var(--text-primary);
    }
    .toolbar-btn[aria-pressed="true"] {
        background: var(--accent);
        color: white;
        box-shadow: 0 2px 6px var(--shadow);
    }
    .toolbar-divider {
        width: 1px;
        height: 20px;
        background: var(--border);
    }
    .toolbar-mobile-toggle { display: none; }

    /* ============== 主体布局 ============== */
    .reader-layout {
        display: flex;
        max-width: 1400px;
        margin: 0 auto;
        min-height: calc(100vh - 60px);
    }

    /* ============== 侧边栏 ============== */
    .reader-sidebar {
        width: 290px;
        flex-shrink: 0;
        background: var(--bg-card);
        border-right: 1px solid var(--border);
        height: calc(100vh - 60px);
        overflow-y: auto;
        position: sticky;
        top: 60px;
    }
    .reader-sidebar-header {
        padding: 20px 22px 16px;
        border-bottom: 1px solid var(--border-light);
        position: sticky;
        top: 0;
        background: var(--bg-card);
        z-index: 2;
    }
    .reader-sidebar-title {
        font-size: 15px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-kai);
        letter-spacing: 1px;
    }
    .reader-sidebar-meta {
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 12px;
        font-family: var(--font-sans);
    }
    .reader-progress-bar {
        height: 4px;
        background: var(--bg-elevated);
        border-radius: 2px;
        overflow: hidden;
    }
    .reader-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent), var(--accent-light));
        transition: width 0.3s;
        width: 0%;
    }
    .reader-episode-list { list-style: none; padding: 10px 0 30px; }
    .reader-episode-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 22px;
        cursor: pointer;
        border-left: 3px solid transparent;
        transition: all 0.2s;
        position: relative;
    }
    .reader-episode-item:hover { background: var(--bg-elevated); }
    .reader-episode-item.is-active {
        background: var(--bg-elevated);
        border-left-color: var(--accent);
    }
    .reader-episode-item.is-active::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background: var(--accent);
        border-radius: 2px 0 0 2px;
    }
    .reader-episode-item.is-read .episode-list-num {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
    }
    .episode-list-num {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: var(--bg-elevated);
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        flex-shrink: 0;
        border: 1px solid var(--border);
        font-family: var(--font-kai);
    }
    .reader-episode-item.is-active .episode-list-num {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
        box-shadow: 0 2px 8px var(--shadow);
    }
    .episode-list-info { flex: 1; min-width: 0; }
    .episode-list-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 2px;
        font-family: var(--font-kai);
        letter-spacing: 0.5px;
    }
    .reader-episode-item.is-active .episode-list-title { color: var(--accent); }
    .episode-list-subtitle {
        font-size: 11px;
        color: var(--text-secondary);
        font-family: var(--font-sans);
        font-weight: 400;
        margin-bottom: 3px;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        opacity: 0.85;
    }
    .reader-episode-item.is-active .episode-list-subtitle { color: var(--accent-light); opacity: 1; }
    .episode-list-meta {
        font-size: 11px;
        color: var(--text-muted);
        font-family: var(--font-sans);
    }

    /* ============== 主阅读区 ============== */
    .reader-main {
        flex: 1;
        min-width: 0;
        padding: 50px 60px 100px;
        max-width: 920px;
        margin: 0 auto;
        width: 100%;
    }
    .reader-article { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* ============== 章首装饰 ============== */
    .reader-episode-header {
        margin-bottom: 40px;
        text-align: center;
        position: relative;
    }
    .episode-eyebrow {
        display: inline-block;
        font-family: var(--font-kai);
        font-size: 13px;
        color: var(--accent);
        letter-spacing: 6px;
        padding: 4px 16px;
        margin-bottom: 14px;
        border-top: 1px solid var(--accent-soft);
        border-bottom: 1px solid var(--accent-soft);
        text-indent: 6px; /* 弥补 letter-spacing 视觉偏移 */
    }
    .reader-episode-num {
        display: inline-block;
        font-family: var(--font-kai);
        font-size: 14px;
        font-weight: 700;
        color: white;
        background: var(--accent);
        padding: 5px 18px;
        border-radius: 4px;
        margin-bottom: 18px;
        letter-spacing: 4px;
        text-indent: 4px;
        box-shadow: 0 2px 8px var(--shadow);
        position: relative;
    }
    .reader-episode-num::before,
    .reader-episode-num::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 8px;
        height: 8px;
        background: var(--bg-color);
        border: 1px solid var(--accent);
        transform: translateY(-50%) rotate(45deg);
    }
    .reader-episode-num::before { left: -4px; }
    .reader-episode-num::after { right: -4px; }
    .reader-episode-title {
        font-size: 30px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.4;
        letter-spacing: 1px;
        font-family: var(--font-kai);
        margin: 14px 0 22px;
        padding: 0 12px;
    }
    .reader-episode-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 12px;
        color: var(--text-muted);
        font-family: var(--font-sans);
    }
    .meta-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        background: var(--bg-elevated);
        border: 1px solid var(--border-light);
        border-radius: 20px;
    }
    .meta-divider {
        color: var(--accent-soft);
        user-select: none;
    }

    /* 章首装饰横线 */
    .episode-divider {
        margin: 28px auto 0;
        text-align: center;
        color: var(--accent-soft);
        font-size: 14px;
        letter-spacing: 12px;
        position: relative;
    }
    .episode-divider::before,
    .episode-divider::after {
        content: '';
        display: inline-block;
        width: 60px;
        height: 1px;
        background: var(--accent-soft);
        vertical-align: middle;
        margin: 0 16px;
    }

    /* ============== 正文排版 ============== */
    .reader-episode-content {
        font-size: var(--reading-font-size);
        line-height: var(--reading-line-height);
        color: var(--text-primary);
        font-family: var(--font-serif);
        letter-spacing: 0.3px;
    }
    .reader-paragraph {
        margin-bottom: 1.4em;
        text-align: justify;
        text-justify: inter-ideograph;
        word-break: break-word;
        text-indent: 2em; /* 中文段落首行缩进 */
        position: relative;
    }
    /* 首段：取消首行缩进，配首字下沉 */
    .reader-paragraph.is-first {
        text-indent: 0;
    }
    /* 首字下沉 */
    .reader-paragraph.is-first::first-letter {
        font-family: var(--font-kai);
        font-size: 3.6em;
        font-weight: 700;
        color: var(--accent);
        float: left;
        line-height: 0.95;
        margin: 0.08em 0.12em 0 -0.05em;
        padding: 0;
    }
    /* 包含中文双引号的样式增强 */
    .reader-paragraph .quote-cn {
        color: var(--accent);
        font-weight: 500;
    }

    /* ============== 章末装饰 ============== */
    .episode-end {
        text-align: center;
        margin: 50px 0 40px;
        font-family: var(--font-kai);
        color: var(--text-muted);
        font-size: 14px;
        letter-spacing: 8px;
        text-indent: 8px;
        position: relative;
    }
    .episode-end::before,
    .episode-end::after {
        content: '';
        display: inline-block;
        width: 40px;
        height: 1px;
        background: var(--border);
        vertical-align: middle;
        margin: 0 18px;
    }

    /* ============== 章节导航 ============== */
    .reader-episode-nav {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 50px;
        padding-top: 36px;
        border-top: 1px dashed var(--border);
    }
    .reader-nav-btn {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 18px 22px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 14px;
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.25s;
        cursor: pointer;
        position: relative;
        font-family: var(--font-kai);
    }
    .reader-nav-btn:hover {
        border-color: var(--accent);
        transform: translateY(-3px);
        box-shadow: 0 6px 20px var(--shadow);
        text-decoration: none;
        background: var(--bg-elevated);
    }
    .reader-nav-btn.is-disabled {
        opacity: 0.35;
        cursor: not-allowed;
        pointer-events: none;
    }
    .reader-nav-btn.next { text-align: right; align-items: flex-end; }
    .reader-nav-label {
        font-size: 11px;
        color: var(--text-muted);
        font-family: var(--font-sans);
        letter-spacing: 2px;
        text-transform: uppercase;
    }
    .reader-nav-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: 1px;
    }
    .reader-nav-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 22px;
        color: var(--accent);
        font-family: var(--font-sans);
        transition: transform 0.25s;
    }
    .reader-nav-btn.prev .reader-nav-arrow { left: 18px; }
    .reader-nav-btn.next .reader-nav-arrow { right: 18px; }
    .reader-nav-btn.prev { padding-left: 50px; }
    .reader-nav-btn.next { padding-right: 50px; }
    .reader-nav-btn:hover .reader-nav-arrow.prev { transform: translate(-3px, -50%); }
    .reader-nav-btn:hover .reader-nav-arrow.next { transform: translate(3px, -50%); }

    /* ============== 回到顶部 ============== */
    .reader-back-top {
        position: fixed;
        right: 28px;
        bottom: 28px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px var(--shadow-strong);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;
        z-index: 50;
        font-family: var(--font-sans);
    }
    .reader-back-top.is-visible { opacity: 1; pointer-events: auto; }
    .reader-back-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px var(--shadow-strong);
    }

    /* ============== 移动端侧边栏遮罩 ============== */
    .reader-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 149;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }
    .reader-overlay.is-open { opacity: 1; pointer-events: auto; }

    /* ============== 底部提示 ============== */
    .reader-footer-tip {
        text-align: center;
        color: var(--text-muted);
        font-size: 12px;
        margin-top: 50px;
        padding: 20px 16px;
        font-family: var(--font-sans);
        line-height: 1.8;
    }
    .reader-footer-tip kbd {
        display: inline-block;
        padding: 1px 6px;
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 4px;
        font-family: var(--font-sans);
        font-size: 11px;
        margin: 0 2px;
    }

    /* ============== 顶部阅读进度条 ============== */
    .reading-progress {
        position: fixed;
        top: 60px;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--accent), var(--accent-light));
        z-index: 99;
        transition: width 0.1s;
        width: 0;
        box-shadow: 0 1px 3px var(--shadow);
    }

    /* ============== 响应式 ============== */
    @media (max-width: 1024px) {
        .reader-sidebar {
            position: fixed;
            top: 60px;
            left: -310px;
            width: 310px;
            max-width: 85vw;
            z-index: 150;
            transition: left 0.3s;
            height: calc(100vh - 60px);
            box-shadow: 4px 0 20px var(--shadow);
        }
        .reader-sidebar.is-open { left: 0; }
        .reader-main { padding: 36px 36px 80px; }
    }
    @media (max-width: 768px) {
        .reader-header-inner { padding: 0 16px; gap: 8px; height: 56px; }
        .reader-brand-icon { font-size: 20px; }
        .reader-brand-title { font-size: 14px; }
        .reader-brand-sub { display: none; }
        .reader-main { padding: 28px 20px 60px; }
        .reader-episode-title { font-size: 22px; }
        .reader-episode-header { margin-bottom: 30px; }
        .reader-episode-num { font-size: 12px; padding: 4px 14px; }
        .reader-paragraph.is-first::first-letter {
            font-size: 3em;
            margin: 0.1em 0.1em 0 -0.02em;
        }
        .toolbar-mobile-toggle { display: flex; }
        .toolbar-group.line-group,
        .toolbar-group.color-group { display: none; }
        .toolbar-group.font-group { display: flex; }
        .reading-progress { top: 56px; }
    }
    @media (max-width: 480px) {
        .reader-episode-nav { grid-template-columns: 1fr; }
        .reader-nav-btn.next { text-align: left; align-items: flex-start; padding-right: 22px; }
        .reader-nav-btn.next .reader-nav-arrow { display: none; }
        .reader-nav-btn.prev { padding-left: 22px; }
        .reader-nav-btn.prev .reader-nav-arrow { display: none; }
        .reader-back-top { right: 16px; bottom: 16px; width: 44px; height: 44px; }
        .reader-paragraph { text-indent: 2em; }
        .reader-paragraph.is-first::first-letter { font-size: 2.6em; }
    }

    /* ============== 焦点可见性 ============== */
    a:focus-visible, button:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* ============== 减少动画 ============== */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* ============== 滚动条 ============== */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
    </style>
</head>
<body>
    <a href="#reader-main" class="skip-link">跳转到阅读内容</a>
    <div class="reading-progress" id="reading-progress"></div>

    <!-- ========== 顶部工具栏 ========== -->
    <header class="reader-header" role="banner">
        <div class="reader-header-inner">
            <a href="#episode-1" class="reader-brand" aria-label="返回首页第 1 集">
                <span class="reader-brand-icon" aria-hidden="true">📖</span>
                <div class="reader-brand-text">
                    <div class="reader-brand-title">提示工程 · 原文阅读</div>
                    <div class="reader-brand-sub">吴恩达 · 21 集完整版</div>
                </div>
            </a>

            <nav class="reader-toolbar" role="toolbar" aria-label="阅读设置">
                <!-- 字号 -->
                <div class="toolbar-group font-group" role="group" aria-label="字体大小">
                    <button class="toolbar-btn" data-action="font-decrease" aria-label="减小字体" title="减小字体 (Ctrl/Cmd -)">A−</button>
                    <button class="toolbar-btn" data-action="font-increase" aria-label="增大字体" title="增大字体 (Ctrl/Cmd +)">A+</button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- 行高 -->
                <div class="toolbar-group line-group" role="group" aria-label="行高">
                    <button class="toolbar-btn" data-action="line-compact" aria-label="紧凑行高" title="紧凑行高">≡</button>
                    <button class="toolbar-btn" data-action="line-comfortable" aria-label="标准行高" title="标准行高">≣</button>
                    <button class="toolbar-btn" data-action="line-loose" aria-label="宽松行高" title="宽松行高">☰</button>
                </div>

                <div class="toolbar-divider"></div>

                <!-- 底色 -->
                <div class="toolbar-group color-group" role="group" aria-label="底色切换">
                    <button class="toolbar-btn" data-bg-btn="paper" aria-label="暖米色" title="暖米色">🌾</button>
                    <button class="toolbar-btn" data-bg-btn="white" aria-label="纯白" title="纯白">⬜</button>
                    <button class="toolbar-btn" data-bg-btn="green" aria-label="护眼绿" title="护眼绿">🌿</button>
                    <button class="toolbar-btn" data-bg-btn="sepia" aria-label="羊皮卷" title="羊皮卷">📜</button>
                    <button class="toolbar-btn" data-bg-btn="gray" aria-label="灰蓝" title="灰蓝">🩶</button>
                    <button class="toolbar-btn" data-bg-btn="lavender" aria-label="雪青" title="雪青">🪻</button>
                    <button class="toolbar-btn" data-bg-btn="dark" aria-label="暗夜" title="暗夜">🌙</button>
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
                <div class="reader-sidebar-title">📚 全部章节</div>
                <div class="reader-sidebar-meta">
                    共 <span id="total-chars">0</span> 字 · 已读 <span id="read-percent">0%</span>
                </div>
                <div class="reader-progress-bar">
                    <div class="reader-progress-fill" id="progress-fill"></div>
                </div>
            </div>
            <ul class="reader-episode-list" id="episode-list" role="list">
                <!-- JS 动态生成 -->
            </ul>
        </aside>

        <!-- 移动端遮罩 -->
        <div class="reader-overlay" id="sidebar-overlay"></div>

        <!-- 主阅读区 -->
        <main class="reader-main" id="reader-main" role="main">
            <article class="reader-article" id="reader-article">
                <header class="reader-episode-header">
                    <div class="episode-eyebrow" id="article-eyebrow">卷 首</div>
                    <div class="reader-episode-num" id="article-num">第 01 集</div>
                    <h1 class="reader-episode-title" id="article-title">加载中...</h1>
                    <div class="reader-episode-meta">
                        <span class="meta-tag" id="article-progress">第 1 / 21 集</span>
                        <span class="meta-divider">·</span>
                        <span class="meta-tag" id="article-words">📝 0 字</span>
                        <span class="meta-divider">·</span>
                        <span class="meta-tag" id="article-time">⏱ 约 0 分钟</span>
                    </div>
                    <div class="episode-divider" aria-hidden="true">❀</div>
                </header>
                <div class="reader-episode-content" id="article-content">
                    <!-- JS 动态填充 -->
                </div>
                <div class="episode-end" aria-hidden="true">— 本 集 完 —</div>

                <nav class="reader-episode-nav" aria-label="上下集导航">
                    <a href="#" class="reader-nav-btn prev" id="nav-prev" data-action="prev-episode">
                        <span class="reader-nav-arrow prev">←</span>
                        <span class="reader-nav-label">上一集</span>
                        <span class="reader-nav-title" id="nav-prev-title">第 20 集</span>
                    </a>
                    <a href="#" class="reader-nav-btn next" id="nav-next" data-action="next-episode">
                        <span class="reader-nav-arrow next">→</span>
                        <span class="reader-nav-label">下一集</span>
                        <span class="reader-nav-title" id="nav-next-title">第 02 集</span>
                    </a>
                </nav>
            </article>

            <div class="reader-footer-tip">
                💡 快捷键：<kbd>Ctrl/Cmd</kbd> + <kbd>←</kbd> <kbd>→</kbd> 翻章 ·
                <kbd>Ctrl/Cmd</kbd> + <kbd>+</kbd> <kbd>−</kbd> 调字号<br>
                所有设置（章节、滚动位置、字号、行高、底色）将自动记忆在本地浏览器
            </div>
        </main>
    </div>

    <!-- 回到顶部 -->
    <button class="reader-back-top" id="back-top" aria-label="回到顶部" title="回到顶部">↑</button>

    <!-- ========== 数据与脚本 ========== -->
    <script>
    // ====== 课程数据（21 集原文）======
    {{DATA}}

    // ====== localStorage 键命名（统一前缀避免冲突）======
    const STORAGE_KEYS = {
        currentEpisode: 'wunegnda_chapters:current_episode',
        scrollPosition: 'wunegnda_chapters:scroll_position',
        fontSize: 'wunegnda_chapters:font_size',
        lineHeight: 'wunegnda_chapters:line_height',
        bgColor: 'wunegnda_chapters:bg_color',
        readSet: 'wunegnda_chapters:read_set'
    };

    // ====== 默认设置 ======
    const DEFAULTS = {
        fontSize: 'medium',
        lineHeight: 'comfortable',
        bgColor: 'paper',
        currentEpisode: 1,
        scrollPosition: 0
    };

    // ====== 工具函数 ======
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    /** 从 localStorage 读取偏好，失败回退到默认值 */
    function loadPref(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v !== null ? v : fallback;
        } catch (e) {
            return fallback;
        }
    }

    /** 保存偏好到 localStorage（带异常保护） */
    function savePref(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (e) {
            console.warn('localStorage save failed:', e);
        }
    }

    /** 读取已读章节集合 */
    function loadReadSet() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.readSet);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch (e) {
            return new Set();
        }
    }

    /** 保存已读章节集合 */
    function saveReadSet(set) {
        try {
            localStorage.setItem(STORAGE_KEYS.readSet, JSON.stringify([...set]));
        } catch (e) {}
    }

    // ====== 数字转中文（用于卷次显示）======
    function numToCn(n) {
        const map = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        if (n <= 10) return map[n];
        if (n < 20) return '十' + map[n - 10];
        if (n < 100) {
            const t = Math.floor(n / 10);
            const o = n % 10;
            return map[t] + '十' + (o ? map[o] : '');
        }
        return String(n);
    }

    // ====== 章节中文标题（手工提炼）======
    const CHAPTER_TITLES = {
        1:  '成为 AI 高级用户',
        2:  'AI 的预训练知识',
        3:  '网络搜索：突破知识截止',
        4:  '网络搜索的局限与改进',
        5:  '深度研究：综合多源信息',
        6:  '查找信息实践实验室',
        7:  'AI 作为思考伙伴',
        8:  '上下文：让 AI 真正懂你',
        9:  'AI 桌面协作应用',
        10: 'AI 推理与深度思考',
        11: '对抗谄媚效应',
        12: '与 AI 协作写作',
        13: '让 AI 编辑与评论',
        14: '思考伙伴实践实验室',
        15: '多模态 AI：图像/视频/语音',
        16: '图像输入与视觉理解',
        17: 'AI 图像生成的艺术',
        18: '用 AI 构建应用',
        19: 'AI 数据分析',
        20: '实践实验室与期末项目',
        21: '结语：成为 AI 高级用户'
    };

    // ====== 全局状态 ======
    const state = {
        currentEpisode: parseInt(loadPref(STORAGE_KEYS.currentEpisode, DEFAULTS.currentEpisode), 10) || 1,
        fontSize: loadPref(STORAGE_KEYS.fontSize, DEFAULTS.fontSize),
        lineHeight: loadPref(STORAGE_KEYS.lineHeight, DEFAULTS.lineHeight),
        bgColor: loadPref(STORAGE_KEYS.bgColor, DEFAULTS.bgColor),
        readSet: loadReadSet()
    };

    // ====== 应用设置到 DOM ======
    function applySettings() {
        // 字号、行高、底色通过 data-attr 切换 CSS 变量
        document.documentElement.setAttribute('data-bg-color', state.bgColor);
        document.documentElement.setAttribute('data-font-size', state.fontSize);
        document.documentElement.setAttribute('data-line-height', state.lineHeight);

        // 同步底色按钮状态
        $$('[data-bg-btn]').forEach(btn => {
            const pressed = btn.getAttribute('data-bg-btn') === state.bgColor;
            btn.setAttribute('aria-pressed', String(pressed));
        });

        // 同步行高按钮状态
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

    // ====== HTML 转义（防止 XSS & 渲染问题）======
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 美化段落：将中文双引号包裹的内容用 <span> 包裹便于着色
     * 同时处理引号字符（" " ‘ ’）以保证视觉一致
     */
    function decorateParagraph(text) {
        // 先做安全转义
        let html = escapeHtml(text);
        // 将 "…" “…” ‘…’ 三类成对引号中的内容标黄
        // 匹配 " ... " 或 " ... " 或 ' ... ' 中间的非空内容
        html = html.replace(/([“”"']([^“”"'…]{1,80}?)[”"'])/g, function(_, full) {
            return '<span class="quote-cn">' + full + '</span>';
        });
        return html;
    }

    // ====== 渲染侧边栏章节列表 ======
    function renderEpisodeList() {
        const list = $('#episode-list');
        list.innerHTML = EPISODES_DATA.map(ep => {
            const isActive = ep.id === state.currentEpisode;
            const isRead = state.readSet.has(ep.id);
            const charCount = ep.paragraphs.reduce((sum, p) => sum + p.length, 0);
            const title = CHAPTER_TITLES[ep.id] || '';
            return `
                <li class="reader-episode-item ${isActive ? 'is-active' : ''} ${isRead ? 'is-read' : ''}"
                    data-episode-id="${ep.id}" tabindex="0"
                    role="button"
                    aria-label="跳转到第 ${ep.id} 集 ${title}（${charCount} 字）">
                    <div class="episode-list-num">${isRead ? '✓' : numToCn(ep.id)}</div>
                    <div class="episode-list-info">
                        <div class="episode-list-title">第 ${numToCn(ep.id)} 集</div>
                        <div class="episode-list-subtitle">${escapeHtml(title)}</div>
                        <div class="episode-list-meta">${charCount.toLocaleString()} 字 · ${ep.paragraphs.length} 段</div>
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

        const chapterTitle = CHAPTER_TITLES[ep.id] || '';

        // 标题与元信息
        $('#article-num').textContent = `第 ${numToCn(ep.id)} 集`;
        $('#article-eyebrow').textContent = `卷 ${numToCn(ep.id)}`;
        $('#article-progress').textContent = `第 ${ep.id} / ${EPISODES_DATA.length} 集`;
        const charCount = ep.paragraphs.reduce((sum, p) => sum + p.length, 0);
        $('#article-words').textContent = `📝 ${charCount.toLocaleString()} 字`;

        // 估算阅读时间（中文 300 字/分钟）
        const minutes = Math.max(1, Math.round(charCount / 300));
        $('#article-time').textContent = `⏱ 约 ${minutes} 分钟`;

        // 章节标题：使用预定义标题，回退到首段预览
        const firstPara = ep.paragraphs[0] || '';
        const titlePreview = firstPara.length > 26 ? firstPara.slice(0, 26) + '…' : firstPara;
        $('#article-title').textContent = chapterTitle || titlePreview || '原文章节';

        // 浏览器标签页标题同步
        document.title = chapterTitle
            ? `第 ${numToCn(ep.id)} 集 · ${chapterTitle} | 吴恩达 AI Prompting`
            : `第 ${numToCn(ep.id)} 集 · 原文章节 | 吴恩达 AI Prompting`;

        // 内容：每段一个 <p>，首段加首字下沉样式
        const contentHtml = ep.paragraphs
            .map((p, idx) => {
                const cls = idx === 0 ? 'reader-paragraph is-first' : 'reader-paragraph';
                return `<p class="${cls}">${decorateParagraph(p)}</p>`;
            })
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
            $('#nav-prev-title').textContent = `第 ${numToCn(prevEp.id)} 集`;
        } else {
            prevBtn.classList.add('is-disabled');
            prevBtn.setAttribute('aria-disabled', 'true');
            $('#nav-prev-title').textContent = '已是第一集';
        }

        if (nextEp) {
            nextBtn.classList.remove('is-disabled');
            nextBtn.removeAttribute('aria-disabled');
            $('#nav-next-title').textContent = `第 ${numToCn(nextEp.id)} 集`;
        } else {
            nextBtn.classList.add('is-disabled');
            nextBtn.setAttribute('aria-disabled', 'true');
            $('#nav-next-title').textContent = '已是最后一集';
        }

        // 同步 URL hash
        history.replaceState(null, '', `#episode-${ep.id}`);

        // 同步侧边栏 active
        $$('.reader-episode-item').forEach(item => {
            const id = parseInt(item.getAttribute('data-episode-id'), 10);
            item.classList.toggle('is-active', id === state.currentEpisode);
        });

        // 标记当前章节已读
        state.readSet.add(state.currentEpisode);
        saveReadSet(state.readSet);
        updateProgress();

        // 触发重新动画
        const article = $('#reader-article');
        article.style.animation = 'none';
        void article.offsetWidth;
        article.style.animation = '';
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
        if (epId === state.currentEpisode) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        state.currentEpisode = epId;
        savePref(STORAGE_KEYS.currentEpisode, epId);
        savePref(STORAGE_KEYS.scrollPosition, 0);
        renderCurrentEpisode();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth <= 1024) {
            toggleSidebar(false);
        }
    }

    // ====== 字号调节 ======
    const FONT_SIZES = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
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

    // ====== 底色切换 ======
    function setBgColor(color) {
        state.bgColor = color;
        savePref(STORAGE_KEYS.bgColor, color);
        document.documentElement.setAttribute('data-bg-color', color);
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

    // ====== 回到顶部按钮 + 进度条 ======
    function setupBackToTop() {
        const btn = $('#back-top');
        const progressBar = $('#reading-progress');
        window.addEventListener('scroll', () => {
            btn.classList.toggle('is-visible', window.scrollY > 400);
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ====== 阅读位置记忆 ======
    let scrollSaveTimer = null;
    let pendingRestoreScroll = 0;
    function setupScrollMemory() {
        const savedScroll = parseInt(loadPref(STORAGE_KEYS.scrollPosition, '0'), 10) || 0;
        pendingRestoreScroll = savedScroll;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (pendingRestoreScroll > 0) {
                    window.scrollTo(0, pendingRestoreScroll);
                }
            });
        });

        window.addEventListener('scroll', () => {
            if (scrollSaveTimer) clearTimeout(scrollSaveTimer);
            scrollSaveTimer = setTimeout(() => {
                savePref(STORAGE_KEYS.scrollPosition, window.scrollY);
            }, 500);
        }, { passive: true });
    }

    // ====== 事件绑定 ======
    function bindEvents() {
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

        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-bg-btn]');
            if (!btn) return;
            e.preventDefault();
            setBgColor(btn.getAttribute('data-bg-btn'));
        });

        $('#episode-list').addEventListener('click', (e) => {
            const item = e.target.closest('[data-episode-id]');
            if (!item) return;
            switchToEpisode(item.getAttribute('data-episode-id'));
        });

        $('#episode-list').addEventListener('keydown', (e) => {
            const item = e.target.closest('[data-episode-id]');
            if (!item) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchToEpisode(item.getAttribute('data-episode-id'));
            }
        });

        $('#sidebar-overlay').addEventListener('click', () => toggleSidebar(false));

        document.addEventListener('keydown', (e) => {
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

        window.addEventListener('hashchange', () => {
            const m = location.hash.match(/^#episode-(\d+)$/);
            if (m) switchToEpisode(m[1]);
        });
    }

    // ====== 初始化 ======
    function init() {
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    </script>
</body>
</html>
"""

# 读取数据
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data_content = f.read()

# 直接使用整个数据文件内容（包含 const EPISODES_DATA = [...] 声明）
data_array = data_content.rstrip()

# 替换占位符
html = HTML_TEMPLATE.replace('{{DATA}}', data_array)

# 写出
with open(OUT_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

size_kb = os.path.getsize(OUT_FILE) / 1024
print(f"HTML 已生成: {OUT_FILE}")
print(f"文件大小: {size_kb:.1f} KB")
