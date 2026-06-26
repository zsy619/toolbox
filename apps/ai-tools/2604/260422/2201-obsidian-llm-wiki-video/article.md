# Obsidian LLM Wiki 内容分析

> 来源：https://github.com/Lesterffx/obsidian-llm-wiki

## 项目概述

用 LLM 持续维护 Obsidian 知识库的 Claude Code 全局 Skill。基于 raw/wiki/schema 三层架构，让 LLM 承担知识库的整理、交叉引用和更新工作。

## 灵感来源

本方案灵感来自 Andrej Karpathy 的 llm-wiki 知识管理理念。

Karpathy 的核心洞察：大多数人使用 LLM 处理文档的方式是 RAG —— 每次查询时从原始文档中检索片段、重新推导答案。这种方式没有知识积累。

LLM Wiki 的做法不同：LLM **持续构建和维护一个持久化的 wiki** —— 知识编译一次，然后**保持最新**，而非每次查询重新推导。

## 三层架构设计

```
┌─────────────────────────────────────────┐
│  Schema (CLAUDE.md)                     │  配置层
├─────────────────────────────────────────┤
│  wiki/                                  │  可写层
├─────────────────────────────────────────┤
│  raw/                                   │  不可变层
└─────────────────────────────────────────┘
```

- **raw/** — 不可变原始资料。PDF、文章、网页剪藏、数据文件。LLM 只读取，绝不修改。
- **wiki/** — LLM 生成的 markdown 文件。摘要、实体页面、概念页面、比较分析、综合报告。
- **Schema (CLAUDE.md)** — 告诉 LLM wiki 的结构、约定、工作流的配置文件。

## Obsidian 集成

Obsidian 是这个方案的理想前端：

- **Obsidian 是 IDE，LLM 是程序员，wiki 是代码库。**
- **Wiki 链接 `[[标题]]`** 实现页面间的自然关联，图谱视图直观展示知识网络。
- **YAML frontmatter** 让 Dataview 插件可以查询页面元数据。

## 命令一览

| 命令 | 说明 |
|------|------|
| `/obsidian-llm-wiki ingest <来源>` | 处理新资料，集成到 wiki |
| `/obsidian-llm-wiki query <问题>` | 使用 wiki 回答问题 |
| `/obsidian-llm-wiki lint` | 健康检查 |
| `/obsidian-llm-wiki migrate` | 迁移已有笔记 |
| `/obsidian-llm-wiki index` | 重建 index.md |

## 使用场景

- 读书笔记管理
- AI/技术知识整理
- 项目文档维护
- 投资研究笔记
- 任何需要长期维护的知识库

## 限制条件

- 绝不修改 raw/ 下的文件
- 覆盖已有 wiki 内容前须用户确认
- log.md 条目 append-only
- 保持中文为主要内容语言
