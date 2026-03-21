#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
备份文件清理脚本
删除处理过程中生成的备份文件（可选）
"""
import os
import sys

def main():
    """主函数"""
    if len(sys.argv) != 2:
        print("用法: python cleanup_backups.py <games目录路径>")
        print("警告: 此脚本将删除所有 .backup 文件，请谨慎使用！")
        sys.exit(1)
    
    games_dir = sys.argv[1]
    if not os.path.exists(games_dir):
        print(f"❌ 目录不存在: {games_dir}")
        sys.exit(1)
    
    print("⚠️  警告: 即将删除所有备份文件！")
    print("备份文件可以让你在出现问题时恢复原始文件。")
    response = input("确定要继续吗？(输入 'yes' 确认): ")
    
    if response.lower() != 'yes':
        print("操作已取消")
        sys.exit(0)
    
    backup_count = 0
    
    # 遍历所有游戏目录
    for game_name in os.listdir(games_dir):
        game_path = os.path.join(games_dir, game_name)
        if not os.path.isdir(game_path):
            continue
        
        backup_file = os.path.join(game_path, 'index.html.backup')
        if os.path.exists(backup_file):
            try:
                os.remove(backup_file)
                print(f"✅ 已删除: {game_name}/index.html.backup")
                backup_count += 1
            except Exception as e:
                print(f"❌ 删除失败: {game_name}/index.html.backup - {e}")
    
    print(f"\n🧹 清理完成! 总共删除了 {backup_count} 个备份文件")

if __name__ == '__main__':
    main()