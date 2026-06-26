---
title: "bb-browser - 你的浏览器就是 API"
summary: "bb-browser 用你的浏览器作为 API，103个命令覆盖36个平台。Twitter、Reddit、GitHub、YouTube 直接访问，无需 key，支持 MCP。"
tags:
  - bb-browser
  - AI工具
  - 浏览器自动化
  - MCP
  - Claude Code
  - 开源
platform: all
source: https://github.com/epiral/bb-browser
---

# bb-browser - 你的浏览器就是 API

## 项目概述

**bb-browser** (BadBoy Browser) 是一个 CLI + MCP server，让 AI agent 直接控制你的 Chrome 浏览器，使用你的登录状态。

> **一句话理解**：你的浏览器就是 API，不需要 key，不需要爬虫，AI 直接用你的登录状态访问任何网站。

## 核心概念

### 传统方式的问题

| 方式 | 问题 |
|------|------|
| Playwright/Selenium | Headless 浏览器，没有登录状态 |
| 爬虫库 | 需要反向工程，容易被检测 |
| 官方 API | 99% 的网站没有 API |

### bb-browser 的创新

**让机器直接使用人类的界面。**

- Adapter 在你的浏览器标签页内运行 `eval`
- 调用 `fetch()` 使用你的 cookies
- 网站以为是你在操作，因为**确实是你**

## 核心功能

### 103 个命令，36 个平台

```bash
bb-browser site twitter/search "AI agent"    # 搜索推文
bb-browser site zhihu/hot                    # 知乎热榜
bb-browser site arxiv/search "transformer"   # 搜索论文
bb-browser site github/search "rust"         # 搜索 GitHub
bb-browser site youtube/transcript VIDEO_ID  # YouTube 字幕
bb-browser site boss/search "AI engineer"   # 搜索职位
```

### MCP 支持 (Claude Code / Cursor)

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

### OpenClaw 集成

```bash
bb-browser site reddit/hot --openclaw
bb-browser site xueqiu/hot-stock 5 --openclaw
```

## 支持的平台

| 类别 | 平台 |
|------|------|
| 搜索 | Google, Baidu, Bing, DuckDuckGo |
| 社交 | Twitter/X, Reddit, Weibo, 小红书, 微博, LinkedIn |
| 开发者 | GitHub, StackOverflow, HackerNews, CSDN, V2EX, npm |
| 视频 | YouTube, Bilibili |
| 金融 | 雪球, 东方财富, Yahoo Finance |
| 知识 | Wikipedia, 知乎, Open Library |
| 工作 | BOSS直聘, LinkedIn |

## 快速开始

```bash
# 安装
npm install -g bb-browser

# 使用
bb-browser site update        # 更新适配器
bb-browser site recommend     # 推荐适配器
bb-browser site zhihu/hot     # 查看知乎热榜
```

## 架构

```
AI Agent (Claude Code, Codex, Cursor)
       │ CLI or MCP (stdio)
       ▼
bb-browser CLI ──HTTP──▶ Daemon ──CDP WebSocket──▶ Your Real Browser
```

## 开源信息

- **GitHub**: https://github.com/epiral/bb-browser
- **Stars**: 4740
- **License**: MIT