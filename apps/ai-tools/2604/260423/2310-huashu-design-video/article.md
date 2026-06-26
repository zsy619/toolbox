# Huashu Design 内容分析

> 来源：https://github.com/alchaincyf/huashu-design

## 项目概述

Huashu Design（花树设计）是一个 HTML 原生的设计 skill，用于 Claude Code 等 AI 编码工具。它的核心理念是：在你 agent 里打一句话，拿回一份能交付的设计。

## 核心价值

### 一句话交付

不是「AI 做的还行」那种水平——是看起来像大厂设计团队做的。

给 skill 你的品牌资产（logo、色板、UI 截图），它会读懂你的品牌气质；什么都不给，内置的 20 种设计语汇也能兜底到不出 AI slop。

### 跨 Agent 通用

Claude Code、Cursor、Codex、OpenClaw、Hermes 都能装。

## 功能矩阵

| 能力 | 交付物 | 典型耗时 |
|------|--------|----------|
| 交互原型 | 单文件 HTML、真 iPhone bezel、可点击、Playwright 验证 | 10-15 min |
| 演讲幻灯片 | HTML deck（浏览器演讲）+ 可编辑 PPTX（文本框保留） | 15-25 min |
| 时间轴动画 | MP4（25fps/60fps 插帧）+ GIF（palette 优化）+ BGM | 8-12 min |
| 设计变体 | 3+ 并排对比、Tweaks 实时调参、跨维度探索 | 10 min |
| 信息图/可视化 | 印刷级排版、可导 PDF/PNG/SVG | 10 min |
| 设计方向顾问 | 5流派 × 20种设计哲学、推荐3方向、并行生成 Demo | 5 min |
| 5维度专家评审 | 雷达图 + Keep/Fix/Quick Wins、可操作修复清单 | 3 min |

## 核心机制

### 1. 品牌资产协议（最硬规则）

涉及具体品牌时强制执行 5 步：
1. 问用户有 brand guidelines 吗
2. 搜官方品牌页
3. 下载资产（三条兜底）
4. grep 提取色值
5. 固化 spec 到 brand-spec.md

### 2. 设计方向顾问（Fallback）

当用户需求模糊时触发：
- 从 5流派 × 20种设计哲学里推荐 3 个差异化方向
- 每个方向配代表作、气质关键词
- 并行生成 3 个视觉 Demo 让用户选

### 3. Junior Designer 工作流

默认工作模式：
- 开工前 show 问题清单
- HTML 里先写 assumptions + placeholders + reasoning
- 尽早 show 给用户
- 填充实际内容 → variations → Tweaks

### 4. 反 AI Slop 规则

避免一眼 AI 的视觉最大公约数：
- 不用紫渐变 / emoji 图标 / 圆角+左 border accent
- 不用 SVG 画人脸 / Inter 做 display
- 用 text-wrap: pretty + CSS Grid + 精心选择的 serif display

## 技术架构

### 设计组件
- Stage + Sprite 时间片段模型
- useTime / useSprite / interpolate / Easing 四 API
- iPhone 15 Pro 精确机身（灵动岛/状态栏/Home Indicator）
- 状态驱动多屏切换

### 导出工具链
- render-video.js：HTML → MP4
- convert-formats.sh：MP4 → 60fps + GIF
- add-music.sh：MP4 + BGM
- html2pptx.js：HTML → 可编辑 PPTX

## 和 Claude Design 的关系

| | Claude Design | Huashu Design |
|---|---|---|
| 形态 | 网页产品（浏览器里用） | skill（Claude Code 里用） |
| 配额 | 订阅 quota | API 消耗、无 quota 限制 |
| 交付物 | 画布内 + 可导 Figma | HTML/MP4/GIF/PPTX/PDF |
| 操作方式 | GUI（点、拖、改） | 对话（说话、等 agent 做完） |
| 复杂动画 | 有限 | Stage + Sprite、60fps 导出 |
| 跨 agent | 专属 Claude.ai | 任意 skill 兼容 agent |

Claude Design 是更好的图形工具，Huashu Design 是让图形工具这层消失。

## 安装方式

```bash
npx skills add alchaincyf/huashu-design
```

## 使用示例

```
「做一份 AI 心理学的演讲 PPT，推荐 3 个风格方向让我选」
「做个 AI 番茄钟 iOS 原型，4 个核心屏幕要真能点击」
「把这段逻辑做成 60 秒动画，导出 MP4 和 GIF」
「帮我对这个设计做一个 5 维度评审」
```
