#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
目录索引页面生成器 (Python版本)
自动为所有子目录生成index.html导航页面

特性:
1. 自动适应任意深度的目录结构
2. 动态生成相对路径引用
3. 保持页面样式和功能的一致性
4. 正确处理特殊字符和空格的文件名
5. 提供清晰的目录导航界面
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from urllib.parse import quote

# 配置
PROJECT_ROOT = Path(__file__).parent.parent
ROOT_DIR = PROJECT_ROOT

# 排除的目录
EXCLUDE_DIRS = {
    '.git', '.vscode', 'node_modules', '__pycache__',
    'archive', '.idea'
}

# 排除的文件
EXCLUDE_FILES = {
    '.DS_Store', '.gitignore', '*.swp', '*.swo', '*.bak', '*.tmp'
}

# 文件类型图标映射
FILE_ICONS = {
    'html': 'fa-file-code',
    'htm': 'fa-file-code',
    'js': 'fa-file-code',
    'css': 'fa-file-code',
    'json': 'fa-file-code',
    'md': 'fa-file-alt',
    'txt': 'fa-file-alt',
    'pdf': 'fa-file-pdf',
    'zip': 'fa-file-archive',
    'png': 'fa-file-image',
    'jpg': 'fa-file-image',
    'jpeg': 'fa-file-image',
    'gif': 'fa-file-image',
    'svg': 'fa-file-image',
    'mp4': 'fa-file-video',
    'mp3': 'fa-file-audio',
    'sh': 'fa-terminal',
    'py': 'fa-file-code',
}

# 文件颜色映射
FILE_COLORS = {
    'html': 'blue',
    'htm': 'blue',
    'js': 'yellow',
    'css': 'purple',
    'json': 'orange',
    'md': 'green',
    'txt': 'gray',
    'pdf': 'red',
    'zip': 'gray',
    'png': 'pink',
    'jpg': 'pink',
    'jpeg': 'pink',
    'gif': 'pink',
    'svg': 'pink',
    'mp4': 'red',
    'mp3': 'cyan',
    'sh': 'green',
    'py': 'yellow',
}


def is_excluded_dir(dir_name):
    """检查目录是否在排除列表中"""
    return dir_name in EXCLUDE_DIRS


def is_excluded_file(file_name):
    """检查文件是否在排除列表中"""
    return file_name in EXCLUDE_FILES


def calculate_asset_depth(current_dir):
    """计算资源引用深度"""
    depth = 0
    while current_dir != ROOT_DIR:
        current_dir = current_dir.parent
        depth += 1

    # 生成相对路径
    relative_path = '../' * depth
    return relative_path.rstrip('/')


def get_file_size(file_path):
    """获取文件大小"""
    try:
        size = os.path.getsize(file_path)
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    except:
        return "未知"


def generate_index_html(dir_path):
    """生成目录索引HTML"""

    dir_name = dir_path.name
    asset_depth = calculate_asset_depth(dir_path)

    # 构建资源路径
    base_path = f"{asset_depth}/" if asset_depth else ""
    css_path = f"{base_path}assets/css/layui.min.css"
    font_path = f"{base_path}assets/css/fontawesome.min.css"
    js_path = f"{base_path}assets/js/layui.min.js"
    style_path = f"{base_path}assets/css/style.css"

    # 收集目录和文件
    dirs = []
    files = []

    for item in dir_path.iterdir():
        if item.name.startswith('.'):
            continue

        if item.is_dir():
            if not is_excluded_dir(item.name):
                dirs.append(item)
        else:
            if not is_excluded_file(item.name):
                files.append(item)

    # 排序
    dirs.sort(key=lambda x: x.name.lower())
    files.sort(key=lambda x: x.name.lower())

    # 生成HTML
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{dir_name} 目录索引">
    <title>目录索引 - {dir_name}</title>
    <link rel="icon" type="image/png" href="{base_path}assets/images/dev-tools-og.png">
    <link rel="stylesheet" href="{css_path}">
    <link rel="stylesheet" href="{font_path}">
    <link rel="stylesheet" href="{style_path}">
    <style>
        .index-container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }}

        .index-header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}

        .index-header h1 {{
            margin: 0;
            font-size: 28px;
        }}

        .index-header .breadcrumb {{
            margin-top: 10px;
            font-size: 14px;
            opacity: 0.9;
        }}

        .breadcrumb a {{
            color: white;
            text-decoration: none;
        }}

        .breadcrumb a:hover {{
            text-decoration: underline;
        }}

        .section-title {{
            font-size: 18px;
            font-weight: bold;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
            display: flex;
            align-items: center;
            gap: 10px;
        }}

        .item-list {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }}

        .item-card {{
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: inherit;
        }}

        .item-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-color: #667eea;
        }}

        .item-icon {{
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }}

        .item-info {{
            flex: 1;
            min-width: 0;
        }}

        .item-name {{
            font-weight: 500;
            font-size: 15px;
            margin-bottom: 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }}

        .item-meta {{
            font-size: 12px;
            color: #999;
        }}

        .back-link {{
            display: inline-block;
            margin-bottom: 20px;
            padding: 8px 16px;
            background: #f5f5f5;
            border-radius: 5px;
            text-decoration: none;
            color: #333;
            font-size: 14px;
        }}

        .back-link:hover {{
            background: #e0e0e0;
        }}

        .dir-card .item-icon {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }}

        .file-blue .item-icon {{ background: #3498db; color: white; }}
        .file-yellow .item-icon {{ background: #f39c12; color: white; }}
        .file-purple .item-icon {{ background: #9b59b6; color: white; }}
        .file-orange .item-icon {{ background: #e67e22; color: white; }}
        .file-green .item-icon {{ background: #2ecc71; color: white; }}
        .file-gray .item-icon {{ background: #95a5a6; color: white; }}
        .file-red .item-icon {{ background: #e74c3c; color: white; }}
        .file-pink .item-icon {{ background: #e91e63; color: white; }}
        .file-cyan .item-icon {{ background: #00bcd4; color: white; }}

        @media (max-width: 768px) {{
            .item-list {{
                grid-template-columns: 1fr;
            }}

            .index-header h1 {{
                font-size: 22px;
            }}
        }}

        .search-box {{
            margin-bottom: 20px;
        }}

        .search-box input {{
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        }}

        .search-box input:focus {{
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }}
    </style>
</head>
<body>
    <div class="index-container">
        <div class="index-header">
            <h1><i class="fas fa-folder-open"></i> {dir_name}</h1>
            <div class="breadcrumb">
                <i class="fas fa-home"></i> <a href="{base_path}">首页</a>
            </div>
        </div>

        <div class="search-box">
            <input type="text" placeholder="🔍 搜索文件和目录..." id="searchInput">
        </div>
"""

    # 返回上级链接
    if dir_path != ROOT_DIR:
        html += f"""
        <a href="../" class="back-link"><i class="fas fa-arrow-left"></i> 返回上级目录</a>
"""

    # 子目录部分
    html += """
        <div class="section">
            <div class="section-title">
                <i class="fas fa-folder" style="color: #667eea;"></i>
                <span>子目录</span>
            </div>
            <div class="item-list" id="dirList">
"""

    if dirs:
        for dir_item in dirs:
            dir_name = dir_item.name
            html += f"""
                <a href="{dir_name}/" class="item-card dir-card">
                    <div class="item-icon">
                        <i class="fas fa-folder"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-name">{dir_name}</div>
                        <div class="item-meta">目录</div>
                    </div>
                </a>
"""
    else:
        html += """
                <p style="color: #999; padding: 20px;">暂无子目录</p>
"""

    html += """
            </div>
        </div>
"""

    # 文件部分
    html += """
        <div class="section">
            <div class="section-title">
                <i class="fas fa-file" style="color: #667eea;"></i>
                <span>文件</span>
            </div>
            <div class="item-list" id="fileList">
"""

    if files:
        for file_item in files:
            file_name = file_item.name
            ext = file_name.split('.')[-1].lower() if '.' in file_name else ''
            icon = FILE_ICONS.get(ext, 'fa-file')
            color = FILE_COLORS.get(ext, 'gray')
            size = get_file_size(file_item)

            html += f"""
                <a href="{quote(file_name)}" class="item-card file-{color}">
                    <div class="item-icon">
                        <i class="fas {icon}"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-name">{file_name}</div>
                        <div class="item-meta">{size}</div>
                    </div>
                </a>
"""
    else:
        html += """
                <p style="color: #999; padding: 20px;">暂无文件</p>
"""

    html += f"""
            </div>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 13px;">
            <p>自动生成的目录索引页面</p>
            <p>最后更新: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
    </div>

    <script src="{js_path}"></script>
    <script>
        layui.use(['element'], function() {{
            // 搜索功能
            document.getElementById('searchInput').addEventListener('input', function() {{
                const searchTerm = this.value.toLowerCase();
                const cards = document.querySelectorAll('.item-card');

                cards.forEach(card => {{
                    const name = card.querySelector('.item-name').textContent.toLowerCase();
                    if (name.includes(searchTerm)) {{
                        card.style.display = 'flex';
                    }} else {{
                        card.style.display = 'none';
                    }}
                }});
            }});
        }});
    </script>
</body>
</html>
"""

    return html


def generate_index_recursive(dir_path, count=0):
    """递归生成索引页面"""

    # 跳过根目录
    if dir_path == ROOT_DIR:
        return count

    # 跳过排除目录
    if is_excluded_dir(dir_path.name):
        return count

    print(f"正在处理: {dir_path}")

    # 生成索引页面
    html_content = generate_index_html(dir_path)
    index_file = dir_path / 'index.html'

    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    count += 1

    # 递归处理子目录
    for item in dir_path.iterdir():
        if item.is_dir():
            count = generate_index_recursive(item, count)

    return count


def main():
    """主函数"""
    print("=" * 50)
    print("  目录索引页面生成器 (Python版)")
    print("=" * 50)
    print(f"\n项目根目录: {ROOT_DIR}\n")

    # 确认执行
    confirm = input("是否继续生成索引页面? (y/n): ")
    if confirm.lower() != 'y':
        print("已取消")
        sys.exit(0)

    print("\n开始生成索引页面...\n")

    # 递归生成索引页面
    count = 0
    for item in ROOT_DIR.iterdir():
        if item.is_dir():
            count = generate_index_recursive(item, count)

    print("\n" + "=" * 50)
    print("  生成完成!")
    print("=" * 50)
    print(f"\n已处理的目录数: {count}\n")

    print("查看生成的索引页面:")
    print(f"  - {ROOT_DIR / 'apps'}")
    print(f"  - {ROOT_DIR / 'docs'}")
    print(f"  - {ROOT_DIR / 'scripts'}")
    print("  - ...\n")


if __name__ == '__main__':
    main()
