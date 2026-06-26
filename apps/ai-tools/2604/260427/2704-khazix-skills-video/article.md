---
title: "Khazix Skills - 数字生命卡兹克的 AI 工具箱"
summary: "数字生命卡兹克开源的 AI Prompts 和 Skills 合集，包含深度研究框架 hv-analysis 和公众号写作 Skill khazix-writer"
tags:
  - AI工具
  - Prompts
  - Skills
  - 深度研究
  - 写作工具
  - 开源项目
platform: all
source: https://github.com/KKKKhazix/khazix-skills
---

# Khazix Skills

数字生命卡兹克的 AI 工具箱。这里是我自己在用的、经过长期打磨的 Prompts 和 Skills，现在决定把它们完整地、一字不改地开源出来。

两种东西，一个目的：把我积累的方法论变成可复用的工具。

## Prompts

**横纵分析法** — 通用深度研究框架，融合历时-共时分析与竞争战略视角，半小时出一份万字级研究报告。

用法：复制 Prompt，修改「研究对象」，丢进任何支持 Deep Research 的模型。

## Skills

### hv-analysis

横纵分析法深度研究 Skill，自动联网收集信息，纵向追时间深度 + 横向追竞争广度，最终输出排版精美的 PDF 研究报告。

### khazix-writer

卡兹克公众号长文写作 Skill，包含完整的写作风格规则、四层自检体系、内容方法论和风格示例库。

## 安装方式

### 通过 Agent 安装

在 Claude Code、Codex、OpenClaw 等支持 Skill 的 Agent 中，直接对话：

```
安装这个 skill：https://github.com/KKKKhazix/khazix-skills
```

### 手动安装

各工具的 Skills 安装路径：

| 工具 | 路径 |
|------|------|
| Claude Code | `~/.claude/skills/` |
| OpenClaw | `~/.openclaw/skills/` |
| Codex | `~/.agents/skills/` |

例如装 hv-analysis 到 Claude Code：

```bash
git clone https://github.com/KKKKhazix/khazix-skills.git
cp -r khazix-skills/hv-analysis ~/.claude/skills/
```
