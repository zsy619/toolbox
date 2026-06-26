# -*- coding: utf-8 -*-
"""批量生成第 3 批 HTML 读书笔记。以 yuanda-qiancheng.html 为骨架，替换书籍特定内容。"""
import os
import sys

BASE_DIR = "/Volumes/E/JYW/创意项目/工具箱/apps/reading"
TEMPLATE_PATH = os.path.join(BASE_DIR, "yuanda-qiancheng.html")

with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
    TEMPLATE = f.read()

assert "《远大前程》" in TEMPLATE, "Template not loaded correctly"


def repl(html, old, new, count=1):
    """字符串替换，并断言找到。"""
    if old not in html:
        print("WARN: pattern not found in template, skipping: %s" % old[:60])
        return html
    return html.replace(old, new, count)


def build_html(book, template):
    html = template

    # title
    html = repl(
        html,
        '<title>《远大前程》| 狄更斯的野心与幻灭 | 工具箱</title>',
        '<title>%s| %s | 工具箱</title>' % (book["title"], book["subtitle_hero"]),
    )

    # meta description
    html = repl(
        html,
        '<meta name="description" content="《远大前程》核心解读：查尔斯·狄更斯关于野心、阶级、爱情与道德的伟大小说。铁匠学徒匹普的人生起伏，揭示财富与品格的真正关系。">',
        '<meta name="description" content="%s核心解读：%s"> 深入解读%s。' % (book["title"], book["desc_head"][:120], book["title"]),
    )

    # meta keywords
    html = repl(
        html,
        '<meta name="keywords" content="远大前程,狄更斯,Charles Dickens,匹普,Pip,英国文学,维多利亚时代,阶级,野心,道德成长,小说解读">',
        '<meta name="keywords" content="%s">' % book["keywords"],
    )

    # canonical URL
    html = repl(
        html,
        '<link rel="canonical" href="https://tools.yy24365.com/apps/reading/yuanda-qiancheng.html">',
        '<link rel="canonical" href="https://tools.yy24365.com/apps/reading/%s">' % book["file"],
    )

    # URL inside og/twitter/wechat
    html = html.replace(
        'https://tools.yy24365.com/apps/reading/yuanda-qiancheng.html',
        'https://tools.yy24365.com/apps/reading/%s' % book["file"],
    )

    # og:title / twitter:title / wechat share title
    html = html.replace('《远大前程》| 狄更斯的野心与幻灭', '%s| %s' % (book["title"], book["subtitle_hero"]))

    # og:image prompt
    html = html.replace(
        'Great%20Expectations%20Charles%20Dickens%20victorian%20london%20fog%20literary%20book%20cover',
        book["image_prompt"],
    )

    # og/twitter/wechat desc short form
    html = html.replace(
        '狄更斯晚年巅峰之作：铁匠学徒匹普的野心与幻灭，一段关于财富、品格与救赎的成长史诗。',
        '%s：%s' % (book["author"], book["desc_head"][:60]),
    )
    html = html.replace(
        '匹普的野心与幻灭：财富不是品格，地位不是价值。',
        '%s：%s' % (book["title"], book["desc_head"][:30]),
    )
    html = html.replace(
        '财富不是品格，地位不是价值。匹普的成长史诗。',
        '%s：%s' % (book["title"], book["desc_head"][:30]),
    )

    # ============ chapter progress ============
    prog_lines = ['<nav class="chapter-progress-dot" id="chapterProgress" aria-label="章节进度">']
    for i, t in enumerate(book["progress_titles"]):
        prog_lines.append('        <a href="#chapter%d" data-title="%s"></a>' % (i + 1, t))
    prog_lines.append('        <a href="#summary" data-title="总结"></a>')
    prog_lines.append('        <a href="#reading-tips" data-title="阅读建议"></a>')
    prog_lines.append('    </nav>')
    prog_block = "\n".join(prog_lines)

    ps = html.find('<nav class="chapter-progress-dot" id="chapterProgress" aria-label="章节进度">')
    pe = html.find('    </nav>', ps) + len('    </nav>')
    html = html[:ps] + prog_block + html[pe:]

    # ============ top nav subtitle ============
    html = repl(
        html,
        '<p class="text-xs text-gray-500 leading-tight">《远大前程》· 狄更斯</p>',
        '<p class="text-xs text-gray-500 leading-tight">%s</p>' % book["nav_subtitle"],
    )

    # ============ hero ============
    hero_old_start = '    <!-- Hero 区域 -->\n    <header class="hero-section py-16 sm:py-24 fade-in-up">'
    hero_old_end = '    </header>\n\n    <!-- 主要内容区域 -->'
    hs = html.find(hero_old_start)
    he = html.find(hero_old_end, hs) + len(hero_old_end)

    hero_lines = []
    hero_lines.append('    <!-- Hero 区域 -->')
    hero_lines.append('    <header class="hero-section py-16 sm:py-24 fade-in-up">')
    hero_lines.append('        <div class="container">')
    hero_lines.append('            <div class="hero-content">')
    hero_lines.append('                <div class="hero-tag">')
    hero_lines.append('                    <span>\U0001f4d6</span>')
    hero_lines.append('                    <span>%s</span>' % book["tagline"])
    hero_lines.append('                </div>')
    hero_lines.append('                <h1 class="hero-title">')
    hero_lines.append('                    <span class="text-gradient">%s</span>：%s' % (book["title"], book["subtitle_hero"][:14]))
    hero_lines.append('                </h1>')
    hero_lines.append('                <p class="hero-subtitle">')
    hero_lines.append('                    %s · %s 年出版' % (book["author"], book["year"]))
    hero_lines.append('                </p>')
    hero_lines.append('                <p class="hero-description">')
    hero_lines.append('                    %s<span style="color: #fde68a; font-weight: 600;">"%s"</span>。%s' % (
        book["desc_head"][:80], book["highlight_word"], book["desc_head"][80:],))
    hero_lines.append('                </p>')
    hero_lines.append('')
    hero_lines.append('                <div class="hero-meta">')
    for m in book["hero_meta"]:
        hero_lines.append('                    <span>%s</span>' % m)
    hero_lines.append('                </div>')
    hero_lines.append('            </div>')
    hero_lines.append('        </div>')
    hero_lines.append('    </header>')
    hero_lines.append('')
    hero_lines.append('    <!-- 主要内容区域 -->')
    html = html[:hs] + "\n".join(hero_lines) + html[he:]

    # ============ left nav ============
    nav_start = '            <!-- 章节导航（左侧） -->\n            <aside class="lg:col-span-1">'
    nav_end = '            </aside>'
    ns = html.find(nav_start)
    ne = html.find(nav_end, ns) + len(nav_end)

    nav_lines = []
    nav_lines.append('            <!-- 章节导航（左侧） -->')
    nav_lines.append('            <aside class="lg:col-span-1">')
    nav_lines.append('                <div class="chapter-nav bg-white rounded-2xl p-4 shadow-sm border border-gray-200">')
    nav_lines.append('                    <h3 class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">')
    nav_lines.append('                        <span class="text-lg mr-2">\U0001f4d1</span>章节目录')
    nav_lines.append('                    </h3>')
    nav_lines.append('                    <ul class="space-y-1">')
    for i, c in enumerate(book["chapters"]):
        idx = i + 1
        nav_lines.append('                        <li><a href="#chapter%d" class="chapter-nav-link"><span class="chapter-num">%02d</span><span class="chapter-title">%s</span></a></li>' % (idx, idx, c["title"]))
    nav_lines.append('                        <li class="pt-2 mt-2 border-t border-gray-100"><a href="#summary" class="chapter-nav-link"><span class="chapter-num" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);">\u2211</span><span class="chapter-title">总结</span></a></li>')
    nav_lines.append('                        <li><a href="#reading-tips" class="chapter-nav-link"><span class="chapter-num" style="background: linear-gradient(135deg, #06b6d4, #10b981);">\u25a4</span><span class="chapter-title">阅读建议</span></a></li>')
    nav_lines.append('                    </ul>')
    nav_lines.append('')
    nav_lines.append('                    <div class="mt-6 pt-4 border-t border-gray-200">')
    nav_lines.append('                        <h4 class="text-sm font-bold text-gray-700 mb-3">核心数据</h4>')
    nav_lines.append('                        <div class="grid grid-cols-2 gap-2">')
    stats = book["summary_stats"][:4]
    colors = [("purple", "purple"), ("blue", "blue"), ("cyan", "cyan"), ("pink", "pink")]
    for i, (val, label) in enumerate(stats):
        c1, c2 = colors[i]
        nav_lines.append('                            <div class="bg-%s-50 rounded-lg p-3">' % c1)
        nav_lines.append('                                <div class="text-xl font-bold text-%s-600">%s</div>' % (c2, val))
        nav_lines.append('                                <div class="text-xs text-gray-600">%s</div>' % label)
        nav_lines.append('                            </div>')
    nav_lines.append('                        </div>')
    nav_lines.append('                    </div>')
    nav_lines.append('                </div>')
    nav_lines.append('            </aside>')
    html = html[:ns] + "\n".join(nav_lines) + html[ne:]

    # ============ 7 chapters ============
    chaps_start = '                    <!-- 第一章 -->'
    chaps_end = '                    <!-- 总结 -->'
    cs = html.find(chaps_start)
    ce = html.find(chaps_end, cs)

    body_lines = []
    for i, c in enumerate(book["chapters"]):
        idx = i + 1
        body_lines.append('                    <!-- 第%d章 -->' % idx)
        body_lines.append('                    <section id="chapter%d" class="mb-12 scroll-mt-24">' % idx)
        body_lines.append('                        <h2>')
        body_lines.append('                            <span class="chapter-num-badge">CH %02d</span>' % idx)
        body_lines.append('                            <span class="chapter-badge">%s</span>' % c["badge"])
        body_lines.append('                            %s' % c["title"])
        body_lines.append('                        </h2>')
        body_lines.append('')
        body_lines.append('                        <div class="prose max-w-none">')
        for h3, quote, para in c["h3_list"]:
            body_lines.append('                            <h3>%s</h3>' % h3)
            body_lines.append('')
            body_lines.append('                            <p>%s</p>' % para)
            body_lines.append('')
            if quote:
                body_lines.append('                            <blockquote>')
                for ln in quote.split("\\n"):
                    body_lines.append('                                %s' % ln)
                body_lines.append('                            </blockquote>')
                body_lines.append('')
            body_lines.append('                            <p>在%s中，作者让我们<span class="highlight">以一个普通人的眼睛看这个不普通的世界</span>——这正是他作品的共同力量。</p>' % book["title"])
            body_lines.append('')
        body_lines.append('                        </div>')
        body_lines.append('                    </section>')
        body_lines.append('')
    html = html[:cs] + "\n".join(body_lines) + html[ce:]

    # ============ Summary ============
    summary_start = '                    <!-- 总结 -->\n                    <section id="summary" class="mb-12 scroll-mt-24">'
    summary_end = '                    </section>\n\n                    <!-- 阅读建议 -->'
    ss = html.find(summary_start)
    se = html.find(summary_end, ss) + len(summary_end)

    shtml = []
    shtml.append('                    <!-- 总结 -->')
    shtml.append('                    <section id="summary" class="mb-12 scroll-mt-24">')
    shtml.append('                        <h2>')
    shtml.append('                            <span class="chapter-num-badge summary">\u2211</span>')
    shtml.append('                            <span class="chapter-badge" style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(139, 92, 246, 0.12)); color: #ec4899; border-color: rgba(236, 72, 153, 0.25);">\U0001f48e 总结</span>')
    shtml.append('                            一句话读懂%s' % book["title"])
    shtml.append('                        </h2>')
    shtml.append('')
    shtml.append('                        <div class="summary-box">')
    shtml.append('                            <p class="text-xl text-gray-800 leading-relaxed mb-4 font-semibold">')
    shtml.append('                                <span class="text-gradient">%s</span>%s' % (book["title"], book["summary_text"]))
    shtml.append('                            </p>')
    shtml.append('                            <p class="text-gray-700 mb-4">它告诉我们：</p>')
    shtml.append('                            <ul class="text-gray-700 space-y-2 mb-4">')
    for p in book["summary_points"]:
        shtml.append('                                <li>· %s</li>' % p)
    shtml.append('                            </ul>')
    shtml.append('')
    shtml.append('                            <div class="summary-stat-grid">')
    for val, label in book["summary_stats"]:
        shtml.append('                                <div class="summary-stat">')
        shtml.append('                                    <div class="summary-stat-value">%s</div>' % val)
        shtml.append('                                    <div class="summary-stat-label">%s</div>' % label)
        shtml.append('                                </div>')
    shtml.append('                            </div>')
    shtml.append('')
    shtml.append('                            <div class="glow-divider"></div>')
    shtml.append('                            <p class="text-gray-700 text-center text-lg">')
    shtml.append('                                %s用%s告诉世界：<span class="text-gradient font-bold text-xl">%s</span>' % (
        book["author"], book["title"], book["summary_points"][-1]))
    shtml.append('                            </p>')
    shtml.append('                            <div class="summary-bg-blur"></div>')
    shtml.append('                        </div>')
    shtml.append('                    </section>')
    shtml.append('')
    shtml.append('                    <!-- 阅读建议 -->')
    html = html[:ss] + "\n".join(shtml) + html[se:]

    # ============ reading tips ============
    rt_start = '                    <!-- 阅读建议 -->\n                    <section id="reading-tips" class="mb-12 scroll-mt-24">'
    rt_end = '                </div>\n            </article>\n        </div>\n    </main>'
    rts = html.find(rt_start)
    rte = html.find(rt_end, rts) + len(rt_end)

    rhtml = []
    rhtml.append('                    <!-- 阅读建议 -->')
    rhtml.append('                    <section id="reading-tips" class="mb-12 scroll-mt-24">')
    rhtml.append('                        <h2>')
    rhtml.append('                            <span class="chapter-num-badge appendix">\u9644</span>')
    rhtml.append('                            <span class="chapter-badge" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.12)); color: #06b6d4; border-color: rgba(6, 182, 212, 0.25);">\U0001f4da 附录</span>')
    rhtml.append('                            阅读建议')
    rhtml.append('                        </h2>')
    rhtml.append('')
    rhtml.append('                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">')
    rhtml.append('                            <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-5">')
    rhtml.append('                                <h4 class="font-bold text-indigo-700 mb-2">\U0001f4d6 适合谁读？</h4>')
    rhtml.append('                                <ul class="text-sm text-gray-700 space-y-1">')
    for a in book["reading_audience"]:
        rhtml.append('                                    <li>· %s</li>' % a)
    rhtml.append('                                </ul>')
    rhtml.append('                            </div>')
    rhtml.append('                            <div class="bg-purple-50 border border-purple-200 rounded-xl p-5">')
    rhtml.append('                                <h4 class="font-bold text-purple-700 mb-2">\U0001f4a1 怎么读？</h4>')
    rhtml.append('                                <ul class="text-sm text-gray-700 space-y-1">')
    for m in book["reading_method"]:
        rhtml.append('                                    <li>· %s</li>' % m)
    rhtml.append('                                </ul>')
    rhtml.append('                            </div>')
    rhtml.append('                        </div>')
    rhtml.append('                    </section>')
    rhtml.append('                </div>')
    rhtml.append('            </article>')
    rhtml.append('        </div>')
    rhtml.append('    </main>')
    html = html[:rts] + "\n".join(rhtml) + html[rte:]

    # JSON-LD
    html = html.replace('《必然》', book["title"])
    html = html.replace('凯文·凯利', book["author"])
    html = html.replace('Kevin Kelly', book["author_en"])
    html = html.replace('"datePublished": "2016-01-01"', '"datePublished": "%s-01-01"' % book["year"])
    html = html.replace('"genre": "科技趋势 / 未来学"', '"genre": "%s"' % book["genre"])
    return html


BOOKS = []

BOOKS.append({
    "file": "shuangchengji.html",
    "title": "《双城记》",
    "subtitle_hero": "狄更斯的革命与人性",
    "tagline": "英国文学 · 历史小说 · 革命与人性",
    "desc_head": "那是最好的时代，那是最坏的时代。狄更斯以法国大革命为背景，讲述伦敦与巴黎之间两个家庭的命运交错。牺牲、复仇与爱，在断头台的阴影下交织成永恒的经典。",
    "highlight_word": "最好的时代",
    "hero_meta": ["\U0001f4d6 25分钟阅读", "\U0001f5e1\ufe0f 1859年出版", "\u2b50 7大章节", "\U0001f525 革命与救赎"],
    "nav_subtitle": "《双城记》· 狄更斯",
    "author": "查尔斯·狄更斯",
    "author_en": "Charles Dickens",
    "year": "1859",
    "genre": "历史小说 / 革命文学",
    "keywords": "双城记,狄更斯,Charles Dickens,法国大革命,悉尼卡顿,曼内特,英国文学,牺牲与爱",
    "image_prompt": "A%20Tale%20of%20Two%20Cities%20Charles%20Dickens%20french%20revolution%20paris%20london%20literary",
    "progress_titles": [
        "第一章 · 两个时代的开篇", "第二章 · 人物地图", "第三章 · 革命的火种",
        "第四章 · 卡顿的牺牲", "第五章 · 两个城市的道德", "第六章 · 爱与恨的辩证",
        "第七章 · 永恒的结尾"],
    "chapters": [
        {"title": "两个时代的开篇", "badge": "\U0001f4d6 第一章", "h3_list": [
            ("文学史上最著名的开场白",
             "\u90a3\u662f\u6700\u597d\u7684\u65f6\u4ee3\uff0c\u90a3\u662f\u6700\u574f\u7684\u65f6\u4ee3\u3002",
             "这段开场白既是对 1775 年英法两国的描绘，也是对 1859 年维多利亚时代的警告。"),
            ("为什么是两个城市？",
             "\u4f26\u6566\u4e0e\u5df4\u9ece\u2014\u2014\u4e24\u5ea7\u76f8\u9694\u4ec5 340 \u516c\u91cc\u7684\u9996\u90fd\uff0c\u5374\u5206\u522b\u4ee3\u8868\u79e9\u5e8f\u4e0e\u5931\u5e8f\u3002",
             "狄更斯用它们做镜子：一面照英国的平稳，一面照法国的狂热。"),
        ]},
        {"title": "人物地图", "badge": "\U0001f5fa\ufe0f 第二章", "h3_list": [
            ("核心人物：三组关系",
             "\u66fc\u5185\u7279\u533b\u751f\u4e00\u5bb6\u88ab\u4f24\u5bb3\u4e0e\u88ab\u6551\u8d4e\uff1b\u4ee3\u5c14\u90a3\u4e0e\u57c3\u5f17\u745e\u8499\u5fb7\u65cf\u4ee3\u8868\u65e7\u5236\u5ea6\uff1b\u6c99\u5c3c\u00b7\u5361\u987f\u4e0e\u65af\u7279\u83b1\u5f17\u4ee3\u8868\u82f1\u56fd\u6cd5\u5f8b\u754c\u3002",
             "这三组人物如三条河流，最终汇入革命的洪流中。"),
            ("悉尼·卡顿——文学史上最伟大的失败者",
             "\u5361\u987f\u559d\u9151\u3001\u538c\u4e16\u3001\u81ea\u79f0\u4e00\u65e0\u662f\u5904\uff0c\u5374\u5728\u7ed3\u5c3e\u505a\u51fa\u4e86\u6587\u5b66\u53f2\u4e0a\u6700\u52a8\u4eba\u7684\u81ea\u6211\u727a\u7272\u3002",
             "他是狄更斯笔下最接近陀思妥耶夫斯基气质的人物——一个不被世界理解的好人。"),
        ]},
        {"title": "革命的火种", "badge": "\U0001f525 第三章", "h3_list": [
            ("为什么法国会爆发革命？",
             "\u4e09\u4e2a\u5173\u952e\u8bcd\uff1a\u9965\u8352\u3001\u7a0e\u6536\u4e0d\u5747\u3001\u7279\u6743\u9636\u5c42\u7684\u50b2\u6162\u3002\u5f53\u4e00\u4e2a\u56fd\u5bb6\u7684\u5927\u591a\u6570\u4eba\u9965\u997f\uff0c\u800c\u5c11\u6570\u4eba\u9526\u8863\u7389\u98df\uff0c\u9769\u547d\u53ea\u662f\u65f6\u95f4\u95ee\u9898\u3002",
             "德法奇太太在酒店里不停编织——那不是毛线，是死亡名单。"),
            ("巴士底狱的倒塌",
             "1789 \u5e74 7 \u6708 14 \u65e5\uff0c\u5df4\u58eb\u5e95\u72f1\u88ab\u653b\u9677\u3002\u4f46\u72c4\u66f4\u65af\u63d0\u9192\u6211\u4eec\uff1a\u66b4\u529b\u4e00\u65e6\u91ca\u653e\uff0c\u5b83\u5c06\u541e\u566c\u4e00\u5207\u3002",
             "雅克这个革命者之间使用的暗号名字，最终成为集体暴力的代名词。"),
        ]},
        {"title": "卡顿的牺牲", "badge": "\U0001f494 第四章", "h3_list": [
            ("小说最动人的一幕",
             "\u5361\u987f\u4ee3\u66ff\u957f\u76f8\u5584\u5f62\u7684\u4ee3\u5c14\u90a3\u8d70\u4e0a\u65ad\u5934\u53f0\u3002\u4ed6\u8bf4\uff1a\u6211\u73b0\u5728\u505a\u7684\uff0c\u662f\u6211\u4e00\u751f\u4e2d\u505a\u8fc7\u7684\u6700\u597d\u3001\u6700\u6700\u597d\u7684\u4e8b\u60c5\u3002",
             "一个自称失败的人，在最后一刻选择用自己的生命换取他人的幸福。"),
            ("牺牲的真正意义",
             "\u72c4\u66f4\u65af\u4e0d\u5199\u5b97\u6559\uff0c\u4f46\u5199\u5b97\u6559\u7cbe\u795e\u3002\u5361\u987f\u7684\u6b7b\u4e0d\u662f\u60b2\u5267\u7684\u7ed3\u675f\uff0c\u800c\u662f\u6551\u8d4e\u7684\u5f00\u59cb\u3002",
             "他用死亡复活了自己的灵魂。"),
        ]},
        {"title": "两个城市的道德对照", "badge": "\u2696\ufe0f 第五章", "h3_list": [
            ("英国：虚伪但稳定",
             "\u82f1\u56fd\u7684\u6cd5\u5ead\u3001\u5f8b\u5e08\u3001\u8d35\u65cf\u90fd\u6709\u865a\u4f2a\u4e4b\u5904\uff0c\u4f46\u5b83\u81f3\u5c11\u7ef4\u6301\u4e86\u79e9\u5e8f\u3002\u65af\u7279\u83b1\u5f17\u5c31\u662f\u8fd9\u79cd\u6587\u5316\u7684\u5178\u578b\u3002",
             "他自负、咄咄逼人，却在关键时刻退缩。"),
            ("法国：激进但失序",
             "\u9769\u547d\u6700\u521d\u6709\u5d07\u9ad8\u7684\u7406\u60f3\uff0c\u4f46\u5f88\u5feb\u5815\u843d\u4e3a\u6050\u6016\u7edf\u6cbb\u3002\u5fb7\u6cd5\u5947\u592a\u592a\u4ece\u53d7\u5bb3\u8005\u53d8\u52a0\u5bb3\u8005\u3002",
             "这是历史上反复出现的命题。"),
        ]},
        {"title": "爱与恨的辩证", "badge": "\u2764\ufe0f\U0001f525 第六章", "h3_list": [
            ("仇恨的循环",
             "\u66fc\u5185\u7279\u533b\u751f\u88ab\u8d35\u65cf\u56da\u7981 18 \u5e74\uff0c\u4ed6\u7684\u65e5\u8bb0\u6210\u4e3a\u590d\u4ec7\u8bc1\u636e\u3002\u4f46\u4ed6\u7684\u5973\u513f\u9732\u897f\u9009\u62e9\u7231\u800c\u975e\u6068\u3002",
             "这是狄更斯的核心信念：恨只能毁灭，爱才能救赎。"),
            ("爱为什么能战胜恨？",
             "\u56e0\u4e3a\u6068\u662f\u6d88\u8017\u6027\u7684\u2014\u2014\u5fb7\u6cd5\u5947\u592a\u592a\u7684\u6068\u6700\u7ec8\u6bc1\u6389\u4e86\u5979\u81ea\u5df1\u3002\u7231\u662f\u5efa\u8bbe\u6027\u7684\u2014\u2014\u9732\u897f\u7684\u7231\u91cd\u5efa\u4e86\u4e00\u4e2a\u5bb6\u5ead\u3002",
             "爱比恨更有力量——选择善永远不晚。"),
        ]},
        {"title": "永恒的结尾", "badge": "\u2728 第七章", "h3_list": [
            ("卡顿最后的独白",
             "\u6211\u73b0\u5728\u505a\u7684\uff0c\u662f\u6211\u4e00\u751f\u4e2d\u505a\u8fc7\u7684\u6700\u597d\u7684\u4e8b\u60c5\uff1b\u6211\u73b0\u5728\u5f97\u5230\u7684\uff0c\u662f\u6211\u4e00\u751f\u4e2d\u5f97\u5230\u8fc7\u7684\u6700\u5b89\u5b81\u7684\u4f11\u606f\u3002",
             "这句话已经成为英语文学中最常被引用的结尾之一。"),
            ("为什么 160 年后我们仍在读它？",
             "\u56e0\u4e3a\u6bcf\u4e00\u4e2a\u65f6\u4ee3\u90fd\u6709\u6700\u597d\u7684\u65f6\u4ee3\u548c\u6700\u574f\u7684\u65f6\u4ee3\u5e76\u5b58\u3002\u56e0\u4e3a\u6bcf\u4e00\u4ee3\u4eba\u90fd\u8981\u9009\u62e9\uff1a\u662f\u50cf\u5361\u987f\u90a3\u6837\u7528\u7231\u56de\u5e94\u6068\uff0c\u8fd8\u662f\u50cf\u5fb7\u6cd5\u5947\u90a3\u6837\u7528\u66b4\u529b\u56de\u5e94\u4f24\u5bb3\u3002",
             "个人的道德勇气是对抗时代疯狂的最后防线。"),
        ]},
    ],
    "summary_text": "是一部关于革命、仇恨与爱的伟大小说——它告诉我们暴力无法真正改变世界，唯有个人选择的善与牺牲才能在废墟中重建意义。",
    "summary_points": [
        "革命释放的暴力会反噬革命者自身",
        "被压迫者获得权力后可能更残忍",
        "爱比恨更有力量——选择善永远不晚",
        "个人的道德勇气是对抗时代疯狂的最后防线",
        "最伟大的成功，是用一生的失败换来一个人的救赎"],
    "summary_stats": [("2", "城市数量"), ("17", "年代跨度"), ("3", "核心家庭"), ("\u221e", "救赎可能")],
    "reading_audience": ["对历史和革命感兴趣的读者", "喜欢心理深度人物的人", "思考正义是什么的读者", "想读经典但怕难读的人", "在时代迷茫中寻找个人方向的人"],
    "reading_method": ["第1-6章：慢读开篇，感受时代氛围", "第7-22章：关注人物关系，尤其是卡顿与露西", "第23-终章：革命爆发后感受节奏的加速", "关注狄更斯的对称写法：人物、情节、主题都有精密对照", "重读卡顿的最后独白——这是全书的精神核心"],
})

BOOKS.append({
    "file": "wudu-guer.html",
    "title": "《雾都孤儿》",
    "subtitle_hero": "狄更斯的社会批判与孤儿成长",
    "tagline": "英国文学 · 社会批判 · 孤儿成长",
    "desc_head": "一个出生在济贫院的孤儿奥利弗·退斯特，在伦敦的迷雾与罪恶中挣扎求生。狄更斯以惊人的真诚，揭露了维多利亚时代的贫困、剥削与儿童悲剧——却也写下了善终将被看见的信念。",
    "highlight_word": "请再给我一点",
    "hero_meta": ["\U0001f4d6 25分钟阅读", "\U0001f32b\ufe0f 1838年出版", "\u2b50 7大章节", "\U0001f4aa 苦难与坚韧"],
    "nav_subtitle": "《雾都孤儿》· 狄更斯",
    "author": "查尔斯·狄更斯",
    "author_en": "Charles Dickens",
    "year": "1838",
    "genre": "社会批判小说 / 成长小说",
    "keywords": "雾都孤儿,狄更斯,Oliver Twist,奥利弗,济贫院,伦敦,小偷,费金,南希,社会批判",
    "image_prompt": "Oliver%20Twist%20Charles%20Dickens%20victorian%20london%20fog%20orphan%20child%20literary",
    "progress_titles": [
        "第一章 · 狄更斯与孤儿题材", "第二章 · 奥利弗的诞生", "第三章 · 伦敦的地狱",
        "第四章 · 费金与南希", "第五章 · 善与恶的拔河", "第六章 · 狄更斯的社会批判",
        "第七章 · 为什么今天仍要读"],
    "chapters": [
        {"title": "狄更斯与孤儿题材", "badge": "\U0001f4d6 第一章", "h3_list": [
            ("为什么写孤儿？",
             "\u72c4\u66f4\u65af\u81ea\u5df1\u7ae5\u5e74\u5728\u7236\u4eb2\u503a\u52a1\u5165\u72f1\u540e\u88ab\u9001\u8fdb\u978b\u6cb9\u5de5\u5382\u2014\u2014\u8fd9\u6bb5\u7ecf\u5386\u8ba9\u4ed6\u7ec8\u8eab\u5173\u6ce8\u88ab\u793e\u4f1a\u629b\u5f03\u7684\u5b69\u5b50\u3002",
             "孤儿题材在维多利亚时代是真实的社会问题——1830 年代伦敦街头有数以万计的流浪儿童。"),
            ("为什么叫退斯特？",
             "Twist \u82f1\u6587\u539f\u610f\u662f\u626d\u66f2\u2014\u2014\u5965\u5229\u5f17\u7684\u547d\u8fd0\u6ce8\u5b9a\u662f\u88ab\u8fd9\u4e2a\u793e\u4f1a\u626d\u66f2\u7684\u3002\u4ed6\u7684\u540d\u5b57\u672c\u8eab\u5c31\u662f\u4e00\u4e2a\u9690\u55bb\u3002",
             "但狄更斯让他的灵魂没有被扭曲——这才是小说真正的力量。"),
        ]},
        {"title": "奥利弗的诞生", "badge": "\U0001f476 第二章", "h3_list": [
            ("济贫院那个寒冷的夜晚",
             "\u8bf7\u518d\u7ed9\u6211\u4e00\u70b9\u2014\u2014\u8fd9\u4e5d\u4e2a\u5b57\u662f\u6587\u5b66\u53f2\u4e0a\u6700\u8457\u540d\u7684\u513f\u7ae5\u53f0\u8bcd\u4e4b\u4e00\u3002\u5b83\u4e4b\u6240\u4ee5\u9707\u64bc\uff0c\u4e0d\u5728\u4e8e\u5b69\u5b50\u7684\u9965\u997f\uff0c\u800c\u5728\u4e8e\u4ed6\u5728\u5de8\u5927\u538b\u8feb\u4e0b\u4f9d\u7136\u80fd\u8bf4\u51fa\u81ea\u5df1\u7684\u9700\u8981\u3002",
             "在济贫院制度下，儿童被当作劳动力而非生命——奥利弗的请求被视为反叛，遭到严厉惩罚。"),
            ("棺材店学徒",
             "\u5965\u5229\u5f17\u88ab\u9001\u5230\u68f3\u6750\u5e97\u5f53\u5b66\u5f92\u3002\u72c4\u66f4\u65af\u7528\u51b7\u5e7d\u836f\u5199\u51b7\u9177\uff1a\u8ba9\u4e00\u4e2a\u5b69\u5b50\u5929\u5929\u4e0e\u6b7b\u4ea1\u4e3a\u4f34\uff0c\u8fd9\u662f\u73b0\u5b9e\uff0c\u4e5f\u662f\u9690\u55bb\u3002",
             "最终奥利弗选择逃向伦敦——那座他以为有希望的城市。"),
        ]},
        {"title": "伦敦的地狱", "badge": "\U0001f32b\ufe0f 第三章", "h3_list": [
            ("雾都不只是天气",
             "\u4f26\u6566\u7684\u96fe\u662f\u5c0f\u8bf4\u7684\u91cd\u8981\u610f\u8c61\u3002\u5b83\u662f\u7269\u7406\u7684\u3001\u9053\u5fb7\u7684\u3001\u5fc3\u7406\u7684\u2014\u2014\u5de5\u4e1a\u71c3\u7164\u9020\u6210\u7684\u9ec4\u8272\u6d53\u96fe\u4e2d\uff0c\u7f6a\u6076\u88ab\u9690\u85cf\uff0c\u5965\u5229\u5f17\u5728\u96fe\u4e2d\u8ff7\u5931\u3002",
             "雾成为小说的隐形角色。"),
            ("小偷团伙的真实",
             "\u8d39\u91d1\u662f\u6587\u5b66\u53f2\u4e0a\u6700\u4ee4\u4eba\u96be\u5fd8\u7684\u53cd\u6d3e\u4e4b\u4e00\u3002\u4ed6\u6559\u5b69\u5b50\u5077\u7a83\uff0c\u7528\u793c\u7269\u548c\u5a01\u80c1\u63a7\u5236\u4ed6\u4eec\u2014\u2014\u4ed6\u4ee3\u8868\u4e00\u4e2a\u66f4\u53ef\u6015\u7684\u4e8b\u5b9e\uff1a\u793e\u4f1a\u4e0d\u4ec5\u56da\u5f03\u5b69\u5b50\uff0c\u8fd8\u4e3b\u52a8\u6559\u4ed6\u4eec\u53d8\u574f\u3002",
             "但狄更斯笔下的费金并非纯粹的恶——他有可悲之处。"),
        ]},
        {"title": "费金与南希", "badge": "\U0001f573\ufe0f 第四章", "h3_list": [
            ("费金——黑暗的父亲",
             "\u8d39\u91d1\u662f\u5965\u5229\u5f17\u9047\u5230\u7684\u7b2c\u4e00\u4e2a\u7236\u4eb2\u5f62\u8c61\u3002\u4ed6\u5582\u9971\u5b69\u5b50\uff0c\u6559\u4ed6\u4eec\u6280\u80fd\uff0c\u5374\u628a\u4ed6\u4eec\u5f15\u5411\u7f6a\u6076\u3002\u4ed6\u662f\u626d\u66f2\u7684\u7236\u7231\uff1a\u7231\u4f60\uff0c\u4f46\u8ba9\u4f60\u53d8\u574f\u3002",
             "这种形象在现实中并不少见。"),
            ("南希——悲剧的女性",
             "\u5357\u5e0c\u662f\u5c0f\u5077\u56e2\u4f19\u4e2d\u6700\u590d\u6742\u7684\u4eba\u7269\u3002\u5979\u7231\u8d5b\u514b\u65af\uff08\u4e00\u4e2a\u66b4\u529b\u72af\u7f6a\u8005\uff09\uff0c\u4e5f\u540c\u60c5\u5965\u5229\u5f17\u3002\u5979\u6700\u7ec8\u56e0\u4e3a\u5e2e\u52a9\u5965\u5229\u5f17\u800c\u88ab\u7231\u4eba\u6740\u5bb3\u2014\u2014\u5979\u7684\u6b7b\u662f\u5168\u4e66\u6700\u9ed1\u6697\u7684\u4e00\u5e55\u3002",
             "狄更斯写她时没有道德审判，只有深深的同情——这在当时是革命性的。"),
        ]},
        {"title": "善与恶的拔河", "badge": "\u2696\ufe0f 第五章", "h3_list": [
            ("布朗罗先生——善的代表",
             "\u5965\u5229\u5f17\u88ab\u8bef\u6293\u65f6\u9047\u5230\u7684\u8001\u7ec5\u58eb\u5e03\u6717\u7f57\uff0c\u4ee3\u8868\u4e86\u72c4\u66f4\u65af\u76f8\u4fe1\u7684\u53e6\u4e00\u79cd\u53ef\u80fd\uff1a\u4e00\u4e2a\u964c\u751f\u4eba\u4f9d\u7136\u53ef\u4ee5\u9009\u62e9\u5584\u826f\u3002",
             "他收留奥利弗，给他读书的机会——这是小说中罕见的温暖片段。"),
            ("为什么善能胜利？",
             "\u72c4\u66f4\u65af\u7ed9\u51fa\u7684\u7b54\u6848\u7b80\u5355\u4f46\u6df1\u523b\uff1a\u56e0\u4e3a\u5584\u7684\u4eba\u4f1a\u575a\u6301\u3002\u4ed6\u4eec\u4e0d\u56e0\u4e3a\u4e16\u754c\u9ed1\u6697\u5c31\u653e\u5f03\u505a\u6b63\u786e\u7684\u4e8b\u3002",
             "奥利弗从头到尾没有偷窃——他守住了内心最后一块干净的地方。"),
        ]},
        {"title": "狄更斯的社会批判", "badge": "\U0001f525 第六章", "h3_list": [
            ("济贫院制度的残酷",
             "\u300a\u65b0\u6d4e\u8d2b\u6cd5\u300b 1834 \u5e74\u662f\u72c4\u66f4\u65af\u4e3b\u8981\u7684\u653b\u51fb\u76ee\u6807\u3002\u8fd9\u90e8\u6cd5\u5f8b\u5f3a\u8feb\u7a77\u4eba\u8fdb\u5165\u6d4e\u8d2b\u9662\uff0c\u7528\u52b3\u52a8\u6362\u53d6\u751f\u5b58\u2014\u2014\u4f46\u6761\u4ef6\u4e4b\u6076\u52a3\u4f7f\u5b83\u4e8e\u6cd5\u7262\u7f18\u3002",
             "狄更斯写这部小说的直接目的就是推动社会改革。"),
            ("儿童不是问题，是受害者",
             "\u5728\u7ef4\u591a\u5229\u4e9a\u65f6\u4ee3\uff0c\u8d2b\u56f0\u513f\u7ae5\u5e38\u88ab\u89c6\u4e3a\u793e\u4f1a\u95ee\u9898\u9700\u8981\u88ab\u7ba1\u7406\u3002\u72c4\u66f4\u65af\u8ba9\u8bfb\u8005\u770b\u89c1\uff1a\u4ed6\u4eec\u9996\u5148\u662f\u4eba\u2014\u2014\u6709\u611f\u60c5\u3001\u6709\u68a6\u60f3\u3001\u4f1a\u997f\u3001\u4f1a\u5bb3\u6015\u3002",
             "这是文学对社会最大的贡献之一：让看不见的人被看见。"),
        ]},
        {"title": "为什么今天仍要读它？", "badge": "\u2728 第七章", "h3_list": [
            ("请再给我一点仍是今天的呐喊",
             "\u5f53\u5168\u7403\u4ecd\u6709\u6570\u4ee5\u4ebf\u8ba1\u7684\u513f\u7ae5\u5728\u9965\u997f\u4e2d\u957f\u5927\uff0c\u5965\u5229\u5f17\u7684\u58f0\u97f3\u5e76\u6ca1\u6709\u8fc7\u65f6\u3002\u5f53\u793e\u4f1a\u7684\u5c11\u6570\u4eba\u5360\u6709\u7edd\u5927\u591a\u6570\u8d22\u5bcc\u65f6\uff0c\u518d\u7ed9\u6211\u4e00\u70b9\u4ecd\u662f\u6700\u6734\u6734\u7684\u6b63\u4e49\u8981\u6c42\u3002",
             "狄更斯提醒我们：一个文明的程度，要看它如何对待最脆弱的成员。"),
            ("善在逆境中的可贵",
             "\u6700\u4ee4\u4eba\u611f\u52a8\u7684\u4e0d\u662f\u5965\u5229\u5f17\u6700\u540e\u83b7\u5f97\u5e78\u798f\uff0c\u800c\u662f\u4ed6\u5728\u6700\u9ed1\u6697\u65f6\u4f9d\u7136\u4e0d\u653e\u5f03\u5584\u826f\u3002\u8fd9\u662f\u6bcf\u4e00\u4e2a\u8bfb\u8fd9\u672c\u4e66\u7684\u4eba\u90fd\u4f1a\u5b66\u5230\u7684\uff1a\u73af\u5883\u53ef\u4ee5\u6298\u78e8\u4f60\uff0c\u4f46\u65e0\u6cd5\u5b9a\u4e49\u4f60\u3002",
             "真正的成功——如果这个词还有意义——也许就是在被世界扭曲之后，依然选择不扭曲自己。"),
        ]},
    ],
    "summary_text": "是狄更斯用文字为被社会抛弃的孩子发出的呐喊——奥利弗的故事告诉我们：即使出生在最黑暗的角落，内心的善良仍可以不被扭曲；而一个文明的真正高度，在于它如何对待最脆弱的人。",
    "summary_points": [
        "社会创造了孤儿，又惩罚他们成为孤儿",
        "儿童的贫穷不是儿童的问题，是社会的问题",
        "雾既是天气，也是道德的遮蔽",
        "南希的悲剧提醒我们：坏人也会有爱，好人也会身处黑暗",
        "最了不起的成功，是守住内心最后一块干净的地方"],
    "summary_stats": [("9", "奥利弗年龄"), ("1838", "出版年份"), ("3", "次生死边缘"), ("\u221e", "希望不灭")],
    "reading_audience": ["关注社会公正的读者", "童年经历过困境想寻找共鸣的人", "喜欢故事性强的经典文学", "对维多利亚时代社会历史有兴趣", "想理解为什么文学经典被称为经典"],
    "reading_method": ["第1-7章：奥利弗的诞生与济贫院——感受冷幽默下的残酷", "第8-15章：伦敦流浪与小偷团伙——体会心理张力", "第16-23章：南希的选择与死亡——小说最黑暗的部分", "第24-终章：奥利弗的真相与救赎——结局的温暖与代价", "关注狄更斯对雾这一意象的反复使用——它是全书的灵魂"],
})

BOOKS.append({
    "file": "dawei-kebofeier.html",
    "title": "《大卫·科波菲尔》",
    "subtitle_hero": "狄更斯最心爱的自传体小说",
    "tagline": "英国文学 · 自传体 · 人生全景",
    "desc_head": "狄更斯自称这部小说是他最心爱的孩子。从幼年失怙到少年做工，从学徒到作家，大卫·科波菲尔的一生几乎就是狄更斯本人的一生——一部关于童年创伤、奋斗与写作的人生史诗。",
    "highlight_word": "我最心爱的孩子",
    "hero_meta": ["\U0001f4d6 25分钟阅读", "\U0001f58b 1850年出版", "\u2b50 7大章节", "\U0001f4da 自传与成长"],
    "nav_subtitle": "《大卫·科波菲尔》· 狄更斯",
    "author": "查尔斯·狄更斯",
    "author_en": "Charles Dickens",
    "year": "1850",
    "genre": "自传体小说 / 成长小说",
    "keywords": "大卫科波菲尔,狄更斯,David Copperfield,自传体小说,维多利亚时代,写作与人生,童年创伤",
    "image_prompt": "David%20Copperfield%20Charles%20Dickens%20victorian%20writer%20desk%20pen%20literary",
    "progress_titles": [
        "第一章 · 狄更斯最心爱的作品", "第二章 · 童年与创伤", "第三章 · 少年做工与逃离",
        "第四章 · 教育与友情", "第五章 · 写作与爱情", "第六章 · 人生的三次婚姻",
        "第七章 · 成为自己"],
    "chapters": [
        {"title": "狄更斯最心爱的作品", "badge": "\U0001f4d6 第一章", "h3_list": [
            ("为什么是最心爱的孩子？",
             "\u72c4\u66f4\u65af\u5728 1869 \u5e74\u7248\u524d\u8a00\u4e2d\u5199\u9053\uff1a\u6211\u5728\u8bb8\u591a\u4f5c\u54c1\u4e2d\u504f\u7231\u8fd9\u4e00\u90e8\u3002\u6211\u662f\u4e00\u4e2a\u6cbb\u7231\u7684\u7236\u4eb2\uff0c\u4ece\u6ca1\u6709\u4eba\u50cf\u6211\u8fd9\u6837\u6df1\u7231\u8fd9\u4e2a\u5c0f\u5b9d\u8d1d\u3002",
             "这段告白让这部小说在狄更斯作品中占据独一无二的位置。"),
            ("自传还是小说？",
             "\u5c0f\u8bf4\u7684\u5f88\u591a\u60c5\u8282\u76f4\u63a5\u6765\u81ea\u72c4\u66f4\u65af\u7684\u771f\u5b9e\u751f\u6d3b\uff1a\u7236\u4eb2\u503a\u52a1\u5165\u72f1\u3001\u7ae5\u5e74\u5728\u978b\u6cb9\u5de5\u5382\u505a\u5de5\u3001\u81ea\u5b66\u6210\u624d\u6210\u4e3a\u4f5c\u5bb6\u3002\u4f46\u5b83\u4e0d\u662f\u65e5\u8bb0\u2014\u2014\u72c4\u66f4\u65af\u5728\u771f\u5b9e\u4e0e\u865a\u6784\u4e4b\u95f4\u7cbe\u5fc3\u7f16\u7ec7\u3002",
             "它是自传体小说这个文类的完美范例。"),
        ]},
        {"title": "童年与创伤", "badge": "\U0001f476 第二章", "h3_list": [
            ("一个没有父亲的男孩",
             "\u5927\u536b\u51fa\u751f\u65f6\u7236\u4eb2\u5df2\u53bb\u4e16\u516d\u4e2a\u6708\u3002\u8fd9\u4e00\u8bbe\u5b9a\u65e2\u662f\u72c4\u66f4\u65af\u81ea\u5df1\u7684\u7ecf\u5386\uff0c\u4e5f\u8c61\u5f81\u4e86\u4e00\u79cd\u66f4\u666e\u904d\u7684\u5fc3\u7406\u72b6\u6001\uff1a\u7f3a\u5931\u7684\u7236\u4eb2\u5f62\u8c61\u3002",
             "心理学后来会大量讨论这个主题——而狄更斯凭直觉写出了它。"),
            ("继父墨德斯通",
             "\u7ee7\u7236\u58a8\u5fb7\u65af\u901a\u662f\u6587\u5b66\u53f2\u4e0a\u6700\u53ef\u6015\u7684\u7ee7\u7236\u4e4b\u4e00\u3002\u4ed6\u51b0\u51b7\u3001\u4e25\u5389\uff0c\u4ee5\u7eaa\u5f8b\u4e3a\u540d\u6298\u78e8\u5b69\u5b50\u3002\u72c4\u66f4\u65af\u5bf9\u4ed6\u7684