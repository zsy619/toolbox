---
title: "Hermes Workspace - WeChat 桥接工具"
summary: "在微信中直接与 Hermes Agent 交互，通过聊天控制 Agent、接收结果，适合日常自动化和消息场景"
tags:
  - AI工具
  - WeChat桥接
  - Hermes Agent
  - 微信自动化
  - 消息场景
  - 开源项目
platform: all
source: https://github.com/outsourc-e/hermes-workspace
---

# Hermes Workspace

Your AI agent's command center — chat, files, memory, skills, and terminal in one place.

## 核心特性：WeChat 桥接

Hermes Workspace 支持通过 WeChat 与 Hermes Agent 直接交互：

- **微信聊天控制** — 在微信中发送指令，Agent 自动执行
- **实时结果推送** — Agent 处理完成后自动推送结果到微信
- **日常自动化** — 适合日程管理、信息查询、任务提醒等场景

## 主要功能

### 🤖 Hermes Agent 集成
- 直接网关连接，实时 SSE 流
- 支持 OpenAI 兼容后端

### 🎨 8 主题系统
- Official、Classic、Slate、Mono
- 每种主题都有亮色和暗色模式

### 🔒 安全加固
- 所有 API 路由认证中间件
- CSP headers
- 执行审批提示

### 📱 移动端优先 PWA
- 通过 Tailscale 在任何设备上获得完整功能

### ⚡ 实时 SSE 流
- Agent 输出实时推送
- 工具调用渲染

### 🧠 记忆与技能
- 浏览、搜索、编辑 Agent 记忆
- 探索 2000+ 技能

## 系统要求

- Node.js 22+
- OpenAI 兼容后端
- 可选：Python 3.11+（本地运行 Hermes 网关）

## 安装

### Docker 一键部署
```bash
git clone https://github.com/outsourc-e/hermes-workspace.git
cd hermes-workspace
cp .env.example .env
# 编辑 .env 添加 API Key
docker compose up
```

### 开发模式
```bash
git clone https://github.com/outsourc-e/hermes-workspace.git
cd hermes-workspace
pnpm install
cp .env.example .env
pnpm dev
```

## 技术栈

- Node.js 22+
- TypeScript
- PWA (Progressive Web App)
- Docker
- SSE (Server-Sent Events)
