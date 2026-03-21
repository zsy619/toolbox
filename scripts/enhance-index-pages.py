#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
索引页面增强工具
完善引导页,增加缺少的页面,使用页面实际title作为显示标题
"""

import os
import sys
import re
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

def extract_page_title(file_path):
    """从HTML文件中提取title标签的内容"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            # 提取<title>标签内容
            match = re.search(r'<title>(.*?)</title>', content, re.DOTALL | re.IGNORECASE)
            if match:
                title = match.group(1).strip()
                # 移除HTML实体和多余空格
                title = re.sub(r'&nbsp;', ' ', title)
                title = re.sub(r'\s+', ' ', title)
                return title[:50]  # 限制长度
    except Exception as e:
        print(f"  ⚠️  读取 {file_path} 失败: {e}")
    
    # 如果无法提取,返回文件名
    return file_path.stem

def get_file_description(file_path):
    """根据文件名和内容生成简短描述"""
    filename = file_path.name
    
    # 文件名映射到中文描述
    descriptions = {
        'double_ball': '双色球智能选号工具',
        'happy8': '快乐8号码生成器',
        'dlt_smart': '大乐透AI选号器',
        '3d_smart': '3D彩票智能选号',
        'pl3_smart': '排列3智能选号',
        'pl5_smart': '排列5智能选号',
        'qlc_smart': '七乐彩智能选号',
        'ai_calendar': 'AI日历生成器',
        'ai_course': 'AI课程生成器',
        'ai_dream': 'AI梦境分析',
        'ai_scene': 'AI场景生成器',
        'ai_scene_chart': 'AI场景图表分析',
        'ai_scene_search': 'AI场景搜索',
        'bzg': '不知不知',
        'live240': 'Live240演示',
        'live240an_li': 'Live240案例分析',
        'live240ti_shi_ci': 'Live240诗词演示',
        'sdh77': 'SDH77演示',
        'geotiff': 'GeoTIFF 3D可视化',
        'idphoto': '证件照采集系统',
        'photo_separation': '图片分割工具(行列)',
        'image_merge': '图片拼图工具',
        'layui_image_merge': 'LayUI拼图工具',
        'layui_image_merge_optimized': '优化版拼图工具',
        'image_splitter': '图片分割工具(布局)',
        'image_edit': '图片编辑器',
        'hls': 'HLS视频播放器',
        'ws_stream': 'WebSocket流媒体',
        'ws_websocket': 'WebSocket测试',
        'compound_interest_calculator': '复利计算器',
        'money': '金额转换工具',
        'random_generator': '随机字符生成器',
        'schedule': '班次管理系统',
        'uuid': 'UUID生成器',
        'no-sequence': '连续数字生成器',
        'grid-layout': '网格布局演示',
        'test-wechat-share': '微信分享测试',
        'temp_og_image': '临时OG图片',
        'verify-meta-tags': 'Meta标签验证',
    }
    
    # 从文件名提取
    name_key = filename.replace('.html', '').replace('.htm', '')
    if name_key in descriptions:
        return descriptions[name_key]
    
    # 默认描述
    return f"{file_path.suffix[1:].upper()}文件"

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
    icons = {
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
    return icons.get(ext, 'fa-file')

def get_file_color(filename):
    """获取文件颜色"""
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    colors = {
        'html': 'color: #3498db;',
        'htm': 'color: #3498db;',
        'js': 'color: #f39c12;',
        'css': 'color: #9b59b6;',
        'md': 'color: #27ae60;',
    }
    return colors.get(ext, 'color: #7f8c8d;')

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
        return '../assets'
    else:
        return '../' * (depth + 1) + 'assets'

def get_back_path(current_dir):
    """获取返回上级路径"""
    depth = get_depth(current_dir, APPS_DIR)
    if depth == 0:
        return '../index.html'
    elif depth == 1:
        return '../index.html'
    else:
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
        # 提取页面标题
        page_title = extract_page_title(f)
        file_desc = get_file_description(f)
        icon = get_file_icon(f.name)
        size = get_file_size(f.stat().st_size)
        color = get_file_color(f.name)
        
        files_html += f'''
        <a href="{quote(f.name)}" class="item-card file-card" title="{file_desc}">
            <div class="item-icon">
                <i class="fas {icon}" style="{color}"></i>
            </div>
            <div class="item-info">
                <div class="item-name" title="{page_title}">{page_title}</div>
                <div class="item-meta">{file_desc} • {size}</div>
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
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
            height: 80px;
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
            display: flex;
            flex-direction: column;
            justify-content: center;
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
    print("  索引页面增强工具")
    print("=" * 60)
    print(f"\n项目根目录: {PROJECT_ROOT}")
    print(f"目标目录: {APPS_DIR}")
    print(f"\n功能特性:")
    print("  • 提取页面实际title作为显示标题")
    print("  • 添加文件描述信息")
    print("  • 优化卡片布局和样式")
    print("  • 增强用户体验\n")
    
    if not APPS_DIR.exists():
        print(f"❌ 错误: 目录不存在 {APPS_DIR}")
        sys.exit(1)
    
    print("开始增强索引页面...\n")
    
    # 递归生成索引页面
    count = generate_index_recursive(APPS_DIR, 0)
    
    print("\n" + "=" * 60)
    print("  增强完成!")
    print("=" * 60)
    print(f"\n已处理目录: {count} 个\n")
    
    print("✨ 改进内容:")
    print("  ✓ 标题使用页面实际<title>内容")
    print("  ✓ 添加文件描述信息")
    print("  ✓ 优化卡片大小和间距")
    print("  ✓ 增强hover效果")
    print("  ✓ 改进响应式布局\n")

if __name__ == "__main__":
    main()
