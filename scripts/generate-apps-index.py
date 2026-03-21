#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
目录索引页面生成器 (精简版 - 仅为apps目录生成)
自动为apps目录及子目录生成index.html导航页面
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from urllib.parse import quote

# 配置
PROJECT_ROOT = Path(__file__).parent.parent
APPS_DIR = PROJECT_ROOT / "apps"

# 排除的目录
EXCLUDE_DIRS = {
    '.git', '.vscode', 'node_modules', '__pycache__', 
    'games', 'archive', '.idea'
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
}

# 文件类型颜色映射
FILE_COLORS = {
    'html': 'color: #3498db;',
    'htm': 'color: #3498db;',
    'js': 'color: #f39c12;',
    'css': 'color: #9b59b6;',
    'md': 'color: #27ae60;',
    'default': 'color: #7f8c8d;'
}

def get_file_size(size):
    """转换文件大小为人类可读格式"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} TB"

def get_file_icon(filename):
    """获取文件图标"""
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    return FILE_ICONS.get(ext, 'fa-file')

def get_file_color(filename):
    """获取文件颜色"""
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    return FILE_COLORS.get(ext, FILE_COLORS['default'])

def get_depth(dir_path, root_dir):
    """计算目录深度"""
    try:
        rel_path = dir_path.relative_to(root_dir)
        return len(rel_path.parts)
    except:
        return 0

def get_assets_path(current_dir):
    """计算资源路径"""
    depth = get_depth(current_dir, APPS_DIR)
    if depth == 0:
        # apps/ 根目录
        return '../assets'
    else:
        # apps/lottery/ 或更深层
        return '../' * (depth + 1) + 'assets'

def get_back_path(current_dir):
    """获取返回上级路径"""
    depth = get_depth(current_dir, APPS_DIR)
    if depth == 0:
        # apps/ 根目录返回项目根目录
        return '../index.html'
    elif depth == 1:
        # apps/lottery/ 返回 apps/
        return '../index.html'
    else:
        # 更深层目录
        return '../index.html'

def generate_index_html(dir_path):
    """生成单个目录的index.html"""
    
    # 读取目录内容
    dirs = []
    files = []
    
    for item in dir_path.iterdir():
        if item.name.startswith('.'):
            continue
        if item.name in EXCLUDE_DIRS:
            continue
        if item.suffix in [ext[1:] for ext in EXCLUDE_FILES]:
            continue
            
        if item.is_dir():
            dirs.append(item)
        elif item.is_file():
            # 跳过已生成的index.html
            if item.name.lower() != 'index.html':
                files.append(item)
    
    # 排序
    dirs.sort(key=lambda x: x.name.lower())
    files.sort(key=lambda x: x.name.lower())
    
    # 计算路径
    assets_path = get_assets_path(dir_path)
    dir_name = dir_path.name
    
    # 面包屑导航
    depth = get_depth(dir_path, APPS_DIR)
    breadcrumbs = []
    if depth == 0:
        breadcrumbs.append('<a href="../index.html" class="breadcrumb-item">🏠 首页</a>')
        breadcrumbs.append('<span class="breadcrumb-item active">apps</span>')
    else:
        breadcrumbs.append('<a href="../index.html" class="breadcrumb-item">🏠 首页</a>')
        breadcrumbs.append('<a href="../index.html" class="breadcrumb-item">apps</a>')
        rel_path = dir_path.relative_to(APPS_DIR)
        for part in rel_path.parts:
            breadcrumbs.append(f'<span class="breadcrumb-item active">{part}</span>')
    
    breadcrumb_html = ' / '.join(breadcrumbs)
    
    # 生成目录列表HTML
    dirs_html = ''
    for d in dirs:
        dirs_html += f'''
        <div class="item-card dir-card" onclick="location.href='{d.name}/index.html'">
            <div class="item-icon">
                <i class="fas fa-folder" style="color: #f39c12;"></i>
            </div>
            <div class="item-info">
                <div class="item-name">{d.name}</div>
                <div class="item-meta">目录</div>
            </div>
            <div class="item-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
        '''
    
    # 生成文件列表HTML
    files_html = ''
    for f in files:
        icon = get_file_icon(f.name)
        size = get_file_size(f.stat().st_size)
        color = get_file_color(f.name)
        
        files_html += f'''
        <a href="{quote(f.name)}" class="item-card file-card">
            <div class="item-icon">
                <i class="fas {icon}" style="{color}"></i>
            </div>
            <div class="item-info">
                <div class="item-name">{f.name}</div>
                <div class="item-meta">{size}</div>
            </div>
            <div class="item-arrow">
                <i class="fas fa-external-link-alt"></i>
            </div>
        </a>
        '''
    
    # 生成HTML内容
    html_content = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{dir_name} - 目录索引</title>
    <link rel="stylesheet" href="{assets_path}/css/layui.min.css">
    <link rel="stylesheet" href="{assets_path}/css/fontawesome.min.css">
    <style>
        :root {{
            --primary: #3498db;
            --primary-light: #5dade2;
            --secondary: #2ecc71;
            --accent: #27ae60;
            --warning: #f39c12;
            --danger: #e74c3c;
            --text-primary: #2c3e50;
            --text-secondary: #7f8c8d;
            --bg-light: #f8f9fa;
            --card-bg: #ffffff;
            --border: #e0e0e0;
            --shadow: 0 2px 8px rgba(0,0,0,0.08);
            --shadow-hover: 0 4px 16px rgba(0,0,0,0.12);
            --radius: 8px;
            --transition: all 0.3s ease;
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        .header {{
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: var(--shadow);
        }}
        
        .header h1 {{
            font-size: 2rem;
            color: var(--text-primary);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
        }}
        
        .header h1 i {{
            color: var(--primary);
        }}
        
        .breadcrumbs {{
            color: var(--text-secondary);
            font-size: 0.95rem;
            padding-top: 10px;
            border-top: 1px solid var(--border);
        }}
        
        .breadcrumb-item {{
            display: inline-block;
        }}
        
        .breadcrumb-item a {{
            color: var(--primary);
            text-decoration: none;
        }}
        
        .breadcrumb-item a:hover {{
            text-decoration: underline;
        }}
        
        .breadcrumb-item.active {{
            color: var(--text-secondary);
        }}
        
        .section {{
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: var(--shadow);
        }}
        
        .section-title {{
            font-size: 1.3rem;
            color: var(--text-primary);
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        
        .section-title i {{
            color: var(--primary);
        }}
        
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }}
        
        .item-card {{
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            transition: var(--transition);
            text-decoration: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }}
        
        .item-card:hover {{
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover);
            border-color: var(--primary);
        }}
        
        .dir-card {{
            background: linear-gradient(135deg, #fff5e6 0%, #ffffff 100%);
        }}
        
        .file-card {{
            background: var(--card-bg);
        }}
        
        .item-icon {{
            font-size: 2rem;
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        
        .item-info {{
            flex: 1;
            min-width: 0;
        }}
        
        .item-name {{
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }}
        
        .item-meta {{
            font-size: 0.85rem;
            color: var(--text-secondary);
        }}
        
        .item-arrow {{
            color: var(--text-secondary);
            flex-shrink: 0;
        }}
        
        .empty-state {{
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        }}
        
        .empty-state i {{
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.3;
        }}
        
        .empty-state h3 {{
            font-size: 1.5rem;
            margin-bottom: 10px;
        }}
        
        .stats {{
            display: flex;
            gap: 20px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }}
        
        .stat-item {{
            flex: 1;
            text-align: center;
        }}
        
        .stat-value {{
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary);
        }}
        
        .stat-label {{
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 4px;
        }}
        
        .footer {{
            text-align: center;
            padding: 30px;
            color: rgba(255, 255, 255, 0.9);
        }}
        
        .footer a {{
            color: white;
            text-decoration: none;
        }}
        
        @media (max-width: 768px) {{
            .grid {{
                grid-template-columns: 1fr;
            }}
            
            .header h1 {{
                font-size: 1.5rem;
            }}
            
            .stats {{
                flex-direction: column;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-folder-open"></i> {dir_name}</h1>
            <div class="breadcrumbs">{breadcrumb_html}</div>
        </div>
        
        {f'<div class="section"><div class="section-title"><i class="fas fa-folder"></i> 子目录 ({len(dirs)})</div><div class="grid">{dirs_html}</div></div>' if dirs else ''}
        
        {f'<div class="section"><div class="section-title"><i class="fas fa-file-alt"></i> 文件 ({len(files)})</div><div class="grid">{files_html}</div></div>' if files else ''}
        
        {f'<div class="section"><div class="empty-state"><i class="fas fa-inbox"></i><h3>此目录为空</h3><p>没有找到任何文件或子目录</p></div></div>' if not dirs and not files else ''}
        
        <div class="footer">
            <p><a href="{get_back_path(dir_path)}">⬆️ 返回上级</a></p>
        </div>
    </div>
</body>
</html>'''
    
    # 写入文件
    index_file = dir_path / "index.html"
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return len(dirs) + len(files)

def generate_index_recursive(dir_path, count=0):
    """递归生成索引页面"""
    
    # 跳过排除的目录
    if dir_path.name in EXCLUDE_DIRS:
        return count
    
    print(f"  生成: {dir_path.relative_to(PROJECT_ROOT)}/index.html")
    
    # 生成当前目录的索引
    total_items = generate_index_html(dir_path)
    count += 1
    
    # 递归处理子目录
    for item in dir_path.iterdir():
        if item.is_dir() and not item.name.startswith('.'):
            if item.name not in EXCLUDE_DIRS:
                count = generate_index_recursive(item, count)
    
    return count

def main():
    print("=" * 60)
    print("  Apps目录索引页面生成器")
    print("=" * 60)
    print(f"\n项目根目录: {PROJECT_ROOT}")
    print(f"目标目录: {APPS_DIR}")
    print(f"排除目录: {', '.join(EXCLUDE_DIRS)}\n")
    
    if not APPS_DIR.exists():
        print(f"❌ 错误: 目录不存在 {APPS_DIR}")
        sys.exit(1)
    
    print("开始生成索引页面...\n")
    
    # 递归生成索引页面
    count = generate_index_recursive(APPS_DIR, 0)
    
    print("\n" + "=" * 60)
    print("  生成完成!")
    print("=" * 60)
    print(f"\n已生成索引页面: {count} 个目录\n")
    
    print("可以访问以下页面:")
    print(f"  📁 http://localhost/工具箱/apps/index.html")
    print(f"  📁 http://localhost/工具箱/apps/lottery/index.html")
    print(f"  📁 http://localhost/工具箱/apps/utilities/index.html")
    print("  ...\n")

if __name__ == "__main__":
    main()
