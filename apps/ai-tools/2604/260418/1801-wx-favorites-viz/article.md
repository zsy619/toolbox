---
title: "微信收藏可视化 Claude Code Skill — 从加密 DB 到交互式 HTML 报告的端到端管线"
summary: "一个 Claude Code Skill，实现从加密的微信 Mac 本地数据库中提取收藏数据，生成交互式可视化 HTML 报告的全流程自动化。包含密钥提取、数据库解密、数据解析、可视化报告生成。
tags:
  - 微信
  - Claude Code
  - 数据可视化
  - frida
  - Python
  - 数据库解密
  - ECharts
platform: all
---

# 微信收藏可视化 (wechat-favorites-viz)

从加密的微信 Mac 本地数据库中提取收藏数据，生成交互式可视化 HTML 报告。

## 效果预览

报告包含：统计仪表盘、月度趋势、类型分布、来源排行、活跃热力图、词云、标签云，以及可按类型/标签筛选的收藏浏览区。

## 快速开始（macOS）

### 前置条件

- macOS (Apple Silicon 或 Intel)
- 微信 Mac 4.x 已登录
- Python 3.9+
- Claude Code（推荐，自动执行全流程）

### 方式一：用 Claude Code 一键执行

```
# 在 Claude Code 中说：
微信收藏可视化
```

Claude 会自动完成密钥提取、解密、解析、报告生成全流程。

### 方式二：手动分步执行

#### Step 1: 安装依赖

```
pip3 install frida frida-tools pycryptodome
```

#### Step 2: 准备签名副本

微信 App Store 版有 Hardened Runtime 保护，需要复制一份去掉签名限制。

#### Step 3: 提取加密密钥

用 frida 启动桌面版微信，hook `CCKeyDerivationPBKDF` 函数，捕获所有 PBKDF2 密钥派生调用。

#### Step 4: 解密数据库

用 PyCryptodome AES-256-CBC, HMAC-SHA512, PBKDF2 256000 轮解密 favorite.db。

#### Step 5: 生成报告

解析数据并生成单文件 HTML 报告，使用 ECharts 5.x 实现交互式可视化。

## 技术栈

| 组件 | 技术 |
| --- | --- |
| 密钥提取 | frida 17.x, CCKeyDerivationPBKDF hook |
| 数据库解密 | PyCryptodome AES-256-CBC, HMAC-SHA512 |
| 数据解析 | Python sqlite3 + regex XML |
| 可视化 | ECharts 5.x CDN, echarts-wordcloud 2.x |
| 报告格式 | 单文件 HTML，暗色主题，内联所有依赖 |

## 报告功能

- 统计卡片：总数、跨越天数、日均、来源数
- 月度趋势：折线 + 面积图
- 内容类型分布：甜甜圈图
- 来源 Top 15：水平柱状图
- 活跃热力图：星期 x 小时
- 词云：从标题 + 描述提取关键词
- 收藏浏览：按类型筛选 + 标签筛选 + 全文搜索 + 分页
- 详情弹窗：查看完整内容、原文链接、来源、标签
