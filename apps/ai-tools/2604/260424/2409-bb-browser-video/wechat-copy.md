---
title: bb-browser 你的浏览器就是API
author: 元曜科技
summary: bb-browser用你的浏览器作为API，103个命令覆盖36个平台。Twitter、Reddit、GitHub、YouTube直接访问，无需key，支持MCP。
tags:
  - bb-browser
  - AI工具
  - 浏览器自动化
  - MCP
  - Claude Code
platform: wechat
date: 2026-04-23
source: https://github.com/epiral/bb-browser
---

# bb-browser 你的浏览器就是 API

> 「不需要 key，不需要爬虫，AI 直接用你的登录状态访问任何网站」

## 痛点

AI 访问互联网的传统方式都有问题：

| 方式 | 问题 |
|------|------|
| Playwright/Selenium | Headless 浏览器，没有登录状态 |
| 爬虫库 | 需要反向工程，容易被检测 |
| 官方 API | 99% 的网站没有 API |

## 解决方案

bb-browser 的创新：**让机器直接使用人类的界面。**

Adapter 在你的浏览器标签页内运行，使用你的 cookies。网站以为是你在操作，因为**确实是你**。

## 核心功能

### 103 个命令，36 个平台

| 类别 | 平台 |
|------|------|
| 社交 | Twitter/X, Reddit, Weibo, 小红书 |
| 开发者 | GitHub, StackOverflow, HackerNews |
| 视频 | YouTube, Bilibili |
| 金融 | 雪球, 东方财富 |
| 知识 | Wikipedia, 知乎 |

### MCP 支持

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

## 使用示例

```bash
bb-browser site twitter/search "AI agent"    # 搜索推文
bb-browser site zhihu/hot                    # 知乎热榜
bb-browser site github/search "rust"         # 搜索 GitHub
bb-browser site youtube/transcript VIDEO_ID  # YouTube 字幕
```

## 快速开始

```bash
npm install -g bb-browser
bb-browser site update        # 更新适配器
bb-browser site recommend     # 推荐适配器
bb-browser site zhihu/hot     # 查看知乎热榜
```

---

**GitHub**: https://github.com/epiral/bb-browser

**Stars**: 4740 · **MIT 开源**

#bb-browser #AI工具 #浏览器自动化 #MCP