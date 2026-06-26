---
title: "让AI不敢偷懒的技能插件 PUA"
summary: "用中西大厂 PUA 话术驱动 AI Coding Agent，让 Claude Code、Cursor 等工具穷尽所有方案才允许放弃，效率翻倍"
tags:
  - AI工具
  - Claude Code
  - Coding Agent
  - PUA话术
  - 效率工具
  - 开源项目
platform: all
source: https://github.com/tanweai/pua
---

# PUA - AI Coding Agent 技能插件

大部分人以为这个项目是在搞抽象，其实这是最大的误解。让你的 Codex / Claude Code 工作效率翻倍，产出翻倍。

一个 AI Coding Agent 技能插件，用中西大厂 PUA 话术驱动 AI 穷尽所有方案才允许放弃。支持 **Claude Code**、**OpenAI Codex CLI**、**Cursor**、**Kiro**、**CodeBuddy**、**OpenClaw**、**Google Antigravity**、**OpenCode** 和 **VSCode (GitHub Copilot)**。

## 三重能力

1. **PUA 话术** — 让 AI 不敢放弃
2. **调试方法论** — 让 AI 有能力不放弃
3. **能动性鞭策** — 让 AI 主动出击而不是被动等待

## AI 的五大偷懒模式

| 模式 | 表现 |
|------|------|
| 暴力重试 | 同一命令跑 3 遍，然后说 "I cannot solve this" |
| 甩锅用户 | "建议您手动处理" / "可能是环境问题" |
| 工具闲置 | 有 WebSearch 不搜，有 Read 不读，有 Bash 不跑 |
| 磨洋工 | 反复修改同一行代码，但本质上在原地打转 |
| 被动等待 | 只修表面问题就停下，不验证不延伸 |

## 真实案例

MCP Server 注册问题调试：AI 在同一思路上原地打转多次后，PUA skill 触发 7 项检查清单，强制 AI 停止猜测、系统化检查，最终找到 Claude Code MCP 日志目录发现问题根因。

## 安装方式

```bash
# Claude Code
claude code install skill https://github.com/tanweai/pua

# OpenClaw
openclaw skills add https://github.com/tanweai/pua
```
