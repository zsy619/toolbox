#!/usr/bin/env python3
"""
为 wunengda_prompting.html 重构 21 集 episode-item 为可展开的 HTML 结构
"""

# 21 集的归纳明细数据
episodes = [
    # 模块一：信息查找
    {
        "id": 1, "title": "课程导览：AI 新手 vs 高级用户",
        "points": [
            "<strong>5 大核心差异：</strong>问难问题、提供上下文、客观提问、先大纲后写作、跨工具协作",
            "高级用户让 AI 花<strong>几十秒甚至几分钟</strong>思考后给出详细报告",
            "把 AI 想象成<strong>刚毕业的聪明大学生</strong>——积极但不了解你",
            "AI 实际犯错<strong>比想象中少</strong>，病毒式传播的失败案例不代表真实能力"
        ],
        "tags": ["AI 新手", "高级用户", "思考伙伴"],
        "quote": "善用AI是你能够培养的最具影响力的技能之一。"
    },
    {
        "id": 2, "title": "预训练知识：AI 从哪里获取知识",
        "points": [
            "AI 通过阅读<strong>互联网上大量文本</strong>学习模式（预训练知识）",
            "知识有<strong>截止日期</strong>，无法回答最新事件",
            "<strong>数据频率法则：</strong>烹饪类文章多 → AI 答得好；类星体类少 → AI 不擅长",
            "AI 不知道你公司的<strong>专有数据</strong>，这些不在开放的互联网上",
            "AI 对<strong>拼写错误</strong>有很好的容忍度（因为训练数据本身有错误）"
        ],
        "tags": ["预训练知识", "知识截止", "数据频率"],
        "quote": "AI 模型从许多不同的信息来源训练，主要来自互联网。"
    },
    {
        "id": 3, "title": "网络搜索：突破知识截止日期",
        "points": [
            "特定问题会<strong>自动触发</strong>网络搜索（涉及时间、实时信息）",
            "可<strong>手动触发</strong>：点击按钮或在提示中写\"请进行网络搜索\"",
            "工作原理：<strong>两个 AI 协作</strong>——面向用户的 AI + 助手 AI（执行搜索）",
            "助手 AI 搜索 → 过滤 → 下载 → <strong>总结</strong> → 返回给主 AI",
            "主 AI 只看<strong>摘要</strong>，可能误读原网页内容"
        ],
        "tags": ["网络搜索", "AI 协作", "知识截止"],
        "quote": "网络搜索允许它用更当前的信息来增强预训练知识。"
    },
    {
        "id": 4, "title": "可靠来源：避免社交媒体误导",
        "points": [
            "网络搜索倾向引用<strong>热门来源</strong>（Reddit 排第一）",
            "显式指定来源：<strong>\"请使用 WHO / FDA / EMA 官方机构来源\"</strong>",
            "网页可能<strong>过时</strong>，导致 AI 推荐已关闭的跑步地点",
            "<strong>冷门信息</strong>和<strong>实时信息</strong>是网络搜索的最佳使用场景",
            "常见事实（最高建筑）用预训练知识就够，无需搜索"
        ],
        "tags": ["可靠来源", "信息来源", "质量控制"],
        "quote": "它有局限性，比如找到过时或不准确的来源。"
    },
    {
        "id": 5, "title": "深度研究：综合多个来源的复杂任务",
        "points": [
            "综合<strong>几十到几百个来源</strong>，耗时数分钟到数十分钟",
            "AI 自主决定下一步：是否需要更多搜索、是否调整方向",
            "AI 可<strong>同时</strong>发出多个搜索，效率远高于人类",
            "适合需要<strong>多角度权衡</strong>的复杂问题（如：步数对健康的影响）",
            "通常需要<strong>显式触发</strong>（点击\"深度研究\"按钮）"
        ],
        "tags": ["深度研究", "综合分析", "代理式 AI"],
        "quote": "如果你要回答复杂问题，深度研究特别有用。"
    },
    {
        "id": 6, "title": "实践实验室：信息查找策略",
        "points": [
            "<strong>时事类问题：</strong>比较有无网络搜索的差异（如 6.7 梗）",
            "<strong>位置类查询：</strong>健身房推荐、跑步地点等",
            "<strong>拼写错误测试：</strong>AI 对拼写错误有惊人的容忍度",
            "<strong>上传文件：</strong>同一问题上传租赁协议会得到不同答案",
            "建立<strong>何时用哪种工具</strong>的直觉"
        ],
        "tags": ["实践练习", "信息路径", "实验对比"],
        "quote": "希望你享受在实验室中的尝试。"
    },
    # 模块二：思考伙伴
    {
        "id": 7, "title": "头脑风暴：迭代式获取创意",
        "points": [
            "<strong>创意性 vs 通用性：</strong>给更多上下文会推到更独特空间",
            "<strong>5 步迭代法：</strong>上下文 → 选项 → 反馈 → 迭代 → 细化",
            "一次给 AI 多个选项（3-5 个），比单选项更高效",
            "对选项的<strong>反馈</strong>是提供上下文的最佳方式",
            "独特创意例子：<strong>\"猫咪触发式微型锻炼\"</strong>（给上下文：蹦床 + 猫）"
        ],
        "tags": ["头脑风暴", "迭代", "上下文"],
        "quote": "如果你想要高质量、有创意的想法，要给 AI 充分上下文。"
    },
    {
        "id": 8, "title": "上下文：75 万词容量如何用",
        "points": [
            "现代 AI 可用<strong>75 万词</strong>上下文（约 4-5 本哈利波特书）",
            "上下文组成：<strong>系统提示 + 工具定义 + 用户输入 + 聊天历史</strong>",
            "高质量回应的关键：<strong>只有相关信息</strong>，没有太多干扰",
            "换不相关话题时，<strong>开新对话</strong>清空上下文",
            "上下文越多 ≠ 越好，<strong>相关性</strong>才是关键"
        ],
        "tags": ["上下文", "容量管理", "对话历史"],
        "quote": "很多人低估了你可以给 AI 模型多少信息。"
    },
    {
        "id": 9, "title": "AI 桌面应用：自动获取上下文",
        "points": [
            "<strong>代理式</strong>读取你的电脑文件，无需提前上传",
            "工作流：<strong>让它先出计划 → 你审查 → 满意后再执行</strong>",
            "应用可<strong>自动探索</strong>文件夹，只在需要时加载相关文件",
            "<strong>安全警告：</strong>只开放任务相关文件夹，谨慎授权",
            "删除文件<strong>不进回收站</strong>，编辑文件<strong>无历史记录</strong>"
        ],
        "tags": ["桌面应用", "代理式", "文件管理"],
        "quote": "建议选择最相关的文件夹来运行 AI 桌面应用。"
    },
    {
        "id": 10, "title": "推理：让 AI 认真思考",
        "points": [
            "现代模型已不需要\"<strong>一步步思考</strong>\"指令（已过时）",
            "直接说 <strong>\"认真思考\" / \"ultra think\"</strong> 即可触发长推理",
            "AI 可思考<strong>几十秒到几分钟</strong>，有时超过 10 分钟",
            "适合：<strong>买车、规划行程、综合多源分析</strong>等复杂任务",
            "AI 任务时间从 2024 年的<strong>几秒</strong>扩展到现在的<strong>数小时级</strong>"
        ],
        "tags": ["推理", "长思考", "复杂任务"],
        "quote": "选择思考模式或直接在提示中告诉它认真思考。"
    },
    {
        "id": 11, "title": "谄媚效应：如何避免被拍马屁",
        "points": [
            "AI 强烈同意倾向是不同意的<strong>10 倍</strong>（《华盛顿邮报》研究）",
            "谄媚来自训练机制：人类倾向给\"让我感觉好\"的回答点赞",
            "解决 1：<strong>中性提问</strong>——避免暗示期望答案",
            "解决 2：<strong>客观评分标准（Rubric）</strong>——清晰定义每项标准",
            "明示问\"X 和 Y 优缺点对比\"，而非\"X 不是更好吗？\""
        ],
        "tags": ["谄媚效应", "中性提问", "评分标准"],
        "quote": "实施中性框架，将帮助你从 AI 获得更客观和有价值的反馈。"
    },
    {
        "id": 12, "title": "AI 写作：避免 AI 废话",
        "points": [
            "AI 废话 5 大特征：<strong>破折号、delve、三重列表、\"不仅是 x 而是 y\"、模糊感叹</strong>",
            "写作占 ChatGPT 任务的<strong>24%</strong>（最大类别）",
            "避免方法：<strong>渐进式大纲</strong>——先大纲 → 反馈 → 迭代 → 要点 → 终稿",
            "编辑大纲比编辑终稿<strong>杠杆高得多</strong>（改大纲影响整段）",
            "人类也开始\"像 AI 一样说话\"——使用 delve 频率上升"
        ],
        "tags": ["AI 废话", "渐进式大纲", "写作工作流"],
        "quote": "人们用 'delve' 这个词越来越多。"
    },
    {
        "id": 13, "title": "AI 编辑：客观评分标准",
        "points": [
            "<strong>逐段编辑</strong>比一次性编辑整篇更可控",
            "好评分标准示例：<strong>角色 25 分 / 情节 25 分 / 世界观 25 分 / 写作 25 分</strong>",
            "每项标准<strong>清晰可判定</strong>（真 / 假），没有中间地带",
            "跨模型审查：让 ChatGPT 评 Gemini 的输出，反之亦然",
            "AI 有<strong>参差智能</strong>：不同任务上表现差异巨大，<strong>多模型对比</strong>很重要"
        ],
        "tags": ["评分标准", "跨模型", "编辑"],
        "quote": "完全客观的标准迫使 AI 通过一个明确的视角审视你给它的任何东西。"
    },
    {
        "id": 14, "title": "实践实验室：思考伙伴策略",
        "points": [
            "<strong>头脑风暴对比：</strong>少上下文 vs 多上下文的差异",
            "<strong>评论对比：</strong>主观评分 vs 客观评分的差异",
            "改进简历、求职信、科幻故事等真实场景",
            "客观评分往往得<strong>接近满分</strong>，但更<strong>有用</strong>",
            "鼓励尝试<strong>自己的提示</strong>和作品"
        ],
        "tags": ["实践", "对比实验", "工作流"],
        "quote": "希望你享受探索实验室的乐趣。"
    },
    # 模块三：多模态生成
    {
        "id": 15, "title": "多模态输出：图像/视频/音频/代码",
        "points": [
            "AI 可生成：<strong>图像、视频、语音、音乐、代码</strong>",
            "<strong>成本递增：</strong>文本 < 语音 < 图像 < 视频（依次贵很多）",
            "案例：女儿生日蛋糕设计——<strong>AI 图像 → 真实 3D 蛋糕</strong>",
            "案例：声音克隆读 The Batch 通讯，<strong>真假难辨</strong>",
            "<strong>责任：</strong>AI 声音克隆已被用于诈骗，需谨慎使用"
        ],
        "tags": ["多模态", "图像生成", "语音克隆"],
        "quote": "AI 也可以生成代码……让每个人都能编写基本程序。"
    },
    {
        "id": 16, "title": "图像输入：让 AI 看见你说的话",
        "points": [
            "AI 看图能力强项：<strong>读取手写文本、识别场景、理解内容</strong>",
            "AI 看图弱项：<strong>粗略看大致样子</strong>，可能错过细节",
            "案例：<strong>正确识别白板上的卷积神经网络</strong>，尽管\"卷积\"被头挡住",
            "<strong>独特物品</strong>（如人类大小仓鼠轮）AI 识别很准",
            "可上传<strong>多张图像</strong>给 AI 更多上下文"
        ],
        "tags": ["图像输入", "视觉理解", "多模态输入"],
        "quote": "一张图片胜过千言万语。"
    },
    {
        "id": 17, "title": "图像生成：扩散模型原理",
        "points": [
            "<strong>扩散模型：</strong>从纯噪声开始，逐步<strong>去噪</strong>得到清晰图像",
            "训练时：看图片 + 标题 → 学习从噪声还原图像",
            "生成时：写提示 → 从噪声开始去噪 → 输出图像",
            "缺点：<strong>手部异常、文字乱码、角色不一致</strong>",
            "现代模型已改善很多（如 Imagen），可生成相当一致的漫画角色"
        ],
        "tags": ["扩散模型", "图像生成", "AI 创作"],
        "quote": "扩散模型确实会生成随机输出，也可能犯某些类型的错误。"
    },
    # 模块四：代码与构建
    {
        "id": 18, "title": "构建应用：输入-输出思维",
        "points": [
            "<strong>三要素：</strong>目标（创建什么） + 输入（用户给什么） + 输出（AI 返回什么）",
            "案例：<strong>烟花秀</strong>——输入：点击屏幕，输出：彩色烟花",
            "案例：<strong>调色板选择器</strong>——输入 RGB 基础色，输出配色方案",
            "案例：<strong>闪卡应用</strong>——输入法语单词，输出释义",
            "<strong>简单起步：</strong>番茄钟、账单计算器、穿搭选择等"
        ],
        "tags": ["应用构建", "输入输出", "无代码"],
        "quote": "一个领先的 AI 模型可以创建一个相当有趣的游戏。"
    },
    {
        "id": 19, "title": "数据分析：让 AI 写代码分析",
        "points": [
            "AI 可写代码分析你的<strong>Excel / CSV 数据</strong>",
            "案例：<strong>珍珠奶茶店销售分析</strong>——AI 识别季节性趋势",
            "案例：<strong>年终回顾图表</strong>——AI 计算收入、绘制可视化",
            "使用\"<strong>仔细</strong>\"或\"<strong>认真分析</strong>\"触发深度思考",
            "<strong>警告：</strong>AI 可能产生幻觉数字，必须复核"
        ],
        "tags": ["数据分析", "代码生成", "可视化"],
        "quote": "AI 并不总是可靠，但比你自己用 Excel 快得多。"
    },
    {
        "id": 20, "title": "期末项目：研究 + 构建",
        "points": [
            "<strong>三步流程：</strong>研究问题 → 研究 → 构建应用",
            "示例：<strong>职业发展</strong>研究 → 构建职业测试应用",
            "构建选项：<strong>测验、信息图、游戏</strong>",
            "可<strong>分享</strong>应用给朋友，复制 URL 即可",
            "鼓励经过<strong>多轮迭代</strong>的头脑风暴过程"
        ],
        "tags": ["期末项目", "研究", "应用构建"],
        "quote": "我希望你享受经过迭代式头脑风暴的过程。"
    },
    {
        "id": 21, "title": "课程总结：从新手到高级用户",
        "points": [
            "你已掌握：<strong>头脑风暴、深度研究、写作、多模态、数据分析</strong>",
            "<strong>持续实践 3 件事：</strong>尝试新模型 / 给 AI 困难任务 / 提供高质量上下文",
            "AI 模型持续进化，<strong>保持学习</strong>是关键",
            "用 AI 帮助<strong>自己、朋友、社区</strong>，让世界更美好",
            "欢迎继续学习 <strong>Vibe Coding</strong> 课程深入构建应用"
        ],
        "tags": ["课程总结", "进阶", "持续学习"],
        "quote": "感谢你坚持到这里。"
    }
]

# 生成 HTML
html_blocks = []
for ep in episodes:
    ep_id = ep["id"]
    title = ep["title"]
    points = ep["points"]
    tags = ep["tags"]
    quote = ep["quote"]

    # 列表项
    points_html = "\n                            ".join([f"<li>{p}</li>" for p in points])
    tags_html = "\n                            ".join([f'<span class="episode-detail-tag">{t}</span>' for t in tags])

    block = f'''                        <div class="episode-item" itemscope itemtype="https://schema.org/LearningResource">
                            <button class="episode-toggle" type="button"
                                    aria-expanded="false"
                                    aria-controls="episode-detail-{ep_id}"
                                    aria-label="展开或收起第 {ep_id} 集：{title} 的归纳明细">
                                <div class="episode-toggle-num" aria-hidden="true">{ep_id}</div>
                                <div class="episode-toggle-text" itemprop="name">{title}</div>
                                <span class="episode-arrow" aria-hidden="true">▼</span>
                            </button>
                            <div class="episode-detail" id="episode-detail-{ep_id}" hidden itemprop="description">
                                <h4 class="episode-detail-title">📌 核心要点</h4>
                                <ul class="episode-detail-list">
                                    {points_html}
                                </ul>
                                <div class="episode-detail-quote">\"{quote}\"</div>
                                <h4 class="episode-detail-title">🏷️ 关键术语</h4>
                                <div class="episode-detail-tags">
                                    {tags_html}
                                </div>
                            </div>
                        </div>'''
    html_blocks.append(block)

# 读取原文件
with open('/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/wunengda_prompting.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 使用正则表达式替换所有 episode-item
# 匹配模式：<div class="episode-item">...</div> 一直到 </div> 闭合
import re

# 这种方法不可靠，因为 div 嵌套复杂。改用基于特定模式替换
# 模式：以 <div class="episode-item"> 开头，到下一行的 </div> 结束

pattern = re.compile(
    r'<div class="episode-item">\s*<div class="episode-num">(\d+)</div>\s*<div class="episode-title">([^<]+)</div>\s*</div>',
    re.MULTILINE
)

def replace_episode(match):
    ep_id = int(match.group(1))
    title = match.group(2)
    ep = next((e for e in episodes if e["id"] == ep_id), None)
    if not ep:
        return match.group(0)

    points_html = "\n                            ".join([f"<li>{p}</li>" for p in ep["points"]])
    tags_html = "\n                            ".join([f'<span class="episode-detail-tag">{t}</span>' for t in ep["tags"]])

    return f'''<div class="episode-item" itemscope itemtype="https://schema.org/LearningResource">
                            <button class="episode-toggle" type="button"
                                    aria-expanded="false"
                                    aria-controls="episode-detail-{ep_id}"
                                    aria-label="展开或收起第 {ep_id} 集：{title} 的归纳明细">
                                <div class="episode-toggle-num" aria-hidden="true">{ep_id}</div>
                                <div class="episode-toggle-text" itemprop="name">{title}</div>
                                <span class="episode-arrow" aria-hidden="true">▼</span>
                            </button>
                            <div class="episode-detail" id="episode-detail-{ep_id}" hidden itemprop="description">
                                <h4 class="episode-detail-title">📌 核心要点</h4>
                                <ul class="episode-detail-list">
                                    {points_html}
                                </ul>
                                <div class="episode-detail-quote">"{ep["quote"]}"</div>
                                <h4 class="episode-detail-title">🏷️ 关键术语</h4>
                                <div class="episode-detail-tags">
                                    {tags_html}
                                </div>
                            </div>
                        </div>'''

new_content = pattern.sub(replace_episode, content)

# 统计替换数量
count = len(pattern.findall(content))
print(f"找到 {count} 个 episode-item")
print(f"替换后文件长度变化: {len(content)} -> {len(new_content)} (差 {len(new_content) - len(content)})")

# 写入文件
with open('/Volumes/E/JYW/创意项目/工具箱/apps/ai-tools/wunengda_prompting.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("HTML 重构完成！")