---
title: Claude 有记忆了！而且还通人性
summary: AgentRecall 是一个 AI 记忆和学习系统，让 AI 不仅记住信息，还能学习人类的思维方式。
author: 元曜科技
date: 2026-04-11
---

# Claude 有记忆了！而且还通人性

用 AI 编程，最烦的是什么？

每次都要重新解释项目背景。AI 重复同样的错误。纠正了 100 遍，下次还是犯。

**AgentRecall** 来了。

## 它解决什么问题？

不是简单的记忆工具，是一个**学习循环**。

记忆是机制，理解是目标。每次你纠正 AI——"不是那个版本"、"先问我"、"这不是我要的风格"——这些纠错都会被存储、加权，并在下次被召回。

## 三个使用方式

**MCP Server** - Claude Code、Cursor、Windsurf、VS Code、Codex
```bash
claude mcp add --scope user agent-recall -- npx -y agent-recall-mcp
```

**SDK** - 任何 JS/TS 应用
```typescript
import { AgentRecall } from "agent-recall-sdk";
```

**CLI** - 终端和 CI 工作流

## 核心特点

- **两个命令**：`/arsave` 保存，`/arstart` 加载
- **200行记忆上限**：新洞察要么合并，要么替换
- **跨项目召回**：一个项目的教训适用所有项目
- **零云端**：全部本地存储，无隐私担忧

## 效果对比

| 不用 AgentRecall | 用 AgentRecall |
|-----------------|----------------|
| 同样的错误重复10遍 | 纠错只发生一次 |
| 每次5分钟恢复上下文 | 2秒冷启动 |
| 知识困在一个项目 | 跨项目洞察 |

## 安装

一行命令：
```bash
claude mcp add --scope user agent-recall -- npx -y agent-recall-mcp
```

---

让 AI 学会你的思维方式，而不是每次都像培训新人。

**往期推荐**

- [Claude Code 实战技巧](#)
- [程序员效率工具清单](#)

*关注公众号「元曜科技」，发现更多编程干货*