---
title: "卡兹克开源的 AI 工具箱！研究效率提升 10 倍"
summary: "数字生命卡兹克开源 AI Prompts 和 Skills 合集，包含深度研究框架 hv-analysis 和公众号写作工具 khazix-writer"
tags:
  - AI工具
  - Prompts
  - Skills
  - 深度研究
  - 写作工具
  - 开源项目
source: https://github.com/KKKKhazix/khazix-skills
---

# 卡兹克开源的 AI 工具箱！研究效率提升 10 倍

你有没有遇到过这些问题：

- 研究一份报告要花半天时间，搜集资料、整理分析、撰写成文，流程太长了
- 写公众号长文总是不够深度，写着写着就没东西可写了
- AI 助手用了一堆，但真正能解决实际问题的没几个

今天推荐一个开源项目——**Khazix Skills**，数字生命卡兹克的 AI 工具箱。

## 两类工具：一个目的

这个仓库包含两类工具：

**💡 Prompts（轻量级）**

- 复制粘贴到任何 AI 对话或 Deep Research 里就能用
- 横纵分析法：通用深度研究框架，融合历时-共时分析与竞争战略视角

**⚙️ Skills（重量级）**

- 遵循 Agent Skills 开放标准，安装后 Agent 自动加载
- 包含完整的方法论和工具链

## 核心 Skill：hv-analysis

**横纵分析法深度研究 Skill**，这是卡兹克的核心作品之一。

功能：
- 自动联网收集信息
- 纵向追时间深度（历史演变、发展脉络）
- 横向追竞争广度（竞争对手、市场格局）
- 最终输出排版精美的 PDF 研究报告

半小时出一份万字级研究报告，研究效率直接拉满。

## 核心 Skill：khazix-writer

**公众号长文写作 Skill**，包含：

- 完整的写作风格规则
- 四层自检体系
- 内容方法论
- 风格示例库

让你写长文不再词穷，逻辑清晰、深度够用。

## 超简单的安装方式

**通过 Agent 安装**（推荐）

在 Claude Code、Codex、OpenClaw 等支持 Skill 的 Agent 中，直接对话：

> 安装这个 skill：https://github.com/KKKKhazix/khazix-skills

**手动安装**

```bash
git clone https://github.com/KKKKhazix/khazix-skills.git
cp -r khazix-skills/hv-analysis ~/.claude/skills/
```

支持 Claude Code、OpenClaw、Codex 等主流 Agent 工具。

---

项目完全开源，MIT License，GitHub 地址：
https://github.com/KKKKhazix/khazix-skills

如果你觉得有用，点个**在看**或者**转发**给需要的朋友！

我是书彦，持续分享 AI 工具和效率技巧 🚀
