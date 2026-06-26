#!/usr/bin/env python3
"""
Convert jiesuan.md to HTML with proper Chinese font support,
then use browser to print as PDF
"""

input_file = '/Volumes/E/JYW/创意项目/工具箱/apps/program/jiesuan.md'
output_file = '/Volumes/E/JYW/创意项目/工具箱/apps/program/jiesuan_proper.html'

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

import re
from html import escape

lines = content.split('\n')
html_parts = []

# Header with proper Chinese fonts
html_parts.append('''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>灵活用工结算平台完整研发方案</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Heiti SC', sans-serif;
    font-size: 12pt;
    line-height: 1.8;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 30px;
    background: #fff;
}

h1 {
    font-size: 24pt;
    text-align: center;
    margin-bottom: 10px;
    color: #1a1a1a;
    font-weight: 700;
}

.version-info {
    text-align: center;
    color: #666;
    font-size: 10pt;
    margin-bottom: 30px;
}

h2 {
    font-size: 16pt;
    margin-top: 30px;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 2px solid #3B82F6;
    color: #1a1a1a;
    font-weight: 700;
    page-break-before: always;
}

h3 {
    font-size: 13pt;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #333;
    font-weight: 700;
}

p { margin-bottom: 10px; text-align: justify; }

ul, ol {
    margin-left: 20px;
    margin-bottom: 12px;
}

li { margin-bottom: 6px; }

table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 10pt;
    page-break-inside: avoid;
}

th, td {
    border: 1px solid #ccc;
    padding: 8px 10px;
    text-align: left;
}

th {
    background: #f0f0f0;
    font-weight: 700;
}

tr:nth-child(even) { background: #fafafa; }

code {
    background: #f5f5f5;
    padding: 1px 5px;
    border-radius: 3px;
    font-family: 'Menlo', 'Monaco', monospace;
    font-size: 9pt;
}

pre {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 12px 0;
    font-size: 9pt;
    page-break-inside: avoid;
}

pre code { background: none; padding: 0; }

blockquote {
    border-left: 4px solid #3B82F6;
    margin: 12px 0;
    padding-left: 14px;
    color: #666;
    font-style: italic;
}

hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 24px 0;
}

strong { font-weight: 700; color: #1a1a1a; }

a { color: #3B82F6; text-decoration: none; }

.mermaid {
    background: #f9f9f9;
    padding: 10px;
    margin: 12px 0;
    page-break-inside: avoid;
}
</style>
</head>
<body>
''')

# Process markdown
in_code_block = False

for line in lines:
    line = line.rstrip()
    
    if line.startswith('```'):
        in_code_block = not in_code_block
        if in_code_block:
            html_parts.append('<pre><code>')
        else:
            html_parts.append('</code></pre>')
        continue
    
    if in_code_block:
        html_parts.append(escape(line))
        continue
    
    if not line:
        html_parts.append('')
        continue
    
    if line.startswith('# '):
        html_parts.append(f'<h1>{escape(line[2:])}</h1>')
    elif line.startswith('## '):
        html_parts.append(f'<h2>{escape(line[3:])}</h2>')
    elif line.startswith('### '):
        html_parts.append(f'<h3>{escape(line[4:])}</h3>')
    elif line.startswith('- **') or line.startswith('- '):
        text = line[2:]
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
        html_parts.append(f'<li>{text}</li>')
    elif line.startswith('| ') and '|' in line[2:]:
        continue
    elif line.startswith('>'):
        html_parts.append(f'<blockquote>{escape(line[2:])}</blockquote>')
    elif line.startswith('| '):
        # Table - skip markdown syntax
        continue
    else:
        text = line
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
        html_parts.append(f'<p>{text}</p>')

html_parts.append('</body></html>')

output = '\n'.join(html_parts)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(output)

print(f'HTML created: {output_file}')