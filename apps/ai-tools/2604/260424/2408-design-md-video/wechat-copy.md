---
title: design.md 让AI真正理解设计意图
author: 元曜科技
summary: Google Labs推出design.md格式规范，用机器可读token + 人类可读rationale的双层结构，解决AI"猜错品牌色"的问题。
tags:
  - Design Tokens
  - Google Labs
  - 设计系统
  - YAML
platform: wechat
date: 2026-04-23
source: https://github.com/google-labs-co/design.md
---

# design.md 让AI真正理解设计意图

> 「AI 总是猜错品牌色？因为 Design Token 有值无义。」

## 问题痛点

传统 Design Token 格式的痛点：

| 问题 | 影响 |
|------|------|
| 只有数值，没有上下文 | AI 无法理解设计意图 |
| 设计意图无法传递 | AI 容易"猜错"品牌色 |
| 缺乏规范结构 | 不同系统难以统一 |

## 解决方案：design.md 双层结构

### 第一层：YAML Front Matter（机器可读）

```yaml
colors:
  primary: "#1A1C1E"
  secondary: "#3B82F6"
typography:
  fontFamily: "Inter"
  fontSize: 16
rounded:
  small: 4
  medium: 8
  large: 16
```

### 第二层：Markdown Body（人类可读）

正文分为 8 个固定章节：

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

## CLI 工具链

### lint
结构校验 + WCAG 对比度检测 + token 引用完整性检查

### diff
对比两个版本的 DESIGN.md，识别 token 与 prose 的回归

### export
导出为 Tailwind 主题配置或 W3C DTCG 标准 tokens.json

### spec
输出规范原文，便于注入 agent prompt

## 核心价值

> **token 是规范性数值，prose 解释"为什么"以及"如何应用"。**

两者结合，使 LLM 既能获取精确值，又能理解设计意图，减少"猜错品牌色"的问题。

---

**GitHub 搜索 design.md！**

#DesignTokens #GoogleLabs #设计系统 #AI