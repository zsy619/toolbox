---
title: 工具推荐 | 让你的 AI 成为知识管家
author: 元曜科技
summary: LLM 每次回答都在重复工作？Obsidian LLM Wiki 让 LLM 构建持久化 wiki，知识编译一次保持最新。
tags:
  - AI工具
  - 知识管理
  - Obsidian
  - Claude Code
  - 效率提升
platform: wechat
date: 2026-04-22
---

# 工具推荐 | 让你的 AI 成为知识管家

> 「你知道吗？LLM 每次回答问题都在重复同样的工作。」

## 你是否也有这样的困扰？

每次向 AI 提问，它都要从海量文档中重新检索、重新推导。

- RAG 检索 → 片段拼接 → 重新推导
- 问一个需要综合 5 份文档的问题，AI 每次都要「从零开始」
- **没有知识积累，只有重复劳动**

## 解决方案：LLM Wiki

**Obsidian LLM Wiki** 采用了 Andrej Karpathy 的 LLM Wiki 理念：

LLM **持续构建和维护一个持久化的 wiki**——知识编译一次，然后**保持最新**，而非每次查询重新推导。

## 三层架构设计

| 层级 | 目录 | 说明 |
|------|------|------|
| Schema | CLAUDE.md | 配置层，告诉 LLM 如何工作 |
| Wiki | wiki/ | 可写层，LLM 生成和维护 |
| Raw | raw/ | 不可变层，原始资料（只读） |

### raw/ — 不可变原始资料

PDF、文章、网页剪藏、数据文件。LLM 只读取，绝不修改。这是事实来源。

### wiki/ — LLM 生成和维护

摘要、实体页面、概念页面、比较分析。LLM 完全拥有这一层——创建页面、更新页面、维护交叉引用、保持一致性。

### CLAUDE.md — 配置层

告诉 LLM wiki 的结构、约定、工作流的配置文件。

## Obsidian 集成

Obsidian 是这个方案的理想前端：

- **Obsidian 是 IDE，LLM 是程序员，wiki 是代码库**
- Wiki 链接 `[[标题]]` 实现页面间自然关联
- 图谱视图直观展示知识网络
- YAML frontmatter 让 Dataview 插件可以查询页面元数据

## 核心命令

| 命令 | 说明 |
|------|------|
| ingest | 处理新资料，集成到 wiki |
| query | 使用 wiki 回答问题 |
| lint | 健康检查：矛盾、孤立页面、缺失引用 |
| migrate | 迁移已有笔记到 LLM Wiki 模式 |
| index | 重建 index.md |

## 安装使用

1. 在 Claude Code 中输入 `/obsidian-llm-wiki`
2. Skill 会引导你初始化目录结构
3. 将原始资料放入 `raw/`
4. 运行 `/obsidian-llm-wiki ingest` 处理资料

## 号召行动

GitHub 搜索 **Lesterffx/obsidian-llm-wiki**

---

> 维护知识库的枯燥部分不是阅读或思考——而是簿记。LLM 不会厌倦，不会忘记更新交叉引用。
