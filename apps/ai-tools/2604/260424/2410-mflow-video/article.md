---
title: "M-Flow - AI 认知记忆引擎：Graph RAG 新范式"
summary: "中国19岁团队开发M-Flow认知记忆引擎，锥形图谱结构实现真正的联想，四个主流Benchmark全部第一，超越Mem0、Zep、Graphiti等竞品。"
tags:
  - M-Flow
  - AI记忆
  - Graph RAG
  - Agent
  - 认知科学
platform: all
source: https://github.com/FlowElement-ai/m_flow
---

# M-Flow - AI 认知记忆引擎：Graph RAG 新范式

## 项目概述

**M-Flow** 是中国19岁团队心流元素开发的认知记忆引擎，被称为 Graph RAG 新范式。

> **一句话理解**：真正的 Agent 记忆，不是搜索引擎，而是要像人一样从联想中获得启发。

## 核心创新：Cone Graph（锥形图谱）

M-Flow 实现了独特的四层锥形图谱结构：

| 层级 | 说明 |
|------|------|
| **Episode（情景）** | 完整的语义焦点——一个事件、决策过程或工作流程 |
| **Facet（切面）** | 把事件拆成若干截面——一个主题维度 |
| **FacetPoint（切面点）** | 最小颗粒的原子事实——三元组 |
| **Entity（实体）** | 人、项目、地点、产品——一条锚线串起所有层级 |

## Benchmark 成绩

四个主流榜单全部第一：

| 榜单 | 成绩 |
|------|------|
| LoCoMo | 第一 |
| LongMemEval | 第一 |
| EvolvingEvents | 第一 |
| 全面超越 | Mem0、Zep、Graphiti、Cognee、Supermemory |

## 核心理念：联想 ≠ 搜索

### 搜索
- 问的是："存起来的文本里，哪段跟我这个 query 最像？"
- 给你最相似的片段

### 联想
- 问的是："从这个线索出发，该有哪些上下文被重新激活？"
- 给你最该被想起来的情景

**M-Flow 赌的不是"搜得更准"，是"想得更对"。**

## 技术特点

### Graph-led retrieval
向量/混合搜索只打开入口点，最终相关性由**图传播**决定

### Evidence-path scoring
结果按**最强支持路径**排名，检索 = 图上的路径成本优化

### 认知记忆系统
- 在最尖锐的细节点捕获信号
- 通过结构化记忆追踪关联
- 像人类记忆一样到达正确答案

## 相关链接

- GitHub: https://github.com/FlowElement-ai/m_flow
- 官网: https://m-flow.ai
- 官网: https://flowelement.ai