---
title: bb-browser 你的浏览器就是API
summary: bb-browser用你的浏览器作为API，103个命令覆盖36个平台。Twitter、Reddit、GitHub、YouTube直接访问，无需key，支持MCP。
tags:
  - bb-browser
  - AI工具
  - 浏览器自动化
  - MCP
  - Claude Code
platform: all
source: https://github.com/epiral/bb-browser
---

# bb-browser 营销文案集

## 小红书版本

### 标题
你的浏览器就是 API！这个开源项目太强了 😱

### 正文
**bb-browser** 让你用浏览器作为 API！

✅ 不需要 API key
✅ 不需要爬虫
✅ 103 个命令，36 个平台
✅ MCP 支持，Claude Code 直接调用

Twitter、Reddit、GitHub、YouTube、知乎、雪球...全都能用！

```bash
npm install -g bb-browser
```

GitHub 搜索 bb-browser，4740 Stars！

#AI #开源 #浏览器自动化 #MCP #开发者工具

---

## 视频号版本

### 标题
bb-browser：让你的浏览器成为 AI 的眼睛！

### 摘要
bb-browser 用你的浏览器作为 API，让 AI 直接访问 Twitter、Reddit、GitHub 等网站，无需 key，支持 MCP。

### 正文
今天介绍 bb-browser。

**你的浏览器就是 API。**

不需要 key，不需要爬虫，AI 直接用你的登录状态访问任何网站。

**103 个命令，36 个平台：**
- 社交：Twitter、Reddit、Weibo
- 开发：GitHub、StackOverflow
- 视频：YouTube、Bilibili
- 金融：雪球、东方财富

**MCP 支持**，Claude Code 和 Cursor 直接调用。

```bash
npm install -g bb-browser
```

GitHub 搜索 bb-browser！

---

## 抖音版本

### 标题
这个开源项目太强了！让 AI 直接控制你的浏览器 🔥

### 正文
bb-browser，你的浏览器就是 API！

⚡ 不需要 API key
⚡ 103 个命令，36 个平台
⚡ MCP 支持，Claude Code 直接用

Twitter、GitHub、YouTube...全都能访问！

#AI #开源 #开发者工具 #浏览器

---

## 长文案版本

### 标题
bb-browser：让你的浏览器成为 AI 的 API

### 正文
今天介绍一个超强的开源工具：**bb-browser**。

### 痛点

AI 访问互联网的传统方式都有问题：
- **Playwright/Selenium**：Headless 浏览器，没有你的登录状态
- **爬虫库**：需要反向工程，容易被检测
- **官方 API**：99% 的网站根本没有 API

### 解决方案

bb-browser 的创新：**让机器直接使用人类的界面。**

- Adapter 在你的浏览器标签页内运行 `eval`
- 调用 `fetch()` 使用你的 cookies
- 网站以为是你在操作，因为**确实是你**

### 核心功能

**103 个命令，36 个平台**

```bash
bb-browser site twitter/search "AI agent"
bb-browser site zhihu/hot
bb-browser site github/search "rust"
bb-browser site youtube/transcript VIDEO_ID
```

**MCP 支持**

Claude Code 和 Cursor 可以直接调用：

```json
{
  "mcpServers": {
    "bb-browser": {
      "command": "npx",
      "args": ["-y", "bb-browser", "--mcp"]
    }
  }
}
```

### 快速开始

```bash
npm install -g bb-browser
bb-browser site zhihu/hot
```

GitHub 搜索 bb-browser，4740 Stars，MIT 开源！