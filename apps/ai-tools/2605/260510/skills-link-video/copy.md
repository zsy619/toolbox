# Skills-Link 营销文案集

## 短文案

一个文件夹，41+AI应用共享skills！Skills-Link用符号链接方案，让所有AI编程工具共用一个Master目录，新增一个skill所有应用立即可见。

---

**标签**: #AI #编程工具 #Claude #Cursor #skills同步 #GitHub

---

## 中文案（公众号/小红书）

---
title: 工具推荐 | 一个文件夹，41+AI应用共享skills！
author: 元曜科技
summary: Skills-Link 用符号链接方案，让所有 AI 编程工具的 skills 共享同一个 Master 目录，41+ Agent 支持，跨设备同步。
tags:
  - AI
  - 编程工具
  - Claude
  - Cursor
  - skills同步
  - GitHub
  - 开源
platform: wechat
date: 2026-04-27
---

# 工具推荐 | 一个文件夹，41+AI应用共享skills！

每个AI编程工具都要单独配置skills？

Claude Code一套，Cursor另一套，Windsurf又一套……改一次要同步41个地方？

## 为什么关注这个？

Skills-Link 用符号链接方案，让所有AI应用的skills共享同一个Master目录。

核心思路：**~/AISkills/ 作为唯一数据源，所有app链接到这里。**

## 核心功能

### 41+ AI Agent 支持

Claude Code, Cursor, Windsurf, Cline, Gemini CLI, Trae, Roo Code, Continue, GitHub Copilot, Goose, OpenClaw, Qwen Code, Kimi Code CLI, Kiro CLI, Felo, Augment, Zed, Julep, Mistral Vibe, Droid 等。

### 符号链接方案

每个 app 的 `~/.xxx/skills` 变成指向 ~/AISkills/ 的符号链接。新增或编辑一个 skill，所有应用立即可见。

### 跨设备同步

```bash
# 电脑A — 推送skills到GitHub
skills-link sync

# 电脑B — 克隆并链接
skills-link  # 自动从远程拉取
```

### rules-link 支持

同时支持 rules 同步，一条命令搞定 rules-link。

## 安装使用

```bash
npm i -g skills-link
skills-link
```

首次运行自动引导：检测应用、导入skills、创建链接。

## 号召行动

GitHub: https://github.com/shanliuling/skills-link

---

**标签**: #AI #编程工具 #Claude #Cursor #skills同步 #GitHub #开源