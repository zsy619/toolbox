#!/usr/bin/env python3
# 生成导航菜单代码

courses = [
    (30, "AI写歌+Agent小红书分享"),
    (31, "人工智能+AI知识库"),
    (32, "解释提示词大赛10强"),
    (33, "AI落地框架+提示词大赛"),
    (34, "音业务探索+AI辅助编程入门"),
    (35, "刻意练习+拆解神级提示词"),
    (36, "编程工具Windsurf+视频号AI工具"),
    (37, "我用AI做外包"),
    (38, "AI辅助短视频工作流+AI写算法"),
    (39, "AI学习方法论"),
    (40, "我用AI做短视频"),
    (41, "DeepSeekR1"),
    (42, "AI学习和DeepSeek本地部署"),
    (43, "新工具新认知+图表实践+AI写歌升级"),
    (44, "文字分享特别版"),
    (45, "文字分享特别版2"),
    (46, "聊聊Manus和智能体"),
    (47, "AI应用合规问题"),
    (48, "Manus实测+探讨AI业务落地"),
    (49, "提示词大赛+优秀作业"),
    (50, "AI落地试讲"),
    (51, "智能体串讲"),
    (52, "提示词迭代和Coze智能体实操"),
    (53, "提示词大赛+Lovart实践"),
    (54, "从手办自由到AIGC商业落地"),
    (55, "大赛作品IPO和Coze探索"),
    (56, "身边同学的智能体修行"),
    (57, "海报审美和两个真实业务探索"),
    (58, "一堂方法论到智能体和我用AI学AI"),
    (59, "直播间问答AMAi特别篇"),
    (60, "一个Coze实操工作流"),
    (61, "提示词大赛复盘IPO+Coze批处理和循环"),
    (62, "Y模型x时间管理修炼"),
    (63, "我用提示词搞定提示词"),
    (64, "直播间问答AMAi特别篇2"),
    (65, "为一堂AI预热"),
    (66, "往期回放的10种打开方式"),
    (67, "Y模型与方法论"),
    (68, "大航海优秀项目之AI金融助手复盘"),
    (69, "提示词工程实践指南"),
    (70, "一堂方法论+AI实践"),
    (71, "OpenClaw龙虾与Agent团队"),
]

# 生成桌面端菜单代码
print("=== 桌面端菜单 ===\n")
for num, title in reversed(courses):
    short_title = title[:6] + "..." if len(title) > 6 else title
    print(f'<a href="live{num}.html" class="group/item flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all border border-transparent hover:border-purple-200">')
    print(f'    <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform">')
    print(f'        <span class="text-white text-xs font-bold">{num}</span>')
    print(f'    </span>')
    print(f'    <div class="flex-1 min-w-0">')
    print(f'        <h4 class="text-xs font-semibold text-gray-800 group-hover/item:text-purple-600 truncate transition-colors">{short_title}</h4>')
    print(f'        <p class="text-xs text-gray-500">第{num}场</p>')
    print(f'    </div>')
    print(f'    <i class="fas fa-chevron-right text-gray-300 text-xs opacity-0 group-hover/item:opacity-100 transition-opacity"></i>')
    print(f'</a>\n')
