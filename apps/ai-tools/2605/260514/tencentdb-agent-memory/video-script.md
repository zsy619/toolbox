# 视频分镜脚本

> **平台**: 微信视频号  |  **时长**: 52s  |  **主题**: cyberpunk

> ⚠️ 本文件由 AI 自动生成，实际配音以 narration.txt 为准

## 场景 1：开场（8s）

**时长**: undefineds

TencentDB Agent Memory — 让AI Agent真正记住你

 一、项目概述

TencentDB Agent Memory 是腾讯开源的AI Agent记忆管理系统，核心理念是："Memory is not about hoarding everything in th

## 场景 2：痛点（8s）

**时长**: undefineds

e AI — it is about sparing humans from having to repeat themselves."

简单来说，它解决的是一个所有人都遇到过的痛点：每次和AI Agent对话，都要重复解释同样的SOP、项目背景、工具规范和输出格式。

## 场景 3：方案（8s）

**时长**: undefineds

二、核心技术：分层记忆 + 符号记忆

 分层记忆（Memory Layering）

传统记忆系统把数据切碎丢进向量数据库，召回时就是在一堆碎片里盲目搜索。

TencentDB Agent Memory采用了语义金字塔架构：

- L0 Conversation：原始对话记录

## 场景 4：特性（8s）

**时长**: undefineds

- L1 Atom：原子化事实
- L2 Scenario：场景块
- L3 Persona：用户画像

上层承载判断和方向，下层承载证据和精度。

 符号记忆（Symbolic Memory）

长任务中最大的token消耗源是冗长的中间日志（搜索结果、代码、错误追踪）。

## 场景 5：上手（8s）

**时长**: undefineds

腾讯的方案是：用Mermaid符号图替代冗长文本，将任务状态转换编码为高密度的Mermaid语法。

完整工具日志offload到外部文件，上下文只保留轻量级的Mermaid任务图。

 三、性能数据

在OpenClaw集成后，实测效果：

 指标  基准  使用插件后  提升幅度

## 场景 6：结尾（8s）

**时长**: undefineds

---------------------------------
 WideSearch成功率  33%  50%  +51.52% 
 Token消耗  221.31M  85.64M  -61.38% 
 SWE-bench成功率  58.4%  64.2%  +9.93%

## 场景 7：结尾（8s）

**时长**: undefineds

PersonaMem准确率  48%  76%  +59% 

 四、使用方式

 OpenClaw（零配置启用）

然后在配置中启用：

 Hermes（Docker部署）

 五、核心优势

1. 可回溯的白盒调试：记忆不是黑箱，L2场景块是纯Markdown，L3 Persona可人

## 场景 8：结尾（NaNs）

**时长**: undefineds

工检查，Mermaid画布人机双读。

2. 工业级工程化：不是Demo，是生产可用。支持OpenClaw插件和Hermes Gateway适配器，SQLite+sqlite-vec本地后端开箱即用。

3. 混合检索：BM25+向量+RRF融合，同时支持关键词和语义召回。

路线图：已实现长期记忆和短期压缩，正在开发跨Agent迁移和自动Skill生成。

---

*本脚本由 generate_docs.js 自动生成 | 日期: 2026/5/14*
