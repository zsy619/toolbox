---
title: 在浏览器里用AI Agent：Hermes WebUI 深度解析
author: 元曜科技
summary: 轻量暗色主题Web UI，在浏览器中完整复刻CLI体验，三栏界面集成会话列表、聊天窗口和文件浏览器，实时查看上下文Token使用。
tags:
  - Hermes WebUI
  - Web UI
  - AI Agent
  - 浏览器
platform: wechat
date: 2026-04-24
source: https://github.com/nesquena/hermes-webui
---

# 在浏览器里用AI Agent：Hermes WebUI 深度解析

> 「轻量暗色主题，三栏界面复刻CLI体验」

## 什么是 Hermes WebUI？

Hermes WebUI 是一款轻量级、暗色主题的 Web 应用，在浏览器中完整复刻 CLI 体验。三栏界面集成会话列表、聊天窗口和文件浏览器。

## 核心特性

### 三栏布局
| 位置 | 功能 |
|------|------|
| 左侧边栏 | 会话列表和导航 |
| 中间 | 聊天窗口 |
| 右侧 | 工作区文件浏览器（支持内联预览） |

### Composer Footer
- 模型选择
- Profile 配置
- Workspace 控制
- 始终可见

### Token 用量环
- 圆形上下文环
- 实时显示 token 使用情况

### Hermes Control Center
- 所有设置
- 会话工具
- 启动器在侧边栏底部

## 技术亮点

- **轻量暗色主题**：无需构建步骤
- **无框架**：纯 Python + 原生 JavaScript
- **完整对等**：CLI 能做的，UI 都能做
- **SSH 隧道安全访问**：单一命令启动

## 快速开始

```bash
git clone https://github.com/nesquena/hermes-webui.git
cd hermes-webui
python3 bootstrap.py
```

---

**GitHub 搜索 nesquena/hermes-webui，体验浏览器里的 AI Agent！**

#HermesWebUI #WebUI #AIAgent #浏览器
