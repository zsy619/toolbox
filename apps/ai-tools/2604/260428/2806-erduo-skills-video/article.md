---
title: "Erduo Skills - AI Agent 技能库"
summary: "AI Agent 结构化技能库，提供每日日报、RSS 精选、转录精修、翻译精修、Web To Markdown、Gemini 水印移除等工具"
tags:
  - AI工具
  - Agent技能
  - RSS
  - 翻译
  - 转录
  - 开源项目
platform: all
source: https://github.com/rookie-ricardo/erduo-skills
---

# Erduo Skills

为 AI Agent 赋能，提供结构化能力与智能工作流。

Erduo Skills 是一个 AI Agent 技能库，收录了一系列可被 Agent 直接调用的结构化技能。每个技能都是独立的、可组合的工作流单元，覆盖信息获取、内容处理、图像工具等场景。

## 核心技能

### 🗞 每日日报
多源抓取 + 智能筛选，自动生成技术日报。Master-Worker 架构，并行抓取支持无头浏览器。

### 📰 AK RSS Digest
固定 RSS 源精选摘要，10 分制打分过滤，仅输出 7 分以上内容。

### ✍️ 转录精修师
语音转录文本精修为高可读性文章，保留原句原词，拒绝高度概括。

### 🌐 翻译精修师
四步精翻工作流（分析 → 初译 → 审校 → 终稿），支持 ZH↔EN、ZH↔JA 双向翻译。

### 🔗 Web To Markdown
URL 路由抓取 + Readability 清洗，输出干净 Markdown。

### 🖼 Gemini 水印移除
逆向 Alpha 混合算法去除 Gemini 图片水印。

## 安装

```bash
npx skills add rookie-ricardo/erduo-skills
```
