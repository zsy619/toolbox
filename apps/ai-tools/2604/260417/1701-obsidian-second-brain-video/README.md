# Obsidian Second Brain 视频项目

> Claude Code Skill · Obsidian 笔记库 · 第二大脑 · GitHub 23,000+ Stars

## 项目概述

将 [obsidian-second-brain](https://github.com/eugeniughelbur/obsidian-second-brain) 项目制作成竖屏社交媒体视频。

## 核心卖点

- 25 个 Claude Code 命令，让 Obsidian 变成活的第二大脑
- 自动保存决策、语音备忘转录、白板照片知识化
- 夜间 Agent 自动运行 5 阶段：收尾当天、调和矛盾、跨源综合、修复孤儿笔记、重建索引
- `/obsidian-ingest` — 一个 URL，5-15 个页面同时被改写
- `/obsidian-challenge` — 用你自己的历史反驳你
- 你的笔记是护城河

## 文件结构

```
docs/
├── README.md          ← 本文档
├── article.md         ← 原始内容
├── video-script.md    ← 视频脚本
├── copy.md            ← 营销文案集
├── wechat-copy.md     ← 公众号文案
├── posting-guide.md   ← 多平台发布指南
├── landing-page.html  ← 宣传落地页
├── article-page.html  ← 文章阅读页
├── wechat-page.html   ← 公众号适配页
├── session-log.md     ← 会话日志
├── report.json        ← 执行报告
└── assets/
    ├── cover.png      ← 封面图 (PIL 生成)
    └── generate_cover.py  ← 封面生成脚本
```

## 视频规格

| 项目 | 值 |
|------|---|
| 时长 | 58.17s |
| 分辨率 | 1080×1920 |
| 帧率 | 60fps |
| 音频 | edge-tts 1.2x 语速 |
| 字幕 | ASS 烧录，PingFang SC 10px 黄色 |
| 主题 | 科技现代风 (tech-modern) |

## 场景时间轴

| 场景 | 时间 | 内容 |
|------|------|------|
| 封面 | 0-3.5s | Obsidian Second Brain 标题 |
| 痛点 | 3.5-11.6s | 每天从零开始、笔记躺着、两个工具割裂 |
| 功能 | 11.6-21s | 4 格展示：自动保存/语音备忘/白板照片/夜间Agent |
| 命令 | 21-39.6s | 25 个命令，/obsidian-ingest 亮点 |
| 进化 | 39.6-51.3s | 从文件柜到自我进化 |
| 结尾 | 51.3-58.2s | 一键安装 + 你的笔记是护城河 |

## 安装命令

```bash
curl -sL https://raw.githubusercontent.com/eugeniughelbur/obsidian-second-brain/main/scripts/quick-install.sh | bash
```

## 相关链接

- GitHub: https://github.com/eugeniughelbur/obsidian-second-brain
- 公众号: 元曜科技
- 小红书: 迪克猪的AI之旅
