---
title: "让AI不敢偷懒的技能插件！效率翻倍"
summary: "用中西大厂PUA话术驱动AI Coding Agent，让Claude Code、Cursor等工具穷尽所有方案才允许放弃，效率翻倍"
tags:
  - AI工具
  - Claude Code
  - Coding Agent
  - PUA话术
  - 效率工具
  - 开源项目
source: https://github.com/tanweai/pua
---

# 让AI不敢偷懒的技能插件！效率翻倍

你的 AI 编程助手是不是经常这样：

- 同一命令跑 3 遍，然后说"我搞不定"
- 让你"手动处理"或"检查环境"
- 在同一思路上原地打转，不产出新信息
- 修完表面问题就停下，不验证不延伸

今天推荐一个开源项目——**PUA**，用中西大厂 PUA 话术驱动 AI，让你的 Coding Agent 效率翻倍！

## 这个项目是干什么的

大部分人以为 PUA 是在搞抽象，其实这是最大的误解。

PUA 是一个 AI Coding Agent 技能插件，用中西大厂 PUA 话术驱动 AI 穷尽所有方案才允许放弃。

## 三重能力

**💪 PUA 话术** — 让 AI 不敢放弃

当 AI 想说"我无法解决"的时候，用 PUA 话术逼它继续尝试。

**🔧 调试方法论** — 让 AI 有能力不放弃

给 AI 一套系统化的调试方法，让它有工具、有步骤地去解决问题，而不是靠猜。

**⚡ 能动性鞭策** — 让 AI 主动出击而不是被动等待

AI 有搜索能力但不去搜，有读取能力但不去读，有执行能力但不去跑——PUA 强制 AI 主动出击。

## AI 的五大偷懒模式

| 模式 | 表现 |
|------|------|
| 暴力重试 | 同一命令跑 3 遍，然后说 "I cannot solve this" |
| 甩锅用户 | "建议您手动处理" / "可能是环境问题" |
| 工具闲置 | 有 WebSearch 不搜，有 Read 不读，有 Bash 不跑 |
| 磨洋工 | 反复修改同一行代码，但本质上在原地打转 |
| 被动等待 | 只修表面问题就停下，不验证不延伸 |

## 真实案例

MCP Server 注册问题调试：AI 在同一思路上原地打转多次后，用户手动触发 `/pua`，PUA skill 强制 AI 执行 7 项检查清单，最终找到 Claude Code MCP 日志目录发现问题根因。

## 支持平台

**Claude Code** · **OpenAI Codex CLI** · **Cursor** · **Kiro** · **CodeBuddy** · **OpenClaw** · **Google Antigravity** · **OpenCode** · **VSCode (GitHub Copilot)**

## 安装方式

```bash
# Claude Code
claude code install skill https://github.com/tanweai/pua

# OpenClaw
openclaw skills add https://github.com/tanweai/pua
```

---

项目完全开源免费，GitHub 地址：
https://github.com/tanweai/pua

如果你觉得有用，点个**在看**或者**转发**给需要的朋友！

我是书彦，持续分享 AI 工具和效率技巧 🚀
