# README — HTML Anything

## 项目概述

HTML Anything 是由 nexu-io 团队打造的智能HTML编辑器，核心理念：**Markdown是草稿，HTML才是最终体验**。

## 核心特性

| 特性 | 说明 |
|---|---|
| **零API成本** | 复用本地Claude Code、Cursor、Codex等8款AI编程工具 |
| **75种模板** | 覆盖杂志文章、演示文稿、海报、小红书卡片、网页原型等9大场景 |
| **一键导出** | 微信（CSS内联）、X/微博/小红书（PNG）、知乎（LaTeX） |
| **流式渲染** | SSE实时预览生成过程，随时中断重提 |
| **沙箱安全** | iframe隔离环境，Tailwind/Fonts可用，Cookie隔离 |

## 技术栈

- **框架**: Next.js + TypeScript
- **AI集成**: 8大编程CLI的会话复用
- **样式**: Tailwind CSS CDN
- **协议**: Apache-2.0

## 快速开始

```bash
git clone https://github.com/nexu-io/html-anything
cd html-anything
pnpm install
pnpm dev
# → http://localhost:3000
```

## 项目结构

```
html-anything/
├── src/
│   ├── app/              # Next.js App Router
│   ├── lib/
│   │   ├── agents/      # AI CLI适配器
│   │   └── templates/    # 75种技能模板
│   └── components/       # React组件
├── docs/                 # 文档和截图
├── public/               # 静态资源
└── SKILL.md             # 模板规范（参考Claude Code技能）
```

## 视频制作

本项目视频由 video-creator 技能自动生成：
- **分辨率**: 1080×1920 (9:16竖屏)
- **帧率**: 60fps
- **时长**: 约52秒
- **配音**: edge-tts zh-CN-YunjianNeural
- **字幕**: 内嵌烧录

## 相关链接

- GitHub: https://github.com/nexu-io/html-anything
- 团队: nexu-io/open-design (40k★)