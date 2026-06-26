# PromptLens 内容分析

## 1. 项目概述

**PromptLens** (Prompt Analyzer) 是一款 AI 视频提示词分析工具，能够反向解析 AI 视频提示词。

### 核心理念

> 做 AI 视频的必备利器，反向解析 AI 视频提示词！

### 解决什么问题

| 痛点 | PromptLens 解决方案 |
|------|---------------------|
| 不知道如何描述视频内容 | AI 自动分析画面 |
| 视频台词手动听写 | 自动提取台词、旁白 |
| 提示词写不准 | 生成完整提示词 |
| 不知道怎么模仿优秀作品 | 反向解析提示词 |

## 2. 核心功能

### 2.1 视频分析
- 上传视频
- AI 自动提取关键帧
- 分析画面内容
- 生成完整提示词

### 2.2 图片分析
- 支持单图分析
- 支持多图批量分析

### 2.3 音频识别
- 提取视频中的台词
- 提取旁白文本
- 转写为可编辑文本

### 2.4 多 API 支持
- 智谱AI
- Google Gemini
- OpenRouter

## 3. 技术架构

### 技术栈

| 分类 | 技术 |
|------|------|
| 前端 | Next.js 15, React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| 后端 | Next.js API Routes |
| 数据库 | Supabase PostgreSQL, Drizzle ORM |
| 认证 | better-auth (Google 登录) |
| 存储 | Backblaze B2 / Cloudflare R2 |
| 视频处理 | FFmpeg |

### 项目结构

```
prompt-analyzer/
├── app/                    # Next.js 应用
│   ├── api/               # API 路由
│   ├── dashboard/         # 主功能页面
│   └── login/             # 登录页面
├── components/            # React 组件
├── lib/                   # 核心库
│   ├── ai/                # AI 分析器
│   ├── auth/             # 认证配置
│   ├── cloudflare/       # R2 存储
│   └── db/               # 数据库
└── tests/                 # 测试文件
```

## 4. 使用流程

### Step 1: 上传视频
- 点击上传或拖拽文件
- 支持多种视频格式

### Step 2: 配置参数
- 选择提取帧数（默认 8 帧）
- 选择分析模式（逐帧/批量）

### Step 3: AI 分析
- 自动提取关键帧
- 分析画面内容
- 生成提示词

### Step 4: 获取结果
- 复制生成的提示词
- 查看历史记录

## 5. 关键信息提取

### 标题
PromptLens - AI 视频提示词反向解析工具

### 核心卖点
1. **反向解析** - 丢视频，得提示词
2. **自动提取** - 关键帧、画面分析、台词旁白
3. **多 API** - 智谱AI、Gemini、OpenRouter
4. **开源免费** - MIT 协议

### 目标用户
- AI 视频创作者
- 短视频从业者
- 内容策划
- 广告创意人员

### CTA
GitHub 搜索 raojiacui/prompt-lens
