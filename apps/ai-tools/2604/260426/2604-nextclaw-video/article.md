# NextClaw 项目分析

## 项目基本信息

| 参数 | 值 |
|------|------|
| 项目名称 | NextClaw |
| 类型 | AI 个人助手 / Agent 框架 |
| 来源 | GitHub |
| 协议 | MIT |

## 核心定位

NextClaw: Your omnipotent personal assistant, residing above the digital realm.
灵感来自 OpenClaw，完全兼容其插件生态。

## 核心特性

### AI 提供商支持（12+）
OpenRouter, OpenAI, Anthropic, Gemini, DeepSeek, Groq, MiniMax, Moonshot, DashScope, Zhipu, AiHubMix, vLLM

### 消息频道支持（10+）
Discord, Telegram, Slack, WhatsApp, 飞书, 钉钉, 企业微信, QQ, 微信, Email, Mochat

### 内置自动化
- Cron 定时任务
- Heartbeat 心跳自主任务

### 本地化 & 隐私
- 完全运行在本地机器
- 配置、历史记录、Token 全部本地存储

### 轻量级
- 代码量约为 OpenClaw 的 1/20
- 更易维护和扩展

## 快速开始

```bash
npm i -g nextclaw
nextclaw start
# 访问 http://127.0.0.1:55667/
```

## 截图展示

| 截图 | 说明 |
|------|------|
| nextclaw-chat.png | 聊天界面 |
| nextclaw-providers.png | AI 提供商配置 |
| nextclaw-channels.png | 消息频道管理 |