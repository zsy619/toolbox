---
title: "design.md - Design Tokens 的双层结构革命"
summary: "Google Labs 推出 design.md 格式规范，用机器可读 token + 人类可读 rationale 的双层结构，让 AI 既获取精确值，又理解设计意图。"
tags:
  - Design Tokens
  - Google Labs
  - 设计系统
  - YAML
  - W3C DTCG
platform: all
source: https://github.com/google-labs-co/design.md
---

# design.md - Design Tokens 的双层结构革命

## 项目概述

**design.md** 是 Google Labs 推出的设计 token 格式规范，核心创新是"机器可读 token + 人类可读 rationale"的双层结构。

> **一句话理解**：design.md 让 AI 既能获取精确的设计值，又能理解为什么这样设计。

## 核心格式

### 1. YAML Front Matter（机器层）

顶部用 `---` 包裹的 YAML 定义精确的设计 token：

```yaml
---
colors:
  primary: "#1A1C1E"
  secondary: "#3B82F6"
typography:
  fontFamily: "Inter"
  fontSize: 16
  fontWeight: 400
rounded:
  small: 4
  medium: 8
  large: 16
components:
  backgroundColor: "{colors.tertiary}"
---
```

### 2. Markdown Body（人类层）

正文用自然语言描述设计哲学与使用语境，8 个固定章节：

| 章节 | 内容 |
|------|------|
| 1. Overview | 品牌与风格总览 |
| 2. Colors | 色彩角色与情感 |
| 3. Typography | 排版气质 |
| 4. Layout | 布局与留白策略 |
| 5. Elevation & Depth | 层级与阴影 |
| 6. Shapes | 形状语言 |
| 7. Components | 组件规范 |
| 8. Do's and Don'ts | 设计禁区 |

## 关键设计理念

**token 是规范性数值，prose 解释"为什么"以及"如何应用"。**

两者结合，使 LLM 既能获取精确值，又能理解设计意图，减少"猜错品牌色"的问题。

## CLI 工具链

### lint
结构校验 + WCAG 对比度检测 + token 引用完整性检查

### diff
对比两个版本的 DESIGN.md，识别 token 与 prose 的回归

### export
导出为：
- Tailwind 主题配置
- W3C DTCG 标准 tokens.json

### spec
输出规范原文，便于注入 agent prompt 作为上下文

## 使用场景

### AI Agent 集成
- agent 可以直接读取精确数值
- 理解设计意图和上下文
- 减少"猜错"的情况

### 设计系统管理
- 统一的设计 token 格式
- 版本对比和回归检测
- 多格式导出支持

## 核心价值

| 价值 | 说明 |
|------|------|
| **精确性** | 机器可读的精确数值 |
| **可解释性** | 人类可读的设计 rationale |
| **互操作性** | 支持 Tailwind、W3C 等多种格式 |
| **AI 友好** | 让 AI 真正理解设计意图 |