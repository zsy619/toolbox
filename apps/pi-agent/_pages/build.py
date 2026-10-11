#!/usr/bin/env python3
"""
Markdown → 章节页 HTML 批量生成器
================================
输入：_pages/docs_prac/*.md（实战篇）+ docs_src_ts/*.md（源码篇 TS）+ docs_src_py/*.md（源码篇 Python）
输出：P01.html ... P07.html（实战篇）、M01.html ... M10.html（源码篇 TS 与 Python 各一份）
共用：_shared/css/, _shared/js/（已下载）
"""
import os, re, json, html, urllib.parse, sys, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / '_pages'
SHARED = '_shared'  # 相对路径

# ============================================================
# 1. 章节元数据（顺序、标题、副标题、上下文版本号）
# ============================================================
PRACTICE = [
    ('P01', '第1章', '环境部署',          '10 分钟跑通你的第一个 Agent'),
    ('P02', '第2章', '先看全貌',          '搞懂 pi-agent 工作机制'),
    ('P03', '第3章', '模型配置关键点',     '判断企业内网模型能否接入'),
    ('P04', '第4章', '系统提示词',         '必须覆盖默认 Agent 人设'),
    ('P05', '第5章', '定义工具',           '从功能实现到交互体验'),
    ('P06', '第6章', '事件监听',           '实现你的所有个性化需求'),
    ('P07', '第7章', '准备上线',           '把 Agent 封装成一个服务'),
]
SOURCE_TS = [
    ('M01', '第1章', '开篇',              'Pi-Agent 框架总览'),
    ('M02', '第2章', '三层架构',           'Pi-Agent 项目的骨骼'),
    ('M03', '第3章', 'Agent Loop',        '让模型转动起来的引擎'),
    ('M04', '第4章', '模型调用',           '一行代码驾驭多模型'),
    ('M05', '第5章', '工具系统',           'Agent 的手脚是怎么被管住的'),
    ('M06', '第6章', '消息系统',           'Agent 的记忆如何组织与传递'),
    ('M07', '第7章', '事件驱动',           'Agent 的神经系统'),
    ('M08', '第8章', '上下文工程',         '让有限窗口装下无限对话'),
    ('M09', '第9章', '上下文压缩',         '当对话太长怎么办'),
    ('M10', '第10章', '会话管理',          '对话的存储恢复与分叉'),
]
SOURCE_PY = SOURCE_TS  # 同序号同主题

# ============================================================
# 2. 章节索引（章节号 → 文件名，用于前后导航）
# ============================================================
FILE_OF = {
    ('prac', 1): 'P01.html', ('prac', 2): 'P02.html', ('prac', 3): 'P03.html',
    ('prac', 4): 'P04.html', ('prac', 5): 'P05.html', ('prac', 6): 'P06.html',
    ('prac', 7): 'P07.html',
}
for i in range(1, 11):
    FILE_OF[('ts', i)] = f'M{i:02d}.html'
    FILE_OF[('py', i)] = f'M{i:02d}-py.html'

# ============================================================
# 3. 共享 CSS（章节页用原生 CSS，无需 Tailwind 全套）
# ============================================================
CHAPTER_CSS = r"""
:root {
    color-scheme: dark;
    --bg: #0b1020;
    --bg2: #11172c;
    --surface: #1a2138;
    --border: #2c3656;
    --text: #e6e9f5;
    --muted: #9aa3c4;
    --accent: #818cf8;
    --accent2: #c084fc;
    --success: #34d399;
    --warn: #fbbf24;
    --danger: #f87171;
    --code-bg: #0a0f1f;
    --code-border: #2c3656;
}
html[data-theme="light"] {
    color-scheme: light;
    --bg: #f8fafc;
    --bg2: #ffffff;
    --surface: #ffffff;
    --border: #e2e8f0;
    --text: #0f172a;
    --muted: #475569;
    --accent: #4f46e5;
    --accent2: #7c3aed;
    --success: #059669;
    --warn: #b45309;
    --danger: #dc2626;
    --code-bg: #f6f8fa;
    --code-border: #e2e8f0;
}
* { box-sizing: border-box; }
html { -webkit-tap-highlight-color: transparent; }
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei",
        "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 15px;
    line-height: 1.78;
    color: var(--text);
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
    transition: background-color .25s ease, color .25s ease;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
::selection { background: rgba(99, 102, 241, .28); }

/* ===== 顶部导航 ===== */
.nav {
    position: sticky; top: 0; z-index: 50;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
}
.nav-inner {
    max-width: 1200px; margin: 0 auto;
    height: 56px; padding: 0 20px;
    display: flex; align-items: center; gap: 14px;
}
.nav-brand {
    display: inline-flex; align-items: center; gap: 8px;
    font-weight: 600; color: var(--text);
}
.nav-brand .dot {
    width: 26px; height: 26px; border-radius: 7px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: grid; place-items: center;
    color: #fff; font-size: 12px; font-weight: 700;
}
.nav-spacer { flex: 1; }
.nav a.btn-nav {
    padding: 6px 12px; border-radius: 8px;
    font-size: 13px; color: var(--muted);
    border: 1px solid transparent;
}
.nav a.btn-nav:hover { background: var(--surface); color: var(--text); text-decoration: none; }
.nav a.btn-nav.primary {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
}
.nav button.icon-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); cursor: pointer;
    display: grid; place-items: center; font-size: 14px;
    transition: transform .2s ease;
}
.nav button.icon-btn:hover { transform: rotate(15deg); }

/* ===== 布局 ===== */
.layout {
    max-width: 1200px; margin: 0 auto;
    display: grid; gap: 28px;
    grid-template-columns: 260px minmax(0, 1fr);
    padding: 28px 20px 80px;
}
aside.sidebar {
    position: sticky; top: 84px; align-self: start;
    max-height: calc(100vh - 100px); overflow-y: auto;
    font-size: 13px;
}
aside.sidebar::-webkit-scrollbar { width: 4px; }
aside.sidebar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.sidebar h4 {
    margin: 14px 0 6px; font-size: 11px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--muted);
    font-weight: 600;
}
.sidebar h4:first-child { margin-top: 0; }
.sidebar ul { list-style: none; margin: 0; padding: 0; }
.sidebar li a {
    display: block; padding: 5px 10px; border-radius: 6px;
    color: var(--muted);
    border-left: 2px solid transparent;
}
.sidebar li a:hover {
    background: var(--surface); color: var(--text); text-decoration: none;
}
.sidebar li a.active {
    color: var(--text); background: var(--surface);
    border-left-color: var(--accent);
    font-weight: 600;
}
.sidebar li a .num {
    display: inline-block; min-width: 26px;
    color: var(--muted); font-variant-numeric: tabular-nums;
}

main article {
    max-width: 820px; margin: 0 auto;
}

/* ===== 章节封面 ===== */
.chapter-cover {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
}
.chapter-cover .crumb {
    font-size: 12px; color: var(--muted); margin-bottom: 12px;
    letter-spacing: .04em;
}
.chapter-cover .crumb a { color: var(--muted); }
.chapter-cover h1 {
    margin: 8px 0 10px;
    font-size: 32px; line-height: 1.25;
    font-weight: 700; letter-spacing: -.01em;
}
.chapter-cover .subtitle {
    font-size: 16px; color: var(--muted); font-weight: 400;
    margin-top: 6px;
}
.chapter-cover .tag {
    display: inline-block; padding: 3px 9px; border-radius: 999px;
    font-size: 11px; font-weight: 600;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff; margin-bottom: 8px;
}
.chapter-cover .meta {
    margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;
    color: var(--muted); font-size: 12px;
}

/* ===== 正文排版 ===== */
article h2 {
    margin: 36px 0 14px; padding-top: 4px;
    font-size: 22px; font-weight: 700;
    border-bottom: 1px solid var(--border); padding-bottom: 8px;
}
article h3 {
    margin: 28px 0 12px;
    font-size: 18px; font-weight: 700;
    color: var(--accent);
}
article h4 {
    margin: 22px 0 10px;
    font-size: 16px; font-weight: 700;
    color: var(--accent2);
}
article p { margin: 12px 0; }
article ul, article ol { margin: 12px 0; padding-left: 24px; }
article li { margin: 4px 0; }
article li > p { margin: 4px 0; }
article blockquote {
    margin: 18px 0;
    padding: 12px 18px;
    border-left: 4px solid var(--accent);
    background: var(--surface);
    border-radius: 0 8px 8px 0;
    color: var(--muted);
}
article blockquote p { margin: 6px 0; }
article blockquote p:first-child { margin-top: 0; }
article blockquote p:last-child { margin-bottom: 0; }
article hr {
    border: 0; border-top: 1px solid var(--border);
    margin: 28px 0;
}
article img { max-width: 100%; height: auto; border-radius: 8px; }

/* 行内代码 */
article :not(pre) > code {
    padding: 2px 6px; border-radius: 4px;
    background: var(--surface); color: var(--accent2);
    font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: .88em; border: 1px solid var(--border);
}

/* ===== 代码块 ===== */
.code-wrap {
    position: relative;
    margin: 16px 0;
    border: 1px solid var(--code-border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--code-bg);
}
.code-wrap .lang-tag {
    position: absolute; top: 0; right: 60px;
    padding: 6px 10px;
    font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
    color: var(--muted);
    font-family: ui-monospace, monospace;
}
.code-wrap .copy-btn {
    position: absolute; top: 4px; right: 4px;
    padding: 4px 10px; font-size: 11px;
    border-radius: 6px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--muted); cursor: pointer;
    transition: all .2s;
    font-family: inherit;
}
.code-wrap .copy-btn:hover {
    color: var(--text); border-color: var(--accent);
}
.code-wrap .copy-btn.ok {
    color: var(--success); border-color: var(--success);
}
.code-wrap pre {
    margin: 0; padding: 14px 16px;
    overflow-x: auto;
    background: transparent;
}
.code-wrap pre code {
    font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace;
    font-size: 13px; line-height: 1.6;
    background: transparent;
    padding: 0;
    border: 0;
}

/* ===== 表格 ===== */
.table-wrap {
    margin: 16px 0; overflow-x: auto;
    border: 1px solid var(--border); border-radius: 8px;
}
article table {
    width: 100%; border-collapse: collapse;
    font-size: 14px;
}
article th, article td {
    padding: 10px 14px; text-align: left;
    border-bottom: 1px solid var(--border);
}
article th {
    background: var(--surface); font-weight: 600;
    color: var(--text);
}
article tr:last-child td { border-bottom: 0; }
article tr:nth-child(even) td { background: color-mix(in srgb, var(--surface) 50%, transparent); }

/* ===== 章节内底部导航 ===== */
.chapter-nav {
    margin-top: 60px; padding-top: 24px;
    border-top: 1px solid var(--border);
    display: flex; gap: 12px; flex-wrap: wrap;
    justify-content: space-between;
}
.chapter-nav a {
    padding: 10px 16px; border: 1px solid var(--border);
    border-radius: 8px; color: var(--muted);
    font-size: 13px;
}
.chapter-nav a:hover {
    background: var(--surface); color: var(--text); text-decoration: none;
    border-color: var(--accent);
}
.chapter-nav .next { margin-left: auto; }

/* ===== 移动端折叠侧栏 ===== */
.mobile-toggle {
    display: none; width: 32px; height: 32px;
    border-radius: 8px; background: var(--surface);
    border: 1px solid var(--border); color: var(--text);
    cursor: pointer; align-items: center; justify-content: center;
}
@media (max-width: 880px) {
    .layout {
        grid-template-columns: 1fr;
        gap: 16px; padding: 16px 14px 60px;
    }
    aside.sidebar {
        position: static; max-height: none;
        background: var(--surface); border: 1px solid var(--border);
        border-radius: 10px; padding: 14px 16px;
    }
    aside.sidebar.collapsed > ul, aside.sidebar.collapsed > h4:not(:first-child) { display: none; }
    .mobile-toggle { display: inline-flex; }
    .chapter-cover h1 { font-size: 24px; }
    article h2 { font-size: 19px; }
    article h3 { font-size: 16px; }
}
"""

# ============================================================
# 4. Markdown 转换器（一次只解一种块）
# ============================================================
INLINE = [
    # 链接：外链加 rel=noopener noreferrer
    (re.compile(r'\[([^\]]*)\]\(([^)]+)\)'), lambda m: _render_link(m.group(1), m.group(2))),
    # 行内代码
    (re.compile(r'`([^`]+)`'), r'<code>\1</code>'),
    # 加粗
    (re.compile(r'\*\*([^*]+)\*\*'), r'<strong>\1</strong>'),
    # 斜体
    (re.compile(r'(?<!\*)\*([^*\n]+)\*(?!\*)'), r'<em>\1</em>'),
    # 图片
    (re.compile(r'!\[([^\]]*)\]\(([^)]+)\)'), lambda m: _render_image(m.group(1), m.group(2))),
]

def _render_link(text, url):
    is_external = url.startswith(('http://', 'https://'))
    extra = ' target="_blank" rel="noopener noreferrer"' if is_external else ''
    return f'<a href="{html.escape(url)}"{extra}>{html.escape(text)}</a>'

def _render_image(alt, url):
    return f'<img src="{html.escape(url)}" alt="{html.escape(alt)}" loading="lazy">'

def apply_inline(s):
    # 多次扫描，因为正则可能重叠（如 [text](url) 内含 `code`）
    out = html.escape(s, quote=False)
    # 先把已转义的字符还原
    out = out.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#39;', "'")
    for pat, repl in INLINE:
        out = pat.sub(repl, out)
    return out

# 代码块语言 → highlight.js 类名
LANG_MAP = {
    'typescript': 'typescript', 'ts': 'typescript', 'tsx': 'typescript',
    'javascript': 'javascript', 'js': 'javascript',
    'python': 'python', 'py': 'python',
    'json': 'json', 'jsonl': 'json',
    'bash': 'bash', 'sh': 'bash', 'shell': 'bash',
    'xml': 'xml', 'html': 'xml',
    'markdown': 'markdown', 'md': 'markdown',
    'mermaid': 'plaintext',  # 不高亮
}

def md_to_html(md):
    """极简 Markdown → HTML。支持：标题、列表、引用、代码块、表格、分隔线、链接、图片。"""
    lines = md.split('\n')
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # 代码块（围栏）
        if stripped.startswith('```'):
            lang = stripped[3:].strip().lower()
            lang_class = LANG_MAP.get(lang, 'plaintext')
            i += 1
            buf = []
            while i < len(lines) and not lines[i].strip().startswith('```'):
                buf.append(lines[i])
                i += 1
            code = '\n'.join(buf).rstrip('\n')
            i += 1  # 跳过结尾的 ```
            esc_code = html.escape(code)
            out.append(
                f'<div class="code-wrap"><span class="lang-tag">{html.escape(lang or "text")}</span>'
                f'<button class="copy-btn" type="button" aria-label="复制代码">复制</button>'
                f'<pre><code class="language-{lang_class} hljs">{esc_code}</code></pre></div>'
            )
            continue

        # 分隔线
        if re.match(r'^-{3,}$|^\*{3,}$', stripped):
            out.append('<hr>')
            i += 1
            continue

        # 标题
        m = re.match(r'^(#{1,6})\s+(.+)$', stripped)
        if m:
            level = len(m.group(1))
            text = apply_inline(m.group(2).strip())
            # 去重：首行 h1 通常与 chapter-cover 上的 h1 重复（例如
            # 「第1章：环境部署 —— 10 分钟跑通你的第一个 Agent」）。把它降级
            # 为 h2 即可消除「页面同时有两个 h1」的语义问题。
            if i == 0 and level == 1:
                level = 2
            out.append(f'<h{level}>{text}</h{level}>')
            i += 1
            continue

        # 引用
        if stripped.startswith('>'):
            buf = []
            while i < len(lines) and lines[i].lstrip().startswith('>'):
                buf.append(lines[i].lstrip()[1:].lstrip())
                i += 1
            inner = '<br>'.join(apply_inline(l) for l in buf)
            out.append(f'<blockquote>{inner}</blockquote>')
            continue

        # 表格
        if '|' in stripped and i + 1 < len(lines) and re.match(r'^\s*\|?[\s\-:|]+\|[\s\-:|]+\|', lines[i + 1]):
            head_cells = [c.strip() for c in stripped.strip('|').split('|')]
            i += 2  # 跳过分隔行
            rows = []
            while i < len(lines) and '|' in lines[i] and lines[i].strip():
                row_cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                rows.append(row_cells)
                i += 1
            tbl = ['<div class="table-wrap"><table><thead><tr>']
            for c in head_cells:
                tbl.append(f'<th>{apply_inline(c)}</th>')
            tbl.append('</tr></thead><tbody>')
            for r in rows:
                tbl.append('<tr>' + ''.join(f'<td>{apply_inline(c)}</td>' for c in r) + '</tr>')
            tbl.append('</tbody></table></div>')
            out.append(''.join(tbl))
            continue

        # 无序列表
        m = re.match(r'^(\s*)[-*+]\s+(.+)$', line)
        if m:
            indent = len(m.group(1))
            out.append(_render_ul(lines, i, indent))
            # 跳到已消费的行数
            while i < len(lines):
                lm = re.match(r'^(\s*)(?:[-*+]|\d+\.)\s+', lines[i])
                if not lm or len(lm.group(1)) < indent or lines[i].strip() == '':
                    # 退一层或空行才停
                    if lines[i].strip() == '' and i + 1 < len(lines):
                        nxt = lines[i + 1]
                        nm = re.match(r'^(\s*)(?:[-*+]|\d+\.)\s+', nxt)
                        if not nm or len(nm.group(1)) <= indent:
                            break
                        if not nm:
                            break
                    elif not lm:
                        break
                if lm and len(lm.group(1)) != indent:
                    break
                i += 1
            continue

        # 有序列表
        m = re.match(r'^(\s*)\d+\.\s+(.+)$', line)
        if m:
            indent = len(m.group(1))
            out.append(_render_ol(lines, i, indent))
            while i < len(lines):
                lm = re.match(r'^(\s*)\d+\.\s+', lines[i])
                if lm and len(lm.group(1)) == indent:
                    i += 1
                else:
                    break
            continue

        # 空行：跳过
        if stripped == '':
            i += 1
            continue

        # 段落（合并相邻非空行）
        buf = [stripped]
        i += 1
        while i < len(lines) and lines[i].strip() and not _starts_block(lines[i]):
            buf.append(lines[i].strip())
            i += 1
        out.append(f'<p>{apply_inline(" ".join(buf))}</p>')

    return '\n'.join(out)

def _starts_block(s):
    t = s.lstrip()
    return (t.startswith('#') or t.startswith('>') or t.startswith('```')
            or t.startswith('-') or t.startswith('*') or t.startswith('+')
            or re.match(r'^\d+\.\s', t) or t == '' or re.match(r'^-{3,}$', t)
            or re.match(r'^\|', t))

def _render_ul(lines, start, base_indent):
    buf = ['<ul>']
    i = start
    while i < len(lines):
        m = re.match(r'^(\s*)[-*+]\s+(.+)$', lines[i])
        if not m or len(m.group(1)) != base_indent:
            break
        content = m.group(2)
        # 收集本项后续缩进行（嵌套子项或段落延续）
        j = i + 1
        extra_indent = base_indent + 2
        while j < len(lines):
            lm = re.match(r'^(\s*)(\S.*)$', lines[j])
            if lm and len(lm.group(1)) >= extra_indent and lm.group(2) and not lines[j].strip() == '':
                content += ' ' + lm.group(2).strip()
                j += 1
            elif lines[j].strip() == '':
                j += 1
                break
            else:
                break
        buf.append(f'<li>{apply_inline(content)}</li>')
        i = j
    buf.append('</ul>')
    return ''.join(buf)

def _render_ol(lines, start, base_indent):
    buf = ['<ol>']
    i = start
    while i < len(lines):
        m = re.match(r'^(\s*)\d+\.\s+(.+)$', lines[i])
        if not m or len(m.group(1)) != base_indent:
            break
        content = m.group(2)
        buf.append(f'<li>{apply_inline(content)}</li>')
        i += 1
    buf.append('</ol>')
    return ''.join(buf)

# ============================================================
# 5. 章节元数据（编号 → 文件名映射；用于上一/下一章）
# ============================================================
def chapter_meta(group, idx):
    if group == 'prac':
        code, no, short, sub = PRACTICE[idx - 1]
        return dict(code=code, no=no, short=short, sub=sub, group='prac', next_idx=idx + 1 if idx < 7 else None,
                    prev_idx=idx - 1 if idx > 1 else None)
    code, no, short, sub = (SOURCE_TS if group == 'ts' else SOURCE_PY)[idx - 1]
    return dict(code=code, no=no, short=short, sub=sub, group=group,
                next_idx=idx + 1 if idx < 10 else None,
                prev_idx=idx - 1 if idx > 1 else None)

def siblings(group, idx):
    """返回同章节另一版本（TS ↔ Python）。"""
    if group == 'ts':
        return ('py', idx)
    if group == 'py':
        return ('ts', idx)


# ============================================================
# 6.5 官方权威补丁（与 earendil-works/pi + pi.dev 文档对齐）
# 不修改源 .md，在 build 时按章节代码注入。每条有：
#   code: 章节号（P02 / M03 等）
#   group: prac / ts / py（py 与 ts 同内容，可共用）
#   title: 区块小标题
#   body_html: HTML 正文（已转义）
# 通用调用：render_official_patches(group, code) -> 拼接 HTML
# ============================================================
OFFICIAL_PATCHES = {
    # P02 入门：AGENTS.md 与 .agents/skills/ 上溯加载
    ('prac', 'P02'): [
        {
            'title': 'AGENTS.md 与 .agents/skills/ 双路加载',
            'html': '''
<p>官方 ResourceLoader 的解析顺序（详见 <a href="./reference.html#dir" target="_blank" rel="noopener noreferrer">官方对照 ⑤</a>）：</p>
<ul>
  <li><code>cwd</code> 默认从 <code>process.cwd()</code> 开始，<strong>向上溯</strong>到 git 仓库根（或文件系统根）找 <code>AGENTS.md</code>。</li>
  <li>Skill 目录同时支持 <code>.pi/skills/</code> 与 <code>.agents/skills/</code>：两层可叠加，越靠下越优先。</li>
  <li>全局层还会扫 <code>~/.pi/agent/skills/</code> 与 <code>~/.agents/skills/</code>。</li>
</ul>
<p>实战意义：在 monorepo 里把 Skill 放在 <code>.agents/skills/</code> 顶层，子包不用再复制一份；CI 里把 Skill 放在 <code>~/.agents/skills/</code>，所有项目自动可用。</p>
'''
        },
    ],
    # P06 事件监听：session 层 steer / followUp / queue_update / message_update
    ('prac', 'P06'): [
        {
            'title': 'SDK 会话层：session.steer() / session.followUp() / queue_update',
            'html': '''
<p>SDK 推荐直接用 <code>session</code> 上的方法排队，而不是通过 <code>PromptOptions.streamingBehavior</code>：</p>
<div class="code-wrap"><pre><code class="language-typescript">// 紧急插队：当前工具跑完后立刻注入，再走下一轮
await session.steer("别再调 read 了，直接给答案");

// 排队等候：当前 Trace 走完（agent_settled 之后）再启动新 Trace
await session.followUp("顺便跑一下 npm run check");

// 订阅队列变化，做前端提示
session.subscribe((event) => {
  if (event.type === "queue_update") {
    console.log("steering:", event.steering, "followUp:", event.followUp);
  }
});</code></pre></div>
<p><code>steer()</code> 与 <code>followUp()</code> 都会展开 prompt 模板，但<strong>拒绝扩展命令</strong>（扩展命令必须走 <code>prompt()</code>，不能排队）。完整规则见 <a href="./reference.html#event" target="_blank" rel="noopener noreferrer">官方对照 ③</a>。</p>
'''
        },
    ],
    # P07 上线：runPrintMode / runRpcMode / nix
    ('prac', 'P07'): [
        {
            'title': '三种运行模式：交互 / 打印 / RPC',
            'html': '''
<p>官方 SDK 内置三种模式，覆盖「本地交互 → CI 一次性 → 前后端分离」三类场景：</p>
<ul>
  <li><strong>InteractiveMode</strong>：默认 TUI 模式，等价于 <code>pi</code> 命令。</li>
  <li><strong>runPrintMode</strong>：把 prompt 回复打到 stdout 后退出，适合 CI、cron。</li>
  <li><strong>runRpcMode</strong>：起一个 stdio / pipe 上的 RPC 服务，前端/Web 用 NDJSON 收发事件。</li>
</ul>
<div class="code-wrap"><pre><code class="language-bash">$ pi                          # InteractiveMode
$ pi -p "总结 src/"          # runPrintMode 一次跑
$ pi --rpc                    # runRpcMode 起服务</code></pre></div>
<p>在程序化场景推荐 <code>createAgentSession()</code> 拿到 <code>session</code> 后自己跑事件订阅——比命令行更适合嵌入 Web / Worker（教程 P07 的 HTTP 接口就是这种模式）。</p>
'''
        },
        {
            'title': 'nix 与其它安装路径',
            'html': '''
<p>除了 <code>npm install -g</code>，官方还支持：</p>
<ul>
  <li><strong>nix（推荐）</strong>：<code>nix profile add github:earendil-works/pi/stable</code>，可升级到具体 tag：<code>nix profile add github:earendil-works/pi/v1.0.0</code>。</li>
  <li><strong>Windows</strong>：见 <a href="https://pi.dev/docs/latest/windows" target="_blank" rel="noopener noreferrer">官方 Windows 指南</a>。</li>
  <li><strong>Termux (Android)</strong>：见 <a href="https://pi.dev/docs/latest/termux" target="_blank" rel="noopener noreferrer">Termux 指南</a>。</li>
  <li><strong>tmux</strong>：见 <a href="https://pi.dev/docs/latest/tmux" target="_blank" rel="noopener noreferrer">tmux 指南</a>（Pi 跑在 detached session 里时的事件转发）。</li>
</ul>
'''
        },
    ],
    # M02 三层架构：createAgentSession 内部与 DefaultResourceLoader
    ('ts', 'M02'): [
        {
            'title': 'DefaultResourceLoader 与 createAgentSession 内部组件',
            'html': '''
<p><code>createAgentSession()</code> 不传参数时会自动装配四件套（详见 <a href="./reference.html#sdk" target="_blank" rel="noopener noreferrer">官方对照 ②</a>）：</p>
<ul>
  <li><strong>ModelRegistry</strong>：从 <code>~/.pi/agent/auth.json</code> + <code>~/.pi/agent/models.json</code> 读模型，提供 <code>find()</code> / <code>getAvailable()</code>。</li>
  <li><strong>AuthStorage</strong>：4 层 API Key 解析（运行时 override → auth.json → 环境变量 → 自定义 provider fallback）。</li>
  <li><strong>ResourceLoader</strong>：默认 <code>DefaultResourceLoader</code>，负责发现扩展 / Skill / Prompt / 上下文文件。</li>
  <li><strong>SessionManager</strong>：默认 <code>SessionManager.create()</code>，把对话存到 <code>~/.pi/agent/sessions/</code>。</li>
</ul>
<p>SDK 设计上把这四件套都做成可替换接口——你也可以自带 <code>ResourceLoader</code> 让 Agent 从你的私有技能库加载；只要实现 <code>loadExtensions / loadSkills / loadPromptTemplates / loadThemes / loadContextFiles</code> 五个方法。</p>
'''
        },
    ],
    # M10 会话管理：AgentSessionRuntime + navigateTree
    ('ts', 'M10'): [
        {
            'title': 'SDK 会话替换：AgentSessionRuntime',
            'html': '''
<p>需要"切会话"的操作（新会话 / 切换 / fork / 从 jsonl 导入）不在 <code>AgentSession</code> 上，而在专门的 <code>AgentSessionRuntime</code>。原因：会话替换会改 <code>runtime.session</code> 指针，subscribe 需要重订，extensions 要重绑——这些是 runtime 生命周期，不该让 session 自己管。</p>
<div class="code-wrap"><pre><code class="language-typescript">import { createAgentSessionRuntime, getAgentDir, SessionManager } from "@earendil-works/pi-coding-agent";

const runtime = await createAgentSessionRuntime(async ({ cwd }) => {
  const services = await createAgentSessionServices({ cwd });
  return createAgentSessionFromServices({ services, sessionManager, sessionStartEvent });
}, { cwd: process.cwd(), agentDir: getAgentDir() });

let { session, unbind } = { session: runtime.session, unbind: runtime.session.subscribe(() => {}) };

await runtime.newSession();  // 替换 session 指针
// 重新订阅 + 重新绑扩展
session = runtime.session;
unbind?.();
unbind = session.subscribe(() => {});
session.bindExtensions(yourExtensions);</code></pre></div>
<p>关键规则：</p>
<ul>
  <li><code>runtime.session</code> 在 <code>newSession / switchSession / fork / importFromJsonl</code> 之后会变。</li>
  <li>每次替换后 subscribe 必须重订；使用扩展的应用要再调 <code>session.bindExtensions(...)</code>。</li>
  <li>失败时方法直接抛错，由调用方决定兜底（<code>try/catch</code> 或回退到上一个 session）。</li>
</ul>
'''
        },
        {
            'title': 'session.navigateTree：树内导航（不走 Runtime）',
            'html': '''
<p>在<strong>同一个 session 文件</strong>内做"在历史里挑节点重发"，走 <code>session.navigateTree()</code>——它不是会话替换，所以不切 Runtime 指针：</p>
<div class="code-wrap"><pre><code class="language-typescript">interface NavigateTreeOptions {
  summarize?: boolean;           // 是否先做一次 compact
  customInstructions?: string;   // 自带的指引
  replaceInstructions?: boolean;// 是否替换默认指令
  label?: string;                // 节点标签
}

const { editorText, cancelled } = await session.navigateTree(targetId, {
  summarize: true,
  customInstructions: "改用更激进的解法",
  label: "重试 v2",
});</code></pre></div>
<p>区别：<code>navigateTree</code> 只在当前 session 内部跳历史节点；<code>runtime.fork()</code> 是把当前 session 分叉到一个新 session 文件。两者用在不同场景——前者是"我刚才的哪一步走错了，回去重走"，后者是"我要从这一刻起开始一个并行分支"。</p>
'''
        },
    ],
}


OFFICIAL_PATCHES_PY = {
    # M02 Python 版
    ('py', 'M02'): [
        {
            'title': 'DefaultResourceLoader 与 create_agent_session 内部组件',
            'html': '''
<p><code>create_agent_session()</code> 不传参数时会自动装配四件套（详见 <a href="./reference.html#dir" target="_blank" rel="noopener noreferrer">官方对照 ⑤</a>）：</p>
<ul>
  <li><strong>ModelRegistry</strong>：从 <code>~/.pi/agent/auth.json</code> + <code>~/.pi/agent/models.json</code> 读模型，提供 <code>find()</code> / <code>get_available()</code>。</li>
  <li><strong>AuthStorage</strong>：4 层 API Key 解析（运行时 override → auth.json → 环境变量 → 自定义 provider fallback）。</li>
  <li><strong>ResourceLoader</strong>：默认 <code>DefaultResourceLoader</code>，负责发现扩展 / Skill / Prompt / 上下文文件。</li>
  <li><strong>SessionManager</strong>：默认 <code>SessionManager.create()</code>，把对话存到 <code>~/.pi/agent/sessions/</code>。</li>
</ul>
<p>Python SDK 把这些都做成了可替换接口——你也可以自带 <code>ResourceLoader</code> 让 Agent 从你的私有技能库加载。</p>
'''
        },
    ],
    # M10 Python 版
    ('py', 'M10'): [
        {
            'title': 'SDK 会话替换：AgentSessionRuntime',
            'html': '''
<p>需要"切会话"的操作（新会话 / 切换 / fork / 从 jsonl 导入）不在 <code>AgentSession</code> 上，而在专门的 <code>AgentSessionRuntime</code>。会话替换会改 <code>runtime.session</code> 指针，subscribe 需要重订，extensions 要重绑——这些是 runtime 生命周期，不该让 session 自己管。</p>
<div class="code-wrap"><pre><code class="language-python">from earendil_works.pi_coding_agent import (
    create_agent_session_runtime, get_agent_dir, SessionManager,
)

async def factory(ctx):
    services = await create_agent_session_services(cwd=ctx["cwd"])
    return await create_agent_session_from_services(
        services=services,
        session_manager=session_manager,
        session_start_event=session_start_event,
    )

runtime = await create_agent_session_runtime(factory,
    cwd=os.getcwd(), agent_dir=get_agent_dir())

session, unbind = runtime.session, runtime.session.subscribe(lambda _e: None)
await runtime.new_session()  # 替换 session 指针

# 重新订阅 + 重新绑扩展
session = runtime.session
unbind()
unbind = session.subscribe(lambda _e: None)
session.bind_extensions(your_extensions)</code></pre></div>
<p>关键规则同 TS 版：<code>runtime.session</code> 在 <code>new_session / switch_session / fork / import_from_jsonl</code> 之后会变；失败时方法直接抛错，由调用方决定兜底。</p>
'''
        },
        {
            'title': 'session.navigate_tree：树内导航（不走 Runtime）',
            'html': '''
<p>在<strong>同一个 session 文件</strong>内做"在历史里挑节点重发"，走 <code>session.navigate_tree()</code>——它不是会话替换，不切 Runtime 指针：</p>
<div class="code-wrap"><pre><code class="language-python">result = await session.navigate_tree(
    target_id,
    summarize=True,
    custom_instructions="改用更激进的解法",
    replace_instructions=False,
    label="重试 v2",
)
editor_text = result["editor_text"]
cancelled = result["cancelled"]</code></pre></div>
<p>区别：<code>navigate_tree</code> 只在当前 session 内部跳历史节点；<code>runtime.fork()</code> 是把当前 session 分叉到一个新 session 文件。</p>
'''
        },
    ],
}


def render_official_patches(group, code):
    """按 (group, code) 取出补丁，渲染成统一段落。"""
    # Python 版有自己的字典（Python 代码示例 + Python 专有 API 名）
    if group == 'py':
        store = OFFICIAL_PATCHES_PY
    else:
        store = OFFICIAL_PATCHES
    items = store.get((group, code), [])
    if not items:
        return ''
    blocks = []
    for it in items:
        blocks.append(
            f'<div class="note" style="border-left-color:var(--accent);background:color-mix(in srgb, var(--accent) 6%, transparent);">'
            f'<p style="margin:0 0 8px;font-weight:600;color:var(--accent);font-size:13px;">🛡️ 官方权威补丁 · {html.escape(it["title"])}</p>'
            f'<div class="note-body" style="font-size:13px;line-height:1.7;color:var(--muted);">'
            f'{it["html"]}'
            f'</div></div>'
        )
    return '\n'.join(blocks)
    return None

# ============================================================
# 6. 渲染单个章节页
# ============================================================
def render_chapter_page(meta, md_text, title_for_meta):
    body_html = md_to_html(md_text)

    # 上一/下一章链接
    prev_link = ''
    next_link = ''
    if meta['prev_idx']:
        pf = FILE_OF[(meta['group'], meta['prev_idx'])]
        prev_meta = chapter_meta(meta['group'], meta['prev_idx'])
        prev_link = f'<a href="{pf}"><span style="color:var(--muted);font-size:11px">上一章 · </span>{prev_meta["no"]} {prev_meta["short"]}</a>'
    if meta['next_idx']:
        nf = FILE_OF[(meta['group'], meta['next_idx'])]
        next_meta = chapter_meta(meta['group'], meta['next_idx'])
        next_link = f'<a href="{nf}" class="next"><span style="color:var(--muted);font-size:11px">下一章 · </span>{next_meta["no"]} {next_meta["short"]} →</a>'

    # 双版本链接
    version_link = ''
    sib = siblings(meta['group'], meta['idx'] if 'idx' in meta else None)
    # 注：上面 metadata 没传 idx，简化处理
    sib = siblings(meta['group'], meta.get('n', 1))

    # 侧栏：同组章节列表
    sidebar = render_sidebar(meta)

    # 标题里出现的 # 第N章 已经在 markdown 第一行；这里用 meta 渲染面包屑
    group_label = {'prac': '🚀 实战上手篇', 'ts': '🔬 源码精读篇 · TypeScript 版',
                   'py': '🔬 源码精读篇 · Python 版'}[meta['group']]

    # TS ↔ Python 互链
    cross_link = ''
    if meta['group'] in ('ts', 'py'):
        other = 'py' if meta['group'] == 'ts' else 'ts'
        other_file = FILE_OF[(other, int(meta['code'][1:]))]
        other_label = '看 Python 版 →' if meta['group'] == 'ts' else '← 看 TS 版'
        cross_link = f'<a href="{other_file}" class="btn-nav">{other_label}</a>'

    # meta 头
    head_meta = build_head_meta(title_for_meta, meta, group_label)

    html_str = f'''<!-- Generated by Trae Work · Source: github.com/buchidonggua/dg-ai-notes · License: CC-BY-SA-4.0 -->
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
{head_meta}
<title>{html.escape(title_for_meta)} · pi-agent 教程</title>
<script>
/* 主题初始化：在渲染前执行，避免闪白 */
(function () {{
    try {{
        var t = localStorage.getItem('pi-theme');
        if (t === 'dark' || t === 'light') {{
            document.documentElement.setAttribute('data-theme', t);
        }}
    }} catch (e) {{ }}
}})();
</script>
<link rel="stylesheet" href="./{SHARED}/css/github-dark.min.css" id="hljs-dark">
<link rel="stylesheet" href="./{SHARED}/css/github-light.min.css" id="hljs-light" disabled>
<style>{CHAPTER_CSS}</style>
</head>
<body>

<nav class="nav">
    <div class="nav-inner">
        <a href="./index.html" class="nav-brand">
            <span class="dot">π</span>
            pi-agent 教程
        </a>
        <div class="nav-spacer"></div>
        <a href="./index.html#series-prac" class="btn-nav">实战篇</a>
        <a href="./index.html#series-ts" class="btn-nav">源码·TS</a>
        <a href="./index.html#series-py" class="btn-nav">源码·Python</a>
        {cross_link}
        <button class="icon-btn" id="themeBtn" aria-label="切换主题">◐</button>
    </div>
</nav>

<div class="layout">
    <aside class="sidebar">{sidebar}</aside>
    <main>
        <article>
            <header class="chapter-cover">
                <div class="crumb">
                    <a href="./index.html">pi-agent 教程</a> · <a href="./index.html#series-{meta['group']}">{group_label}</a>
                </div>
                <span class="tag">{meta['code']} · {group_label.split(' · ')[-1].replace('版','')}</span>
                <h1>{html.escape(title_for_meta)}</h1>
                <div class="meta">
                    <span>📚 章节号 · {meta['no']}</span>
                    <span>🧭 主题 · {short_label(meta)}</span>
                </div>
            </header>
            {body_html}
            {render_official_patches(meta['group'], meta['code'])}
            <nav class="chapter-nav">
                {prev_link}
                {next_link}
            </nav>
        </article>
    </main>
</div>

<footer style="text-align:center;padding:30px 20px;color:var(--muted);font-size:12px;border-top:1px solid var(--border);">
    <p>本文源自 <a href="https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent" target="_blank" rel="noopener noreferrer">buchidonggua/dg-ai-notes</a>，采用 <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC-BY-SA-4.0</a> 协议分发。</p>
    <p style="margin-top:6px;">教程站生成器只做版式转换，所有内容版权归属原作者。</p>
</footer>

<script src="./{SHARED}/js/highlight.min.js"></script>
<script src="./{SHARED}/js/typescript.min.js"></script>
<script src="./{SHARED}/js/python.min.js"></script>
<script src="./{SHARED}/js/javascript.min.js"></script>
<script src="./{SHARED}/js/bash.min.js"></script>
<script src="./{SHARED}/js/json.min.js"></script>
<script src="./{SHARED}/js/xml.min.js"></script>
<script src="./{SHARED}/js/markdown.min.js"></script>
<script>
(function () {{
    // 主题切换
    var themeBtn = document.getElementById('themeBtn');
    var darkCss = document.getElementById('hljs-dark');
    var lightCss = document.getElementById('hljs-light');
    function sync() {{
        var dark = document.documentElement.getAttribute('data-theme') !== 'light';
        themeBtn.textContent = dark ? '◐' : '☼';
        if (darkCss) darkCss.disabled = !dark;
        if (lightCss) lightCss.disabled = dark;
    }}
    sync();
    themeBtn.addEventListener('click', function () {{
        var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try {{ localStorage.setItem('pi-theme', next); }} catch (e) {{ }}
        sync();
    }});

    // 移动端折叠侧栏
    var sb = document.querySelector('aside.sidebar');
    var mob = document.createElement('button');
    mob.className = 'mobile-toggle';
    mob.textContent = '☰';
    mob.setAttribute('aria-label', '目录');
    mob.addEventListener('click', function () {{ sb.classList.toggle('collapsed'); }});
    sb.parentNode.insertBefore(mob, sb);
    if (window.matchMedia('(max-width: 880px)').matches) sb.classList.add('collapsed');

    // 代码高亮
    if (window.hljs) {{ hljs.highlightAll(); }}

    // 一键复制
    document.querySelectorAll('.copy-btn').forEach(function (btn) {{
        btn.addEventListener('click', function () {{
            var code = btn.parentNode.querySelector('code');
            var txt = code.textContent;
            var done = function (ok) {{
                var old = btn.textContent;
                btn.textContent = ok ? '已复制' : '失败';
                btn.classList.add('ok');
                setTimeout(function () {{ btn.textContent = old; btn.classList.remove('ok'); }}, 1500);
            }};
            /* 复制：clipboard API 优先，失败/受限场景降级到 execCommand。
               此前版本 reject 后直接返回 false，没走降级，在 file:// 与受沙箱的页面会失效。 */
            var fallback = function () {{
                var ta = document.createElement('textarea');
                ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                document.body.appendChild(ta); ta.select();
                try {{ document.execCommand('copy'); done(true); }} catch (e) {{ done(false); }}
                ta.remove();
            }};
            if (navigator.clipboard && navigator.clipboard.writeText) {{
                navigator.clipboard.writeText(txt).then(function () {{ done(true); }},
                    function () {{ fallback(); }});
            }} else {{
                fallback();
            }}
        }});
    }});

    // 高亮当前侧栏条目
    var here = location.pathname.split('/').pop();
    document.querySelectorAll('aside.sidebar a').forEach(function (a) {{
        var href = a.getAttribute('href') || '';
        if (href === here) a.classList.add('active');
    }});
}})();
</script>
</body>
</html>
'''
    return html_str

def short_label(meta):
    return f"{meta['short']} · {meta['sub']}"

def render_sidebar(meta):
    """生成侧栏：固定为本组全部章节 + 当前章节高亮。"""
    if meta['group'] == 'prac':
        items = PRACTICE
    else:
        items = SOURCE_TS
    items_html = []
    for i, (code, no, short, sub) in enumerate(items, 1):
        href = FILE_OF[(meta['group'], i)]
        items_html.append(f'<li><a href="{href}"><span class="num">{code}</span> {html.escape(short)}</a></li>')
    title = {'prac': '🚀 实战上手篇', 'ts': '🔬 源码·TypeScript', 'py': '🔬 源码·Python'}[meta['group']]
    return f'<h4>{title}</h4><ul>\n' + '\n'.join(items_html) + '\n</ul>'

def build_head_meta(title, meta, group_label):
    desc = f"pi-agent 教程 · {meta['no']} {meta['short']} · {meta['sub']}"
    canonical = f"https://tools.yy24365.com/apps/pi-agent/{meta['code']}.html"
    if meta['group'] == 'py':
        canonical = canonical.replace('.html', '-py.html')
    return f'''    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#4f46e5" />
    <link rel="icon" type="image/png" href="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <link rel="apple-touch-icon" href="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <meta name="description" content="{html.escape(desc)}。基于 dg-ai-notes 开源教程整理，配套可运行代码与 TypeScript/Python 双版本。" />
    <meta name="keywords" content="pi-agent,pi,AI Agent,LLM,{html.escape(meta['short'])},{html.escape(meta['sub'])}" />
    <meta itemprop="name" content="{html.escape(title)} · pi-agent 教程">
    <meta itemprop="description" content="{html.escape(desc)}">
    <meta itemprop="image" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="pi-agent 教程">
    <meta property="og:title" content="{html.escape(title)} · pi-agent 教程">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <meta property="og:image:secure_url" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="{html.escape(title)}">
    <meta property="og:description" content="{html.escape(desc)}">
    <meta property="og:locale" content="zh_CN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{html.escape(title)} · pi-agent 教程">
    <meta name="twitter:description" content="{html.escape(desc)}">
    <meta name="twitter:image" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <link rel="canonical" href="{canonical}">'''

# ============================================================
# 7. 入口：实战篇
# ============================================================
def build_prac_pages():
    for i, (code, no, short, sub) in enumerate(PRACTICE, 1):
        md_path = PAGES / 'docs_prac'
        # 找对应源文件
        files = list(md_path.glob(f'第{i}章-*.md'))
        if not files:
            print(f'✗ 实战篇第{i}章源文件未找到')
            continue
        md_text = files[0].read_text(encoding='utf-8')
        meta = chapter_meta('prac', i)
        meta['idx'] = i
        meta['n'] = i
        title = f"{no}：{short} —— {sub}"
        html_text = render_chapter_page(meta, md_text, title)
        (ROOT / f'{code}.html').write_text(html_text, encoding='utf-8')
        print(f'✓ {code}.html')

# ============================================================
# 8. 入口：源码篇（TS 与 Python 并行）
# ============================================================
def build_source_pages():
    for i, (code, no, short, sub) in enumerate(SOURCE_TS, 1):
        for lang, suffix, group in [('ts', '', 'ts'), ('py', '-py', 'py')]:
            md_path = PAGES / f'docs_src_{lang}'
            files = list(md_path.glob(f'第{i}章-*.md'))
            if not files:
                print(f'✗ 源码篇{lang}第{i}章源文件未找到')
                continue
            md_text = files[0].read_text(encoding='utf-8')
            meta = chapter_meta(group, i)
            meta['idx'] = i
            meta['n'] = i
            title = f"{no}：{short} —— {sub}"
            html_text = render_chapter_page(meta, md_text, title)
            out_file = ROOT / f'{code}{suffix}.html'
            out_file.write_text(html_text, encoding='utf-8')
            print(f'✓ {out_file.name}')

# ============================================================
# 9. 入口：index.html 主页
# ============================================================
def build_index():
    pages = []
    for code, no, short, sub in PRACTICE:
        pages.append((f'{code}.html', f'{no}：{short}', sub, '实战篇'))
    for code, no, short, sub in SOURCE_TS:
        pages.append((f'{code}.html', f'{no}：{short}', sub, '源码·TS'))
        pages.append((f'{code}-py.html', f'{no}：{short}', sub, '源码·Python'))

    sections = [
        ('series-prac', '🚀 实战上手篇 · 7 章', '从零搭一个能上线的垂直 Agent',
         [(f'P{i:02d}.html', f'第{i}章', PRACTICE[i - 1][2], PRACTICE[i - 1][3]) for i in range(1, 8)]),
        ('series-ts', '🔬 源码精读篇 · TypeScript · 10 章', '看懂 pi-agent 的核心实现',
         [(f'M{i:02d}.html', f'第{i}章', SOURCE_TS[i - 1][2], SOURCE_TS[i - 1][3]) for i in range(1, 11)]),
        ('series-py', '🔬 源码精读篇 · Python · 10 章', '同一内容，Python 对照版',
         [(f'M{i:02d}-py.html', f'第{i}章', SOURCE_PY[i - 1][2], SOURCE_PY[i - 1][3]) for i in range(1, 11)]),
    ]

    sections_html = []
    for anchor, title, desc, items in sections:
        cards_html = ''
        for href, badge, t, s, d in [(item[0], f'第{i+1}章', item[2], item[1], item[3])
                                    for i, item in enumerate(items)]:
            cards_html += (f'<a href="{html.escape(href)}" class="card">'
                           f'<span class="badge">{html.escape(badge)}</span>'
                           f'<h3>{html.escape(t)}</h3>'
                           f'<p>{html.escape(s)}</p>'
                           f'<span class="sub">{html.escape(d)}</span>'
                           f'</a>')
        sections_html.append(
            f'<section id="{anchor}"><h2>{html.escape(title)}</h2>'
            f'<p class="lead">{html.escape(desc)}</p><div class="grid">{cards_html}</div></section>'
        )
    sections_block = '\n'.join(sections_html)

    css = """
:root { color-scheme: dark;
    --bg: #0b1020; --bg2: #11172c; --surface: #1a2138; --border: #2c3656;
    --text: #e6e9f5; --muted: #9aa3c4; --accent: #818cf8; --accent2: #c084fc;
}
html[data-theme="light"] { color-scheme: light;
    --bg: #f8fafc; --bg2: #ffffff; --surface: #ffffff; --border: #e2e8f0;
    --text: #0f172a; --muted: #475569; --accent: #4f46e5; --accent2: #7c3aed;
}
* { box-sizing: border-box; }
html { -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei",
    "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text);
    font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.nav { position: sticky; top: 0; z-index: 50;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
.nav-inner { max-width: 1100px; margin: 0 auto; height: 56px;
    padding: 0 20px; display: flex; align-items: center; gap: 14px; }
.nav-brand { display: inline-flex; align-items: center; gap: 8px;
    font-weight: 600; color: var(--text); }
.nav-brand .dot { width: 26px; height: 26px; border-radius: 7px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: grid; place-items: center; color: #fff; font-size: 12px; font-weight: 700; }
.nav-spacer { flex: 1; }
.nav a.btn-nav { padding: 6px 12px; border-radius: 8px; font-size: 13px; color: var(--muted); }
.nav a.btn-nav:hover { background: var(--surface); color: var(--text); text-decoration: none; }
.nav button.icon-btn { width: 32px; height: 32px; border-radius: 8px;
    background: var(--surface); border: 1px solid var(--border); color: var(--text);
    cursor: pointer; display: grid; place-items: center; font-size: 14px; }
.nav button.icon-btn:hover { transform: rotate(15deg); }

main { max-width: 1100px; margin: 0 auto; padding: 40px 20px 80px; }

.hero { margin: 30px 0 50px; padding: 32px 28px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent),
        color-mix(in srgb, var(--accent2) 12%, transparent));
    border: 1px solid var(--border); border-radius: 18px;
    position: relative; overflow: hidden; }
.hero h1 { font-size: 30px; margin: 0 0 8px; letter-spacing: -.01em; }
.hero p { color: var(--muted); margin: 0; font-size: 15px; max-width: 740px; }
.hero .stats { display: flex; gap: 28px; margin-top: 22px; flex-wrap: wrap; }
.hero .stat { display: flex; flex-direction: column; gap: 2px; }
.hero .stat strong { font-size: 22px; color: var(--accent); font-weight: 700; }
.hero .stat span { font-size: 11px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }

section { margin: 40px 0; scroll-margin-top: 80px; }
section h2 { font-size: 22px; margin: 0 0 6px; }
section .lead { color: var(--muted); margin: 0 0 18px; }

.grid { display: grid; gap: 14px;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.card { background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 18px 18px 16px; color: var(--text);
    transition: all .25s ease; display: block; position: relative; }
.card:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none;
    box-shadow: 0 10px 30px -16px rgba(99, 102, 241, .5); }
.card .badge { display: inline-block; padding: 2px 9px; border-radius: 999px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff; font-size: 11px; font-weight: 600; margin-bottom: 10px; }
.card h3 { margin: 0 0 4px; font-size: 15px; font-weight: 600; }
.card p { margin: 0 0 8px; font-size: 13px; color: var(--muted); line-height: 1.55; }
.card .sub { font-size: 11px; color: var(--accent2); }

footer { text-align: center; padding: 40px 20px;
    color: var(--muted); font-size: 12px; border-top: 1px solid var(--border); margin-top: 60px; }

@media (max-width: 720px) { .hero { padding: 22px 18px; } .hero h1 { font-size: 22px; } }
"""

    # 重写 sections_html（更干净的写法）
    sections_html = []
    for anchor, title, desc, items in sections:
        cards = ''
        for href, badge, t, s, d in [(item[0], rf'第{i+1}章', item[2], item[1], item[3])
                                    for i, item in enumerate(items)]:
            cards += (f'<a href="{href}" class="card">'
                      f'<span class="badge">{badge}</span>'
                      f'<h3>{html.escape(t)}</h3>'
                      f'<p>{html.escape(s)}</p>'
                      f'<span class="sub">{html.escape(d)}</span>'
                      f'</a>')
        sections_html.append(
            f'<section id="{anchor}"><h2>{html.escape(title)}</h2>'
            f'<p class="lead">{html.escape(desc)}</p><div class="grid">{cards}</div></section>'
        )
    sections_block = '\n'.join(sections_html)

    total_pages = len(PRACTICE) + len(SOURCE_TS) * 2
    today = datetime.date.today().strftime('%Y-%m-%d')
    html_str = f'''<!-- Generated by Trae Work · Source: github.com/buchidonggua/dg-ai-notes · License: CC-BY-SA-4.0 -->
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#4f46e5" />
    <link rel="icon" type="image/png" href="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <link rel="apple-touch-icon" href="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <title>pi-agent 教程 · 27 章完整导读 | 实战 + 源码精读（TS &amp; Python）</title>
    <meta name="description" content="pi-agent 完整教程合集：7 章实战上手 + 10 章 TypeScript 源码精读 + 10 章 Python 源码精读，共 27 个独立页面，支持代码高亮、一键复制与暗/亮主题切换。" />
    <meta name="keywords" content="pi-agent,pi,AI Agent,LLM,Agent Loop,源码,教程,TypeScript,Python,工具箱" />
    <meta itemprop="name" content="pi-agent 教程 · 27 章完整导读">
    <meta itemprop="description" content="pi-agent 完整教程合集：7 章实战 + 10 章 TS 源码 + 10 章 Python 源码，共 27 个独立页面。">
    <meta itemprop="image" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="pi-agent 教程">
    <meta property="og:title" content="pi-agent 教程 · 27 章完整导读">
    <meta property="og:url" content="https://tools.yy24365.com/apps/pi-agent/index.html">
    <meta property="og:image" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <meta property="og:image:secure_url" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="300">
    <meta property="og:image:height" content="300">
    <meta property="og:image:alt" content="pi-agent 教程">
    <meta property="og:description" content="pi-agent 完整教程合集：7 章实战 + 10 章 TS 源码 + 10 章 Python 源码，共 27 个独立页面。">
    <meta property="og:locale" content="zh_CN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="pi-agent 教程 · 27 章完整导读">
    <meta name="twitter:description" content="27 章完整导读：实战 + TS 源码 + Python 源码。">
    <meta name="twitter:image" content="https://tools.yy24365.com/assets/images/dev-tools-og.png">
    <link rel="canonical" href="https://tools.yy24365.com/apps/pi-agent/index.html">
    <script>
    (function () {{
        try {{
            var t = localStorage.getItem('pi-theme');
            if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
        }} catch (e) {{ }}
    }})();
    </script>
    <style>{css}</style>
</head>
<body>

<nav class="nav">
    <div class="nav-inner">
        <a href="./index.html" class="nav-brand">
            <span class="dot">π</span>
            pi-agent 教程
        </a>
        <div class="nav-spacer"></div>
        <a href="#series-prac" class="btn-nav">实战篇</a>
        <a href="#series-ts" class="btn-nav">源码·TS</a>
        <a href="#series-py" class="btn-nav">源码·Python</a>
        <a href="https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent" class="btn-nav" target="_blank" rel="noopener noreferrer">原仓库 ↗</a>
        <button class="icon-btn" id="themeBtn" aria-label="切换主题">◐</button>
    </div>
</nav>

<main>
    <section class="hero">
        <h1>pi-agent 完整教程</h1>
        <p>从「搭一个能上线的 Agent」到「看懂 SDK 怎么造」——两条互补的路线，全部内容整理自 <a href="https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent" target="_blank" rel="noopener noreferrer">buchidonggua/dg-ai-notes</a> 开源教程（CC-BY-SA-4.0）。</p>
        <div class="stats">
            <div class="stat"><strong>{len(PRACTICE)}</strong><span>实战章</span></div>
            <div class="stat"><strong>{len(SOURCE_TS)}</strong><span>TS 源码章</span></div>
            <div class="stat"><strong>{len(SOURCE_PY)}</strong><span>Python 章</span></div>
            <div class="stat"><strong>{total_pages}</strong><span>独立页面</span></div>
        </div>
    </section>

    {sections_block}

</main>

<footer>
    <p>本文档基于 <a href="https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent" target="_blank" rel="noopener noreferrer">buchidonggua/dg-ai-notes</a> 开源教程整理 · 文档协议 <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC-BY-SA-4.0</a></p>
    <p style="margin-top:6px;">最近更新 · {today}</p>
</footer>

<script>
document.getElementById('themeBtn').addEventListener('click', function () {{
    var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {{ localStorage.setItem('pi-theme', next); }} catch (e) {{ }}
    this.textContent = next === 'light' ? '☼' : '◐';
}});
</script>
</body>
</html>
'''
    (ROOT / 'index.html').write_text(html_str, encoding='utf-8')
    print('✓ index.html')

# ============================================================
# main
# ============================================================
if __name__ == '__main__':
    build_index()
    build_prac_pages()
    build_source_pages()