# PromptLens 视频项目

> AI 视频提示词分析工具 - 反向解析AI视频提示词

## 项目信息

| 属性 | 值 |
|------|-----|
| **名称** | prompt-lens |
| **来源** | https://github.com/raojiacui/prompt-lens |
| **别名** | Prompt Analyzer |
| **创建时间** | 2026-04-22 |

## 项目概述

PromptLens 是一款 AI 视频提示词分析工具，能够反向解析 AI 视频提示词。

### 核心功能

丢进去一段视频，AI 自动：
1. 提取关键帧
2. 分析画面内容
3. 生成完整提示词
4. 提取台词、旁白文本

### 用户价值

- 再也不用对着视频瞎琢磨该怎么描述
- 视频里的台词、旁白直接提取成文本
- 做 AI 视频的必备利器

## 功能特性

| 功能 | 说明 |
|------|------|
| 📹 **视频分析** | 上传视频，AI 自动提取关键帧并分析 |
| 🖼️ **图片分析** | 支持单图或多图批量分析 |
| 🤖 **多 API 支持** | 智谱AI、Google Gemini、OpenRouter |
| 📝 **历史记录** | 保存和分析提示词历史 |
| 🔐 **用户系统** | Google 登录，数据隔离 |

## 技术栈

| 分类 | 技术 |
|------|------|
| 前端 | Next.js 15, React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| 后端 | Next.js API Routes |
| 数据库 | Supabase PostgreSQL, Drizzle ORM |
| 认证 | better-auth |
| 存储 | Backblaze B2 / Cloudflare R2 |
| 视频处理 | FFmpeg |

## 文件清单

```
prompt-lens-video/
├── docs/
│   ├── README.md              ✅ 项目首页
│   ├── article.md             ✅ 原始内容
│   ├── video-script.md        ✅ 视频脚本
│   ├── copy.md                ✅ 营销文案
│   ├── wechat-copy.md         ✅ 公众号文案
│   ├── posting-guide.md        ✅ 发布指南
│   ├── landing-page.html       ✅ 落地页
│   ├── article-page.html       ✅ 文章页
│   ├── wechat-page.html        ✅ 微信适配页
│   ├── session-log.md          ✅ 会话日志
│   ├── report.json             ✅ 执行报告
│   └── assets/
│       ├── cover.png           ✅ 视频号封面
│       ├── cover-wechat.png    ✅ 公众号封面
│       └── cover-xhs.png       ✅ 小红书封面
├── audio/
│   ├── neural_1_2x.m4a       ✅ 配音
│   └── subtitles.ass           ✅ 字幕
└── video-project/
    └── out/
        └── final-with-subs.mp4  ✅ 最终视频
```

## 安装使用

```bash
# 克隆项目
git clone https://github.com/raojiacui/prompt-lens.git
cd prompt-lens

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env

# 运行
pnpm dev
```

## 视频规格

| 属性 | 值 |
|------|-----|
| 分辨率 | 1080×1920 (9:16) |
| 帧率 | 60fps |
| 时长 | ~45秒 |
| 主题 | tech-modern |
| 语速 | 1.2x |
