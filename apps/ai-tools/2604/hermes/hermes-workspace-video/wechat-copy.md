---
title: "在微信里直接控制AI助手！这个开源工具太牛了"
summary: "Hermes Workspace WeChat桥接工具，通过微信聊天与Hermes Agent交互，控制Agent执行任务、接收结果，适合日常自动化和消息场景"
tags:
  - AI工具
  - WeChat桥接
  - Hermes Agent
  - 微信自动化
  - 消息场景
source: https://github.com/outsourc-e/hermes-workspace
---

# 在微信里直接控制AI助手！这个开源工具太牛了

你有没有遇到过这种情况：

- 在外面收到工作消息，要打开电脑才能处理
- 想让 AI 助手帮忙查东西，得专门打开对话界面
- 任务执行完了还得手动去查看结果

今天推荐一个开源工具 **Hermes Workspace**，它可以让你直接在**微信里**控制你的 AI 助手！

## WeChat × Hermes Agent 桥接

这个工具最牛的地方就是 **WeChat 桥接功能**：

**在微信中发送指令** → Hermes Agent 自动执行 → **结果实时推送回微信**

就像有了一个 24 小时在线的 AI 助理，随时响应你的微信消息。

## 适用场景

- **📅 日程管理**：发条微信，帮你安排日程
- **🔍 信息查询**：问一句，返回你需要的信息
- **⏰ 任务提醒**：设置提醒，自动推送到微信
- **📁 文件处理**：让 Agent 处理文件，结果发给你

## 技术特点

- **⚡ 实时 SSE 流**：Agent 输出实时推送，零延迟
- **🔒 安全认证**：所有 API 路由认证，数据安全
- **📱 PWA 支持**：手机电脑都能用，体验原生 App
- **🐳 Docker 一键部署**：一条命令启动

## 快速上手

```bash
git clone https://github.com/outsourc-e/hermes-workspace.git
cd hermes-workspace
cp .env.example .env
docker compose up
```

打开 http://localhost:3000 配置 WeChat 桥接，就能开始用了！

---

项目完全开源免费，GitHub 地址：
https://github.com/outsourc-e/hermes-workspace

如果你觉得有用，点个**在看**或者**转发**给需要的朋友！

我是书彦，持续分享 AI 工具和效率技巧 🚀
