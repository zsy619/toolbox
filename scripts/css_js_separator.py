#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSS/JS分离工具
自动从HTML文件中提取CSS和JS代码，并创建外部文件
"""
import os
import re
import sys
from pathlib import Path

def extract_css_from_html(html_content):
    """从HTML中提取CSS代码"""
    css_pattern = r'<style[^>]*>(.*?)</style>'
    matches = re.findall(css_pattern, html_content, re.DOTALL | re.IGNORECASE)
    return '\n\n'.join(matches).strip()

def extract_js_from_html(html_content):
    """从HTML中提取JavaScript代码"""
    js_pattern = r'<script[^>]*>(.*?)</script>'
    matches = re.findall(js_pattern, html_content, re.DOTALL | re.IGNORECASE)
    # 过滤掉外部引用的script标签
    js_code = []
    for match in matches:
        if match.strip() and not match.strip().startswith('src='):
            js_code.append(match)
    return '\n\n'.join(js_code).strip()

def remove_inline_css(html_content):
    """移除HTML中的内联CSS"""
    return re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

def remove_inline_js(html_content):
    """移除HTML中的内联JavaScript"""
    return re.sub(r'<script[^>]*>(?!.*src=).*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

def add_external_links(html_content, has_css=True, has_js=True):
    """添加外部CSS和JS引用"""
    # 在</head>前添加CSS链接
    if has_css:
        css_link = '    <link rel="stylesheet" href="css/style.css">\n</head>'
        html_content = html_content.replace('</head>', css_link)
    
    # 在</body>前添加JS引用
    if has_js:
        js_link = '    <script src="js/game.js"></script>\n</body>'
        html_content = html_content.replace('</body>', js_link)
    
    return html_content

def process_game(game_path):
    """处理单个游戏目录"""
    game_name = os.path.basename(game_path)
    index_file = os.path.join(game_path, 'index.html')
    
    if not os.path.exists(index_file):
        print(f"❌ {game_name}: index.html 不存在")
        return False
    
    print(f"🔄 处理 {game_name}...")
    
    # 读取HTML文件
    try:
        with open(index_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        print(f"❌ {game_name}: 读取HTML文件失败 - {e}")
        return False
    
    # 提取CSS和JS
    css_code = extract_css_from_html(html_content)
    js_code = extract_js_from_html(html_content)
    
    has_css = bool(css_code.strip())
    has_js = bool(js_code.strip())
    
    if not has_css and not has_js:
        print(f"⚪ {game_name}: 无需处理，已经是外部引用")
        return True
    
    # 创建目录
    if has_css:
        css_dir = os.path.join(game_path, 'css')
        os.makedirs(css_dir, exist_ok=True)
        
        css_file = os.path.join(css_dir, 'style.css')
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(css_code)
        print(f"  ✅ CSS分离完成: css/style.css")
    
    if has_js:
        js_dir = os.path.join(game_path, 'js')
        os.makedirs(js_dir, exist_ok=True)
        
        js_file = os.path.join(js_dir, 'game.js')
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(js_code)
        print(f"  ✅ JS分离完成: js/game.js")
    
    # 更新HTML文件
    updated_html = html_content
    if has_css:
        updated_html = remove_inline_css(updated_html)
    if has_js:
        updated_html = remove_inline_js(updated_html)
    
    updated_html = add_external_links(updated_html, has_css, has_js)
    
    # 备份原文件
    backup_file = index_file + '.backup'
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # 写入更新的HTML
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(updated_html)
    
    print(f"  ✅ HTML更新完成")
    print(f"  💾 原文件备份: {os.path.basename(backup_file)}")
    
    return True

def main():
    """主函数"""
    if len(sys.argv) != 2:
        print("用法: python css_js_separator.py <games目录路径>")
        sys.exit(1)
    
    games_dir = sys.argv[1]
    if not os.path.exists(games_dir):
        print(f"❌ 目录不存在: {games_dir}")
        sys.exit(1)
    
    # 需要处理的游戏列表
    games_to_process = [
        'animal-chess', 'army-chess', 'badminton', 'balloon-pop', 'basketball-game',
        'battleship', 'beat-creator', 'beat-master', 'billiards', 'bomberman',
        'bowling', 'calculator', 'chinese-chess', 'civilization', 'code-editor',
        'coding-game', 'farm-game', 'flight-chess', 'flip-cards', 'go-puzzle',
        'golf-game', 'history-quiz', 'jigsaw-puzzle', 'laser-dodge', 'magic-8-ball',
        'mario-mini', 'match-pairs', 'math-challenge', 'monopoly', 'number-klotski',
        'ping-pong', 'pixel-art-editor', 'pvz-mini', 'reaction-test', 'resource-manager',
        'science-lab', 'soccer-game', 'space-shooter', 'speed-typing', 'starcraft-mini',
        'tennis-game', 'three-kingdoms', 'tower-defense', 'werewolf', 'zen-garden',
        'geography-quiz'
    ]
    
    print(f"🚀 开始批量处理CSS/JS分离")
    print(f"📁 游戏目录: {games_dir}")
    print(f"📊 计划处理 {len(games_to_process)} 个游戏")
    print("=" * 50)
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for game_name in games_to_process:
        game_path = os.path.join(games_dir, game_name)
        
        if not os.path.exists(game_path):
            print(f"⚠️  {game_name}: 目录不存在，跳过")
            skip_count += 1
            continue
        
        try:
            if process_game(game_path):
                success_count += 1
            else:
                error_count += 1
        except Exception as e:
            print(f"❌ {game_name}: 处理失败 - {e}")
            error_count += 1
        
        print("-" * 30)
    
    print("=" * 50)
    print(f"📈 处理完成!")
    print(f"✅ 成功: {success_count}")
    print(f"⚠️  跳过: {skip_count}")
    print(f"❌ 失败: {error_count}")
    print(f"📊 总计: {len(games_to_process)}")

if __name__ == '__main__':
    main()