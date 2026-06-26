---
title: "Obsidian Second Brain：让笔记库活过来"
summary: "25个命令 + 自动改写 + 定时Agent，让你的Obsidian变成会思考、敢反驳你、帮你连接一切的第二大脑"
tags:
  - Obsidian
  - Claude
  - 第二大脑
  - AI笔记
  - 知识管理
  - ClaudeCode
platform: all
---

# Obsidian Second Brain：让笔记库活过来

## 痛点

你每天用 Claude，每次都是从零开始。每次都要重新解释。聊完就消失。

你在 Obsidian 里记了几百条笔记。它们就躺在那里。你在另一个项目做了同样的决定，因为你想不起来半年前做过。

**两个强大工具，完全割裂。**

## 安装之后

**开会后**：`/obsidian-save` — Claude 把每个决定、人名、任务、想法提取出来，保存到对应的笔记里。你什么都不用做。

**录了语音备忘**：`/obsidian-ingest meeting.m4a` — Claude 转录、识别发言人、提取每个承诺和行动项，分配到实体页面、任务看板和日笔记。

**拍了白板照片**：`/obsidian-ingest photo.png` — Claude 读图，提取文字和结构，创建概念笔记，关联到相关项目。

**发现好视频**：`/obsidian-ingest https://youtube.com/...` — Claude 不是总结成一条笔记，而是**改写你现有的5-15个页面**。更新相关人物，化解矛盾，发现新模式。一个URL进去，知识库变聪明。

**做大决定前**：`/obsidian-challenge` — Claude 搜索你的知识库，找到同一话题的历史失败和反转决策。用你自己的话反驳你。

**想看全局**：`/obsidian-visualize` — Claude 生成整个知识库的视觉画布。枢纽节点居中，按类型着色，孤儿笔记高亮。

**你睡觉时**：夜间Agent运行5个阶段 — 收尾当天、调和矛盾、跨源综合、修复孤儿笔记、重建索引。

**新的一天**：`/obsidian-daily` — Claude 拉取日历事件、逾期任务和过夜变化到今日笔记。

**你不需要打开Obsidian。所有事情都通过Claude完成。**

## 25个命令

### 操作层 — Claude记住一切

- `/obsidian-save` — 保存对话中的所有内容
- `/obsidian-ingest` — 投入URL、PDF、音频、截图，Vault自我改写
- `/obsidian-synthesize` — 自动发现跨源模式并写综合页
- `/obsidian-reconcile` — 发现并解决矛盾
- `/obsidian-export` — 任何AI工具可读的JSON/markdown快照
- `/obsidian-daily` — 创建或更新今日笔记
- `/obsidian-log` — 记录工作会话
- `/obsidian-task` — 添加任务到对应看板
- `/obsidian-person` — 创建或更新人物笔记
- `/obsidian-decide` — 记录决策到对应项目笔记
- `/obsidian-capture` — 零摩擦想法捕获
- `/obsidian-find` — 带上下文的智能搜索
- `/obsidian-recap` — 天/周/月摘要
- `/obsidian-review` — 结构性周/月回顾
- `/obsidian-board` — 看板视图和更新
- `/obsidian-project` — 项目笔记含看板和日笔记链接
- `/obsidian-health` — 知识库审计
- `/obsidian-adr` — 决策记录
- `/obsidian-visualize` — 生成视觉画布地图
- `/obsidian-init` — 生成 `_CLAUDE.md`、`index.md`、`log.md`

### 思考层 — Claude和你一起思考

- `/obsidian-challenge` — 用你自己的历史反驳你的想法
- `/obsidian-emerge` — 发现30天笔记中你从未命名的隐藏模式
- `/obsidian-connect [A] [B]` — 桥接两个无关领域激发的火花
- `/obsidian-graduate` — 把想法碎片升级为完整项目含任务

### 上下文层 — Claude认识你

- `/obsidian-world` — 加载身份和状态，支持渐进式Token预算

## 知识库是活的

传统知识库是文件柜。你放东西进去，它们就躺在那里。

这个知识库会随着每次输入自我改写：

- **摄入一个来源** — 现有页面被改写，矛盾被解决，模式被综合
- **保存一次对话** — 实体、概念和决策分布到整个知识库
- **问一个问题** — 双输出规则意味着每个答案同时更新页面
- **事实发生变化** — 双时态事实追踪它何时为真、何时被知识库学习
- **什么都不做** — 后台Agent和维护Agent在你睡觉时保持运转
- **等一周** — 自动综合发现跨源模式并写连接页面

一周后的知识库和你最初建立时已经本质不同。

## 四种预设

| 预设 | 适用人群 | 看板风格 |
|---|---|---|
| executive | 创始人、运营者、管理者 | OKR/季度/周 |
| builder | 开发者、工程师、架构师 | 待办/Sprint/完成 |
| creator | 写作者、YouTuber、营销人 | 想法/草稿/已发布 |
| researcher | 学者、分析师、深度研究者 | 阅读/处理/综合 |

## 哲学

大多数第二大脑工具让你当管理员。

这个技能反转了这一点。你思考、工作、交谈。Claude处理记忆。然后它用那些记忆让你思考得更好——发现你会错过的、反驳你会假设的、连接你永远不会关联的、综合你没有要求的模式。

知识库不增长，它进化。

**你的笔记是护城河。**
