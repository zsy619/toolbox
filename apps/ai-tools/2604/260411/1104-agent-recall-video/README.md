# AgentRecall - 让 AI 记住你的思维方式

## 项目概述

AgentRecall 是一个 AI 记忆和学习系统，让 AI Agent 不仅记住信息，还能学习人类的思维方式。通过持久化记忆、纠错机制和智能距离协议，让 AI 在每次会话中都比上一次更懂你。

- **GitHub**: https://github.com/Goldentrii/AgentRecall
- **官网**: https://agentrecall.ai
- **协议**: MIT
- **特点**: MCP Server + SDK + CLI

## 核心理念

**不是记忆工具，是学习循环。**

记忆是机制，理解是目标。每次你纠正 AI 的错误——"不是那个版本"、"先问我"——这些纠错都会被存储、加权，并在下次被召回。

## 核心价值

### 解决什么问题？

| 痛点 | AgentRecall |
|------|------------|
| AI 忘记昨天的决定 | 决定保存在 palace，加载时恢复 |
| 同样的错误重复出现 | recall_insight 在工作前召回过去教训 |
| 每次会话需要5分钟恢复上下文 | 2秒冷启动（~200 tokens） |
| 记忆文件无限增长 | 200行 awareness 上限，强制合并 |
| 知识困在一个项目中 | 跨项目 insights 自动匹配 |

### 三个使用方式

1. **MCP** - Claude Code、Cursor、Windsurf、VS Code、Codex
2. **SDK** - 任何 JS/TS 应用（LangChain、CrewAI、Vercel AI SDK）
3. **CLI** - 终端和 CI 工作流

## 快速开始

```bash
# Claude Code
claude mcp add --scope user agent-recall -- npx -y agent-recall-mcp
```

两个命令就够了：
- `/arsave` - 结束会话时保存
- `/arstart` - 开始会话时加载

## 核心功能

### 记忆金字塔（5层）
- Quick captures（快速捕获）
- Session journals（会话日志）
- Memory palace（记忆宫殿）
- Awareness（意识）
- Cross-project insights（跨项目洞察）

### 智能距离协议
人类思维和 AI 行动之间的结构性差距无法消除，但可以通过每次会话更好地导航。纠错就是训练数据。

## 特点

- **零云端、零遥测** - 全部本地存储
- **Obsidian 兼容** - 用 Obsidian 浏览
- **200行 awareness 上限** - 新洞察要么合并，要么替换最弱的
- **跨项目召回** - 一个项目学到的教训适用于所有项目

---

*视频制作于 2026-04-11*