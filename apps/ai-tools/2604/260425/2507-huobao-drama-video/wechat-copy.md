---
title: 这个开源 AI 项目，5 分钟制作一部短剧！
author: 元曜科技
summary: 基于 TypeScript 全栈的 AI 短剧自动化生产平台，从剧本到成片全流程自动化。
tags:
  - 火宝短剧
  - AI短剧
  - TypeScript
  - 视频生成
platform: wechat
date: 2026-04-23
source: https://github.com/chatfire-AI/huobao-drama
---

# 这个开源 AI 项目，5 分钟制作一部短剧！

> 「输入剧本，AI 自动生成完整短剧视频」

在短视频时代，短剧成为新的流量入口。但传统短剧制作周期长、成本高，让很多创作者望而却步。

今天给大家介绍一个开源项目——**火宝短剧**，它能让你只需输入剧本，AI 就能自动生成完整的短剧视频。

## 什么是火宝短剧？

火宝短剧（Huobao Drama）是一个基于 AI 的短剧自动化生产平台，实现从剧本生成、角色设计、分镜制作到视频合成的全流程自动化。

## 核心功能

### AI 角色生成
支持 AI 自动生成角色形象和场景背景，还支持角色音色分配与试听。

### 智能分镜拆解
内置 5 个专业 Mastra Agent，自动将剧本拆解为分镜序列，智能提取角色和场景信息。

### 多模型支持

| 类型 | 支持的模型 |
|------|-----------|
| 图片 | OpenAI、Gemini、MiniMax、火山引擎、阿里 |
| 视频 | MiniMax、火山引擎/Seedance、Vidu、阿里 |
| TTS | MiniMax |

### 一键视频合成
FFmpeg 单镜头合成，支持整集拼接导出。

## 技术架构

- **前端**：Nuxt 3 + Vue 3 + TypeScript
- **后端**：Hono + Drizzle ORM + Mastra AI Agents
- **部署**：Docker 一键部署

## 快速上手

```bash
# 克隆项目
git clone https://github.com/chatfire-AI/huobao-drama.git

# Docker 部署
docker compose up -d
```

---

**GitHub 搜索 huobao-drama，让 AI 帮我们做更有创造力的事！**

#火宝短剧 #AI短剧 #开源项目 #短视频
