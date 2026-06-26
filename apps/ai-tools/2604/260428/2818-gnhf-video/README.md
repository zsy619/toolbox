# gnhf 视频项目

## 项目概述

- **项目名称**: gnhf (Good Night, Have Fun) - AI 代码迭代循环工具
- **来源**: https://github.com/kunchenguid/gnhf
- **主题**: 让 AI 替你值夜班的代码自动迭代工具
- **标签**: AI, Claude Code, Codex, 自动迭代, Git, 开源

## 核心亮点

1. **一句话启动**: 输入一句指令，唤起 Claude Code 或 Codex，进入全自动代码迭代
2. **自动 Git 提交**: 每次成功修改都会生成独立的 Git 提交记录
3. **自动回滚重试**: 遇到运行报错自动回滚并重试，无需人工干预
4. **迭代记忆机制**: 每轮结果写入笔记文件供下一轮读取
5. **指数退避**: 连续失败自动退避，不会一直烧钱
6. **Worktree 多智能体**: 同时运行多个智能体，各自独立互不干扰

## 规格

- **分辨率**: 1080×1920（竖屏）
- **帧率**: 60fps
- **时长**: 约55秒
- **语速**: 1.2x
- **主题风格**: cyberpunk（赛博朋克）
- **字体**: 大字体（主标题100px+）
- **帧数**: ≥10帧

## 技术栈

- Node.js / npm
- Claude Code / Codex / Rovo Dev / OpenCode
- Git Worktree
- TypeScript

## 文件清单

```
gnhf-video/
├── docs/
│   ├── README.md
│   ├── article.md
│   ├── video-script.md
│   ├── copy.md
│   ├── wechat-copy.md
│   ├── posting-guide.md
│   ├── landing-page.html
│   ├── article-page.html
│   ├── wechat-page.html
│   ├── session-log.md
│   ├── report.json
│   └── assets/
│       ├── cover.png
│       ├── cover-wechat.png
│       └── cover-xiaohongshu.png
├── audio/
│   ├── neural_1_2x.m4a
│   └── subtitles.ass
└── video-project/
    └── out/
        └── final-with-subs.mp4
```

## 来源链接

- GitHub: https://github.com/kunchenguid/gnhf
- npm: https://www.npmjs.com/package/gnhf
- Discord: https://discord.gg/Wsy2NpnZDu
