# Claude-Mem - AI 编程的持久化记忆系统

## 项目概述

Claude-Mem 是一个为 Claude Code 构建的持久化内存压缩系统，通过自动捕获工具使用观察、生成语义摘要，使 AI 能够在会话结束或重新连接后仍保持对项目的知识连续性。

- **官网**: https://docs.claude-mem.ai/
- **GitHub**: https://github.com/thedotmack/claude-mem
- **版本**: 6.5.0
- **协议**: AGPL-3.0

## 核心特性

- 🧠 **持久化内存** - 上下文跨会话保留
- 📊 **渐进式披露** - 分层内存检索，具有令牌成本可见性
- 🔍 **基于技能的搜索** - 使用 mem-search 技能查询项目历史
- 🖥️ **Web 查看器界面** - 在 http://localhost:37777 实时查看内存流
- 💻 **Claude Desktop 技能** - 从 Claude Desktop 对话中搜索内存
- 🔒 **隐私控制** - 使用 `<private>` 标签排除敏感内容
- ⚙️ **上下文配置** - 精细控制注入的上下文内容
- 🤖 **自动操作** - 无需手动干预

## 工作原理

**核心组件:**
1. **6 个生命周期钩子** - SessionStart、UserPromptSubmit、PostToolUse、Stop、SessionEnd
2. **Worker 服务** - 在端口 37777 上的 HTTP API
3. **SQLite 数据库** - 存储会话、观察、摘要
4. **Chroma 向量数据库** - 混合语义 + 关键词搜索

## 快速开始

```
> /plugin marketplace add thedotmack/claude-mem
> /plugin install claude-mem
```

重启 Claude Code，来自先前会话的上下文将自动出现。

## 系统要求

- Node.js: 18.0.0 或更高
- Claude Code: 支持插件的最新版本
- Bun: JavaScript 运行时和进程管理器
- uv: Python 包管理器（用于向量搜索）

---

*视频制作于 2026-04-11*