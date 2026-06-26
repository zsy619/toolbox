#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML 页面优化脚本 - 统一头部、英雄区、导航样式
"""
import re
import os
import sys

DIR_PATH = '/Volumes/E/JYW/创意项目/工具箱/apps/reading'
TEMPLATE_PATH = os.path.join(DIR_PATH, 'cong-youxiu-dao-juewu.html')
BASE_URL = 'https://tools.yy24365.com/apps/reading'
SITE_NAME = '工具箱'
SKIP_FILES = {'index.html', 'print_height.html', 'get_height.html'}

KEYWORD_THEMES = [
    (['ai', '人工智', '机器', '算法', '数据', '科技', '未来', '量子', '宇宙', '物理', '科学', '三体'], 'cyber-teal-purple.css'),
    (['商业', '管理', '经济', '金融', '投资', '创业', '营销', '品牌', '组织', '战略', '卓越', '执行', '原则', '基业长青', '从优秀到卓越', '竞争', '创新者的窘境', '穷查理', '财富'], 'blue-green-orange.css'),
    (['心理', '思维', '认知', '大脑', '行为', '情绪', '习惯', '影响力', '决策', '学习', '记忆', '思考快与慢', '心流', '自控'], 'blue-purple-pink.css'),
    (['哲学', '人生', '智慧', '意义', '存在', '叔本华', '尼采', '苏格拉底', '沉思', '活着', '平凡的世界', '人生海海'], 'deep-blue.css'),
    (['历史', '三国', '史记', '孙子', '论语', '孟子', '老子', '庄子', '中国', '文化', '毛泽东', '鲁迅', '万历', '枢纽', '春秋'], 'red-amber-olive.css'),
    (['小说', '文学', '百年孤独', '围城', '红楼梦', '水浒传', '三国演义', '白鹿原', '骆驼祥子', '兄弟'], 'neon.css'),
    (['传', '传记', '富兰克林', '达芬奇', '爱因斯坦', '乔布斯', '马斯克', '林肯', '毛泽东传', '苏东坡'], 'amber-cyan-blue.css'),
    (['习惯', '效率', '时间', '自律', '成长', '精进', '刻意练习', '学习之道', '原子习惯', '微习惯', '高效能', '番茄'], 'green-blue-teal.css'),
    (['健康', '医学', '身体', '基因', '超越百岁', '众病之王', '癌症', '跑步', '运动'], 'emerald-teal-blue.css'),
    (['设计', '艺术', '美学', '建筑', '音乐', '美术', '设计心理学', '简约'], 'soft-purple-pink.css'),
    (['社会', '政治', '人类', '人类学', '社会学', '公正', '正义', '社会学的想象力', '乡土中国'], 'muted-navy-olive.css'),
    (['法律', '法治', '论法的精神', '契约', '权利'], 'deep-blue.css'),
    (['爱情', '恋爱', '婚姻', '关系', '亲密', '傲慢与偏见', '简爱', '霍乱时期的爱情'], 'pink-rose-amber.css'),
    (['战争', '军事', '博弈', '孙子兵法', '战略', '兵法', '朝鲜战争'], 'red-amber-olive.css'),
    (['极简', '断舍离', '收纳', '整理', '少即是多'], 'muted-navy-olive.css'),
    (['沟通', '表达', '演讲', '非暴力沟通', '说话', '说服', '谈判'], 'blue-purple-pink.css'),
    (['禅', '冥想', '正念', '佛教', '心经', '金刚经', '佛陀传', '内观', '禅宗'], 'soft-purple-pink.css'),
    (['幸福', '快乐', '积极', '心流', '塞利格曼', '乐观'], 'amber-blue-pink.css'),
    (['教育', '学习', '学校', '教师', '学生', '多元智能'], 'green-blue-teal.css'),
    (['财富', '理财', '投资', '股票', '基金', '金钱', '巴菲特', '富爸爸', '穷查理', '金融'], 'blue-green-orange.css'),
    (['创意', '写作', '故事', '剧本', '小说创作', '赖声川', '创意学'], 'soft-purple-pink.css'),
]


def get_theme_for_book(cn, en, fname):
    search = f"{cn} {en} {fname}"
    for keywords, theme in KEYWORD_THEMES:
        for kw in keywords:
            if kw.lower() in search.lower():
                return theme
    return 'blue-green-orange.css'


def get_theme_colors(theme_file):
    colors = {
        'bg_gradient': 'linear-gradient(135deg, #0C1B2A 0%, #0E3A2E 50%, #3A1F0A 100%)',
        'text_main': '#E2E8F0',
        'text_muted': 'rgba(226, 232, 240, 0.6)',
        'text_gradient': 'linear-gradient(135deg, #3B82F6 0%, #10B981 50%, #F59E0B 100%)',
        'progress_gradient': 'linear-gradient(90deg, #3B82F6, #10B981, #F59E0B)',
        'primary_color': '#3B82F6',
        'accent_color': '#10B981',
        'accent_gradient': 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
        'accent_shadow': 'rgba(5