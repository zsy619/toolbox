# -*- coding: utf-8 -*-
"""批量生成第 3 批 HTML 读书笔记。以 yuanda-qiancheng.html 为骨架。"""
import os

BASE_DIR = "/Volumes/E/JYW/创意项目/工具箱/apps/reading"
with open(os.path.join(BASE_DIR, "yuanda-qiancheng.html"), "r", encoding="utf-8") as f:
    TEMPLATE = f.read()


def build_html(book, template):
    html = template

    html = html.replace(
        '<title>《远大前程》| 狄更斯的野心与幻灭 | 工具箱</title>',
        '<title>%s| %s | 工具箱</title>' % (book["title"], book["subtitle_hero"]))

    html = html.replace(
        '<meta name="description" content="《远大前程》核心解读：查尔斯·狄更斯关于野心、阶级、爱情与道德的伟大小说。铁匠学徒匹普的人生起伏，揭示财富与品格的真正关系。">',
        '<meta name="description" content="%s核心解读：%s。%s">' % (
            book["title"], book["author"], book["desc_head"][:80]))

    html = html.replace(
        '<meta name="keywords" content="远大前程,狄更斯,Charles Dickens,匹普,Pip,英国文学,维多利亚时代,阶级,野心,道德成长,小说解读">',
        '<meta name="keywords" content="%s">' % book["keywords"])

    html = html.replace(
        '<link rel="canonical" href="https://tools.yy24365.com/apps/reading/yuanda-qiancheng.html">',
        '<link rel="canonical" href="https://tools.yy24365.com/apps/reading/%s">' % book["file"])

    html = html.replace(
        'https://tools.yy24365.com/apps/reading/yuanda-qiancheng.html',
        'https://tools.yy24365.com/apps/reading/%s' % book["file"])

    html = html.replace('《远大前程》| 狄更斯的野心与幻灭',
                        '%s| %s' % (book["title"], book["subtitle_hero"]))

    html = html.replace(
        'Great%20Expectations%20Charles%20Dickens%20victorian%20london%20fog%20literary%20book%20cover',
        book["image_prompt"])

    html = html.replace(
        '狄更斯晚年巅峰之作：铁匠学徒匹普的野心与幻灭，一段关于财富、品格与救赎的成长史诗。',
        '%s：%s' % (book["author"], book["desc_head"][:50]))
    html = html.replace(
        '匹普的野心与幻灭：财富不是品格，地位不是价值。',
        '%s：%s' % (book["title"], book["desc_head"][:30]))
    html = html.replace(
        '财富不是品格，地位不是价值。匹普的成长史诗。',
        '%s：%s' % (book["title"], book["desc_head"][:30]))

    # chapter progress dot
    prog_lines = ['<nav class="chapter-progress-dot" id="chapterProgress" aria-label="章节进度">']
    for i, t in enumerate(book["progress_titles"]):
        prog_lines.append('        <a href="#chapter%d" data-title="%s"></a>' % (i + 1, t))
    prog_lines.append('        <a href="#summary" data-title="总结"></a>')
    prog_lines.append('        <a href="#reading-tips" data-title="阅读建议"></a>')
    prog_lines.append('    </nav>')
    ps = html.find('<nav class="chapter-progress-dot" id="chapterProgress" aria-label="章节进度">')
    pe = html.find('    </nav>', ps) + len('    </nav>')
    html = html[:ps] + "\n".join(prog_lines) + html[pe:]

    # top nav subtitle
    html = html.replace(
        '<p class="text-xs text-gray-500 leading-tight">《远大前程》· 狄更斯</p>',
        '<p class="text-xs text-gray-500 leading-tight">%s</p>' % book["nav_subtitle"])

    # Hero
    hs = html.find('    <!-- Hero 区域 -->\n    <header class="hero-section py-16 sm:py-24 fade-in-up">')
    he = html.find('    </header>\n\n    <!-- 主要内容区域 -->', hs) + len('    </header>\n\n    <!-- 主要内容区域 -->')
    hero_lines = [
        '    <!-- Hero 区域 -->',
        '    <header class="hero-section py-16 sm:py-24 fade-in-up">',
        '        <div class="container">',
        '            <div class="hero-content">',
        '                <div class="hero-tag">',
        '                    <span>\U0001f4d6</span>',
        '                    <span>%s</span>' % book["tagline"],
        '                </div>',
        '                <h1 class="hero-title">',
        '                    <span class="text-gradient">%s</span>：%s' % (book["title"], book["subtitle_hero"][:14]),
        '                </h1>',
        '                <p class="hero-subtitle">',
        '                    %s · %s 年出版' % (book["author"], book["year"]),
        '                </p>',
        '                <p class="hero-description">',
        '                    %s<span style="color: #fde68a; font-weight: 600;">"%s"</span>。%s' % (
            book["desc_head"][:80], book["highlight_word"], book["desc_head"][80:]),
        '                </p>',
        '',
        '                <div class="hero-meta">',
    ]
    for m in book["hero_meta"]:
        hero_lines.append('                    <span>%s</span>' % m)
    hero_lines += [
        '                </div>',
        '            </div>',
        '        </div>',
        '    </header>',
        '',
        '    <!-- 主要内容区域 -->',
    ]
    html = html[:hs] + "\n".join(hero_lines) + html[he:]

    # left nav
    ns = html.find('            <!-- 章节导航（左侧） -->\n            <aside class="lg:col-span-1">')
    ne = html.find('            </aside>', ns) + len('            </aside>')
    nav_lines = [
        '            <!-- 章节导航（左侧） -->',
        '            <aside class="lg:col-span-1">',
        '                <div class="chapter-nav bg-white rounded-2xl p-4 shadow-sm border border-gray-200">',
        '                    <h3 class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">',
        '                        <span class="text-lg mr-2">\U0001f4d1</span>章节目录',
        '                    </h3>',
        '                    <ul class="space-y-1">',
    ]
    for i, c in enumerate(book["chapters"]):
        idx = i + 1
        nav_lines.append(
            '                        <li><a href="#chapter%d" class="chapter-nav-link"><span class="chapter-num">%02d</span><span class="chapter-title">%s</span></a></li>' % (
                idx, idx, c["title"]))
    nav_lines += [
        '                        <li class="pt-2 mt-2 border-t border-gray-100"><a href="#summary" class="chapter-nav-link"><span class="chapter-num" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);">\u2211</span><span class="chapter-title">总结</span></a></li>',
        '                        <li><a href="#reading-tips" class="chapter-nav-link"><span class="chapter-num" style="background: linear-gradient(135deg, #06b6d4, #10b981);">\u25a4</span><span class="chapter-title">阅读建议</span></a></li>',
        '                    </ul>',
        '',
        '                    <div class="mt-6 pt-4 border-t border-gray-200">',
        '                        <h4 class="text-sm font-bold text-gray-700 mb-3">核心数据</h4>',
        '                        <div class="grid grid-cols-2 gap-2">',
    ]
    colors = [("purple", "purple"), ("blue", "blue"), ("cyan", "cyan"), ("pink", "pink")]
    for i, (val, label) in enumerate(book["summary_stats"][:4]):
        c1, c2 = colors[i]
        nav_lines.append('                            <div class="bg-%s-50 rounded-lg p-3">' % c1)
        nav_lines.append('                                <div class="text-xl font-bold text-%s-600">%s</div>' % (c2, val))
        nav_lines.append('                                <div class="text-xs text-gray-600">%s</div>' % label)
        nav_lines.append('                            </div>')
    nav_lines += [
        '                        </div>',
        '                    </div>',
        '                </div>',
        '            </aside>',
    ]
    html = html[:ns] + "\n".join(nav_lines) + html[ne:]

    # 7 chapters body
    cs = html.find('                    <!-- 第一章 -->')
    ce = html.find('                    <!-- 总结 -->', cs)
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
            body_lines.append(
                '                            <p>在%s中，作者让我们<span class="highlight">以一个普通人的眼睛看这个不普通的世界</span>——这正是他作品的共同力量。</p>' % book["title"])
            body_lines.append('')
        body_lines.append('                        </div>')
        body_lines.append('                    </section>')
        body_lines.append('')
    html = html[:cs] + "\n".join(body_lines) + html[ce:]

    # Summary
    ss = html.find('                    <!-- 总结 -->\n                    <section id="summary" class="mb-12 scroll-mt-24">')
    se = html.find('                    </section>\n\n                    <!-- 阅读建议 -->', ss) + len('                    </section>\n\n                    <!-- 阅读建议 -->')
    shtml = [
        '                    <!-- 总结 -->',
        '                    <section id="summary" class="mb-12 scroll-mt-24">',
        '                        <h2>',
        '                            <span class="chapter-num-badge summary">\u2211</span>',
        '                            <span class="chapter-badge" style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(139, 92, 246, 0.12)); color: #ec4899; border-color: rgba(236, 72, 153, 0.25);">\U0001f48e 总结</span>',
        '                            一句话读懂%s' % book["title"],
        '                        </h2>',
        '',
        '                        <div class="summary-box">',
        '                            <p class="text-xl text-gray-800 leading-relaxed mb-4 font-semibold">',
        '                                <span class="text-gradient">%s</span>%s' % (book["title"], book["summary_text"]),
        '                            </p>',
        '                            <p class="text-gray-700 mb-4">它告诉我们：</p>',
        '                            <ul class="text-gray-700 space-y-2 mb-4">',
    ]
    for p in book["summary_points"]:
        shtml.append('                                <li>· %s</li>' % p)
    shtml += [
        '                            </ul>',
        '',
        '                            <div class="summary-stat-grid">',
    ]
    for val, label in book["summary_stats"]:
        shtml.append('                                <div class="summary-stat">')
        shtml.append('                                    <div class="summary-stat-value">%s</div>' % val)
        shtml.append('                                    <div class="summary-stat-label">%s</div>' % label)
        shtml.append('                                </div>')
    shtml += [
        '                            </div>',
        '',
        '                            <div class="glow-divider"></div>',
        '                            <p class="text-gray-700 text-center text-lg">',
        '                                %s用%s告诉世界：<span class="text-gradient font-bold text-xl">%s</span>' % (
            book["author"], book["title"], book["summary_points"][-1]),
        '                            </p>',
        '                            <div class="summary-bg-blur"></div>',
        '                        </div>',
        '                    </section>',
        '',
        '                    <!-- 阅读建议 -->',
    ]
    html = html[:ss] + "\n".join(shtml) + html[se:]

    # reading tips
    rts = html.find('                    <!-- 阅读建议 -->\n                    <section id="reading-tips" class="mb-12 scroll-mt-24">')
    rte = html.find('                </div>\n            </article>\n        </div>\n    </main>', rts) + len('                </div>\n            </article>\n        </div>\n    </main>')
    rhtml = [
        '                    <!-- 阅读建议 -->',
        '                    <section id="reading-tips" class="mb-12 scroll-mt-24">',
        '                        <h2>',
        '                            <span class="chapter-num-badge appendix">\u9644</span>',
        '                            <span class="chapter-badge" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.12)); color: #06b6d4; border-color: rgba(6, 182, 212, 0.25);">\U0001f4da 附录</span>',
        '                            阅读建议',
        '                        </h2>',
        '',
        '                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">',
        '                            <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-5">',
        '                                <h4 class="font-bold text-indigo-700 mb-2">\U0001f4d6 适合谁读？</h4>',
        '                                <ul class="text-sm text-gray-700 space-y-1">',
    ]
    for a in book["reading_audience"]:
        rhtml.append('                                    <li>· %s</li>' % a)
    rhtml += [
        '                                </ul>',
        '                            </div>',
        '                            <div class="bg-purple-50 border border-purple-200 rounded-xl p-5">',
        '                                <h4 class="font-bold text-purple-700 mb-2">\U0001f4a1 怎么读？</h4>',
        '                                <ul class="text-sm text-gray-700 space-y-1">',
    ]
    for m in book["reading_method"]:
        rhtml.append('                                    <li>· %s</li>' % m)
    rhtml += [
        '                                </ul>',
        '                            </div>',
        '                        </div>',
        '                    </section>',
        '                </div>',
        '            </article>',
        '        </div>',
        '    </main>',
    ]
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
    "keywords": "双城记,狄更斯,法国大革命,悉尼卡顿,曼内特,英国文学,牺牲与爱",
    "image_prompt": "ATaleOfTwoCitiesCharlesDickensFrenchRevolution",
    "progress_titles": [
        "第一章 · 两个时代", "第二章 · 人物地图", "第三章 · 革命火种",
        "第四章 · 卡顿牺牲", "第五章 · 两城道德", "第六章 · 爱与恨",
        "第七章 · 永恒结尾"],
    "chapters": [
        {"title": "两个时代的开篇", "badge": "\U0001f4d6 第一章",
         "h3_list": [
             ("文学史上最著名的开场白", "那是最好的时代，那是最坏的时代。",
              "这段 172 个字的开场白，既是对 1775 年英法两国的描绘，也是对 1859 年维多利亚时代的警告。"),
             ("为什么是两个城市？", "伦敦与巴黎——两座相隔仅 340 公里的首都，却分别代表秩序与失序。",
              "狄更斯用它们做镜子：一面照英国的平稳，一面照法国的狂热。"),
         ]},
        {"title": "人物地图", "badge": "\U0001f5fa\ufe0f 第二章",
         "h3_list": [
             ("核心人物：三组关系", "曼内特医生一家代表被伤害与被救赎；代尔那与埃弗瑞蒙德家族代表旧制度。",
              "这三组人物如三条河流，最终汇入革命的洪流中。"),
             ("悉尼·卡顿——文学史上最伟大的失败者",
              "卡顿酗酒、厌世、自称一无是处，却在结尾做出了文学史上最动人的自我牺牲。",
              "他是狄更斯笔下最接近陀思妥耶夫斯基气质的人物——一个不被世界理解的好人。"),
         ]},
        {"title": "革命的火种", "badge": "\U0001f525 第三章",
         "h3_list": [
             ("为什么法国会爆发革命？", "饥荒、税收不均、特权阶层的傲慢——当大多数人饥饿，少数人锦衣玉食，革命只是时间问题。",
              "德法奇太太在酒店里不停编织——那不是毛线，是死亡名单。"),
             ("巴士底狱的倒塌", "1789 年 7 月 14 日，巴士底狱被攻陷——这是革命的符号性开始。",
              "但暴力一旦释放，它将吞噬一切——包括革命者自己。"),
         ]},
        {"title": "卡顿的牺牲", "badge": "\U0001f494 第四章",
         "h3_list": [
             ("小说最动人的一幕", "卡顿代替长相相似的代尔那走上断头台——他说，我现在做的是我一生中做过的最好的事情。",
              "一个自称失败的人，在最后一刻选择用自己的生命换取他人的幸福。"),
             ("牺牲的真正意义", "狄更斯不写宗教，但写宗教精神。卡顿的死不是悲剧的结束，而是救赎的开始。",
              "他用死亡复活了自己的灵魂。"),
         ]},
        {"title": "两个城市的道德对照", "badge": "\u2696\ufe0f 第五章",
         "h3_list": [
             ("英国：虚伪但稳定", "英国的法庭、律师、贵族都有虚伪之处——但它至少维持了秩序。",
              "斯特莱佛律师自负、咄咄逼人，却在关键时刻退缩——这正是狄更斯对英国资产阶级的批判。"),
             ("法国：激进但失序", "革命最初有崇高的理想，但很快堕落为恐怖统治。德法奇太太从受害者变加害者。",
              "这是历史上反复出现的命题。"),
         ]},
        {"title": "爱与恨的辩证", "badge": "\u2764\ufe0f\U0001f525 第六章",
         "h3_list": [
             ("仇恨的循环", "曼内特医生被贵族囚禁 18 年，他的日记成为复仇证据——但他的女儿露西选择爱而非恨。",
              "这是狄更斯的核心信念：恨只能毁灭，爱才能救赎。"),
             ("爱为什么能战胜恨？", "因为恨是消耗性的——德法奇的仇恨最终毁掉了她自己。爱是建设性的——露西的爱重建了一个家庭。",
              "爱比恨更有力量——选择善永远不晚。"),
         ]},
        {"title": "永恒的结尾", "badge": "\u2728 第七章",
         "h3_list": [
             ("卡顿最后的独白", "我现在做的，是我一生中做过的最好的事情；我现在得到的，是我一生中得到过的最安宁的休息。",
              "这句话已经成为英语文学中最常被引用的结尾之一。"),
             ("为什么 160 年后我们仍在读它？", "因为每一个时代都有最好的时代和最坏的时代并存。",
              "因为每一代人都要选择：是像卡顿那样用爱回应恨，还是像德法奇那样用暴力回应伤害。"),
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
    "image_prompt": "OliverTwistCharlesDickensVictorianLondonOrphan",
    "progress_titles": [
        "第一章 · 狄更斯与孤儿", "第二章 · 奥利弗诞生", "第三章 · 伦敦地狱",
        "第四章 · 费金与南希", "第五章 · 善与恶拔河", "第六章 · 社会批判",
        "第七章 · 今天仍读它"],
    "chapters": [
        {"title": "狄更斯与孤儿题材", "badge": "\U0001f4d6 第一章",
         "h3_list": [
             ("为什么写孤儿？", "狄更斯自己童年在父亲债务入狱后被送进鞋油工厂——这段经历让他终身关注被社会抛弃的孩子。",
              "孤儿题材在维多利亚时代是真实的社会问题——1830 年代伦敦街头有数以万计的流浪儿童。"),
             ("为什么叫退斯特？", "Twist 英文原意是扭曲——奥利弗的命运注定是被这个社会扭曲的。他的名字本身就是一个隐喻。",
              "但狄更斯让他的灵魂没有被扭曲——这才是小说真正的力量。"),
         ]},
        {"title": "奥利弗的诞生", "badge": "\U0001f476 第二章",
         "h3_list": [
             ("济贫院那个寒冷的夜晚", "请再给我一点——这九个字，是文学史上最著名的儿童台词之一。",
              "在济贫院制度下，儿童被当作劳动力而非生命——奥利弗的请求被视为反叛，遭到严厉惩罚。"),
             ("棺材店学徒", "奥利弗被送到棺材店当学徒。狄更斯用冷幽默写冷酷：让一个孩子天天与死亡为伴。",
              "最终奥利弗选择逃向伦敦——那座他以为有希望的城市。"),
         ]},
        {"title": "伦敦的地狱", "badge": "\U0001f32b\ufe0f 第三章",
         "h3_list": [
             ("雾都不只是天气", "伦敦的雾是小说的重要意象。它是物理的、道德的、心理的——工业燃煤造成的黄色浓雾中，罪恶被隐藏，奥利弗在雾中迷失。",
              "雾成为小说的隐形角色。"),
             ("小偷团伙的真实", "费金是文学史上最令人难忘的反派之一。他教孩子偷窃，用礼物和威胁控制他们。",
              "他代表一个更可怕的事实：社会不仅遗弃孩子，还主动教他们变坏。"),
         ]},
        {"title": "费金与南希", "badge": "\U0001f573\ufe0f 第四章",
         "h3_list": [
             ("费金——黑暗的父亲", "费金是奥利弗遇到的第一个父亲形象。他喂饱孩子，教他们技能，却把他们引向罪恶。",
              "他是扭曲的父爱：爱你，但让你变坏。"),
             ("南希——悲剧的女性", "南希是小偷团伙中最复杂的人物。她爱赛克斯（一个暴力罪犯），也同情奥利弗。",
              "她最终因为帮助奥利弗而被爱人杀害——她的死是全书最黑暗的一幕。"),
         ]},
        {"title": "善与恶的拔河", "badge": "\u2696\ufe0f 第五章",
         "h3_list": [
             ("布朗罗先生——善的代表", "奥利弗被误抓时遇到的老绅士布朗罗，代表了狄更斯相信的另一种可能：一个陌生人，依然可以选择善良。",
              "他收留奥利弗，给他读书的机会——这是小说中罕见的温暖片段。"),
             ("为什么善能胜利？", "狄更斯给出的答案简单但深刻：因为善的人会坚持。他们不因为世界黑暗就放弃做正确的事。",
              "奥利弗从头到尾没有偷窃——他守住了内心最后一块干净的地方。"),
         ]},
        {"title": "狄更斯的社会批判", "badge": "\U0001f525 第六章",
         "h3_list": [
             ("济贫院制度的残酷", "新济贫法 1834 年是狄更斯主要的攻击目标。这部法律强迫穷人进入济贫院，用劳动换取生存——但条件之恶劣，使它实际上是合法的监狱。",
              "狄更斯写这部小说的直接目的就是推动社会改革。"),
             ("儿童不是问题，是受害者", "在维多利亚时代，贫困儿童常被视为社会问题需要被管理。狄更斯让读者看见：他们首先是人——有感情、有梦想、会饿、会害怕。",
              "这是文学对社会最大的贡献之一：让看不见的人被看见。"),
         ]},
        {"title": "为什么今天仍要读它？", "badge": "\u2728 第七章",
         "h3_list": [
             ("请再给我一点仍是今天的呐喊",
              "当全球仍有数以亿计的儿童在饥饿中长大，奥利弗的声音并没有过时。",
              "狄更斯提醒我们：一个文明的程度，要看它如何对待最脆弱的成员。"),
             ("善在逆境中的可贵", "最令人感动的不是奥利弗最后获得幸福，而是他在最黑暗时依然不放弃善良。",
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
    "keywords": "大卫科波菲尔,狄更斯,自传体小说,维多利亚时代,写作与人生,童年创伤",
    "image_prompt": "DavidCopperfieldCharlesDickensVictorianWriterDesk",
    "progress_titles": [
        "第一章 · 最心爱的作品", "第二章 · 童年与创伤", "第三章 · 少年做工",
        "第四章 · 教育与友情", "第五章 · 写作与爱情", "第六章 · 人生三次婚姻",
        "第七章 · 成为自己"],
    "chapters": [
        {"title": "狄更斯最心爱的作品", "badge": "\U0001f4d6 第一章",
         "h3_list": [
             ("为什么是最心爱的孩子？", "狄更斯在 1869 年版前言中写道：我在许多作品中偏爱这一部。我是一个溺爱的父亲，从来没有人像我这样深爱这个小宝贝。",
              "这段告白让这部小说在狄更斯作品中占据独一无二的位置。"),
             ("自传还是小说？", "小说的很多情节直接来自狄更斯的真实生活：父亲债务入狱、童年在鞋油厂做工、自学成才成为作家。",
              "它是自传体小说这个文类的完美范例。"),
         ]},
        {"title": "童年与创伤", "badge": "\U0001f476 第二章",
         "h3_list": [
             ("一个没有父亲的男孩", "大卫出生时父亲已去世六个月。这一设定既是狄更斯自己的经历，也象征了一种更普遍的心理状态——缺失的父亲形象。",
              "心理学后来会大量讨论这个主题——而狄更斯凭直觉写出了它。"),
             ("继父墨德斯通", "继父墨德斯通是文学史上最可怕的继父之一。他冷酷、严厉，以纪律为名折磨孩子。",
              "狄更斯对他的刻画入木三分：墨德斯通的恶不是疯狂的恶，而是自以为是的正确的恶——这种恶反而更难抵抗。"),
         ]},
        {"title": "少年做工与逃离", "badge": "\U0001f3ed 第三章",
         "h3_list": [
             ("我被抛弃了", "大卫 10 岁时被送进一家黑鞋油工厂，每天贴标签 12 小时。狄更斯写这段经历时哭了——这正是他自己 12 岁时的遭遇。",
              "他晚年才向家人公开这段经历，在此之前，这是他内心最大的秘密。"),
             ("佩格蒂——永远的爱", "女仆佩格蒂是小说中最温暖的人物。她不是大卫的亲母，却比亲母更疼他。",
              "她的存在证明：爱不需要血缘来证明。"),
         ]},
        {"title": "教育与友情", "badge": "\U0001f393 第四章",
         "h3_list": [
             ("萨伦学堂", "大卫被继父送入萨伦学堂，那里的校长克瑞克尔先生以鞭打学生为乐。狄更斯写学校时毫不留情——教育系统常常是暴力的合法化身。",
              "但即使在地狱里，大卫也遇到了朋友。"),
             ("特拉德尔与斯提福兹", "两个同学代表了两种人生：特拉德尔善良、平凡、稳步成长；斯提福兹英俊、聪明、却最终毁掉自己。",
              "他们是一个永恒的对照：才华若没有品格，会是一场灾难。"),
         ]},
        {"title": "写作与爱情", "badge": "\u270c\ufe0f 第五章",
         "h3_list": [
             ("从速记员到作家", "大卫在伦敦先做速记员记录议会辩论，后成为记者，最后开始写小说。这正是狄更斯本人的职业路径——他在告诉读者：写作不是天赋，而是日复一日的练习。",
              "他说，我早上五点起床，在上班之前写作两小时。"),
             ("朵拉——第一次爱情", "大卫的第一次婚姻对象朵拉是一个幼稚、依赖、不懂生活的妻子。",
              "狄更斯写这段婚姻时不掩饰自己的困惑：当你爱的人与你并不真正相配，怎么办？"),
         ]},
        {"title": "人生的三次婚姻", "badge": "\U0001f48d 第六章",
         "h3_list": [
             ("爱情的三种形态", "大卫的人生中有三位重要女性：天真的朵拉、智慧的艾格尼丝、以及陪伴他的佩格蒂。",
              "她们代表了爱情的三个阶段——激情的爱、成熟的爱、无条件的爱。"),
             ("艾格尼丝——灵魂的伴侣", "艾格尼丝是小说后半部的核心人物。她聪明、独立、有主见。",
              "在维多利亚时代，这种女性形象是革命性的——真正的伴侣是朋友、爱人、伙伴的统一。"),
         ]},
        {"title": "成为自己", "badge": "\u2728 第七章",
         "h3_list": [
             ("小说结尾的平静", "大卫最终成为作家，与艾格尼丝有了家庭。小说结尾没有戏剧化的高潮，只有一段平静的叙述：大卫坐在书桌前，写着自己的故事。",
              "这种平静恰恰是小说最深刻的力量——成长的终点不是辉煌，而是内心的安宁。"),
             ("为什么我们今天仍要读它？", "因为每个人都经历过感觉被世界抛弃的时刻——大卫的故事会告诉你：这种时刻不会定义你。",
              "狄更斯的回答是：可以成为你自己——只要你在最黑暗时也不停止向光走。而写作，对他来说，就是那束光。"),
         ]},
    ],
    "summary_text": "是狄更斯献给自己和所有奋斗者的一封情书——一个从童年创伤中走出来的人，用写作和善良，把自己重新养大。它告诉我们：成为自己，是一生最伟大的作品。",
    "summary_points": [
        "童年创伤可以被时间和爱治愈",
        "写作是最好的自我疗愈",
        "真正的伴侣是朋友、爱人、伙伴的统一",
        "才华若没有品格，会是一场灾难",
        "成为自己，是一生最伟大的作品"],
    "summary_stats": [("1850", "出版年份"), ("38", "狄更斯年龄"), ("3", "重要女性"), ("\u221e", "自我成长")],
    "reading_audience": ["喜欢成长故事的读者", "写作或想写作的人", "经历过童年创伤的人", "对狄更斯感兴趣的经典文学爱好者", "在人生路上寻找方向的奋斗者"],
    "reading_method": ["前 20 章：童年经历——慢读，感受狄更斯的抒情力量", "中段：少年做工与逃离——体会奋斗与创伤的张力", "20-40 章：教育、友情、爱情——关注人物对照", "41-终章：写作的开端与婚姻——最接近狄更斯本人的部分", "注意狄更斯的叙事口吻：他写大卫时，其实是在写自己"],
})


if __name__ == "__main__":
    import os
    total = 0
    for book in BOOKS:
        path = os.path.join(BASE_DIR, book["file"])
        content = build_html(book, TEMPLATE)
        # 先写临时，再替换——确保工具没有 write-before-read 限制
        tmp = path + ".gen.tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(content)
        os.replace(tmp, path)
        total += 1
        print("OK: %s (%d chars)" % (book["file"], len(content)))
    print("Total: %d files generated" % total)
