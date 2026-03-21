#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
游戏验证脚本
检查所有处理过的游戏是否正常工作
"""
import os
import sys
from pathlib import Path

def check_game_structure(game_path):
    """检查游戏文件结构"""
    game_name = os.path.basename(game_path)
    
    # 检查必要文件
    index_file = os.path.join(game_path, 'index.html')
    backup_file = os.path.join(game_path, 'index.html.backup')
    
    if not os.path.exists(index_file):
        return f"❌ {game_name}: index.html 文件不存在"
    
    if not os.path.exists(backup_file):
        return f"⚠️  {game_name}: 备份文件不存在"
    
    # 检查HTML文件内容
    try:
        with open(index_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        return f"❌ {game_name}: 无法读取HTML文件 - {e}"
    
    # 检查是否还有内联CSS/JS
    has_inline_css = '<style' in html_content
    has_inline_js = '<script>' in html_content or '<script ' in html_content.replace('<script src=', '')
    
    if has_inline_css:
        return f"⚠️  {game_name}: 仍有内联CSS未分离"
    
    if has_inline_js:
        return f"⚠️  {game_name}: 仍有内联JS未分离"
    
    # 检查外部引用
    has_css_link = 'href="css/style.css"' in html_content
    has_js_script = 'src="js/game.js"' in html_content
    
    # 检查目录结构
    css_dir = os.path.join(game_path, 'css')
    js_dir = os.path.join(game_path, 'js')
    css_file = os.path.join(css_dir, 'style.css')
    js_file = os.path.join(js_dir, 'game.js')
    
    issues = []
    
    if has_css_link:
        if not os.path.exists(css_file):
            issues.append("CSS文件引用但文件不存在")
        elif os.path.getsize(css_file) == 0:
            issues.append("CSS文件为空")
    
    if has_js_script:
        if not os.path.exists(js_file):
            issues.append("JS文件引用但文件不存在")
        elif os.path.getsize(js_file) == 0:
            issues.append("JS文件为空")
    
    if issues:
        return f"❌ {game_name}: {', '.join(issues)}"
    
    # 统计文件大小
    css_size = os.path.getsize(css_file) if os.path.exists(css_file) else 0
    js_size = os.path.getsize(js_file) if os.path.exists(js_file) else 0
    
    return f"✅ {game_name}: CSS({css_size//1024}KB) JS({js_size//1024}KB)"

def main():
    """主函数"""
    if len(sys.argv) != 2:
        print("用法: python game_validator.py <games目录路径>")
        sys.exit(1)
    
    games_dir = sys.argv[1]
    if not os.path.exists(games_dir):
        print(f"❌ 目录不存在: {games_dir}")
        sys.exit(1)
    
    # 需要验证的游戏列表
    games_to_check = [
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
    
    print(f"🔍 开始验证游戏文件结构")
    print(f"📁 游戏目录: {games_dir}")
    print(f"📊 验证 {len(games_to_check)} 个游戏")
    print("=" * 60)
    
    success_count = 0
    warning_count = 0
    error_count = 0
    
    for game_name in games_to_check:
        game_path = os.path.join(games_dir, game_name)
        
        if not os.path.exists(game_path):
            print(f"❌ {game_name}: 目录不存在")
            error_count += 1
            continue
        
        result = check_game_structure(game_path)
        print(result)
        
        if result.startswith('✅'):
            success_count += 1
        elif result.startswith('⚠️'):
            warning_count += 1
        else:
            error_count += 1
    
    print("=" * 60)
    print(f"📈 验证完成!")
    print(f"✅ 正常: {success_count}")
    print(f"⚠️  警告: {warning_count}")
    print(f"❌ 错误: {error_count}")
    print(f"📊 总计: {len(games_to_check)}")
    
    if error_count == 0 and warning_count == 0:
        print("\n🎉 所有游戏均已成功处理！")
    elif error_count == 0:
        print(f"\n👍 处理基本成功，有 {warning_count} 个小问题需要注意")
    else:
        print(f"\n⚠️  有 {error_count} 个游戏存在问题，需要检查")

if __name__ == '__main__':
    main()