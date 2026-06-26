---
title: 592行代码，让AI自己操作浏览器！Self-healing神器
author: 元曜科技
summary: 592行 Python 代码，让 LLM 完全自由地完成任何浏览器任务。Self-healing 机制，Agent 发现缺函数自己写进去！免费远程浏览器支持。
tags:
  - AI浏览器
  - BrowserHarness
  - LLM工具
  - SelfHealing
  - Claude Code
  - CDP
  - 自动化工具
platform: wechat
date: 2026-04-22
source: https://github.com/browser-use/browser-harness
---

# 592行代码，让AI自己操作浏览器！Self-healing神器

> 「传统 AI 浏览器工具，框架臃肿，动不动就失败。Browser Harness 不一样。」

## 核心亮点

**Browser Harness** 是最简单的、self-healing 的 harness，让 LLM 能够完全自由地完成任何浏览器任务。

## Self-healing 原理

```
Agent 说要上传文件
→ helpers.py 缺 upload_file 函数
→ Agent 直接动手写进去
→ 继续执行
→ ✓ 文件上传成功
```

## 核心特性

| 特性 | 说明 |
|------|------|
| 🔧 Self-healing | Agent 发现缺函数，自己写进去 |
| ⚡ 极简架构 | 只有 592 行 Python 代码 |
| 🔌 CDP 直连 | 一个 WebSocket 连 Chrome |
| 🎯 Domain Skills | 可扩展的领域技能 |

## 免费远程浏览器

- 🌐 3 个并发浏览器
- �_proxy 代理支持
- 🤖 Captcha 解决
- 💰 完全免费

## 安装使用

GitHub 搜索 **browser-use/browser-harness**

复制 setup prompt 到 Claude Code：

```
Set up https://github.com/browser-use/browser-harness for me.
```

---

**AI 浏览器交互新范式！**

#AI浏览器 #BrowserHarness #LLM工具 #SelfHealing #ClaudeCode
