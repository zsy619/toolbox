---
title: 内存仅30MB！AI Agent专属的无头浏览器，802 Stars！
author: 元曜科技
summary: Obscura 是 Rust 编写的开源无头浏览器，内存仅 30MB，页面加载仅 85ms，内置反检测功能，兼容 Puppeteer/Playwright，零成本迁移。
tags:
  - Rust
  - 无头浏览器
  - AI工具
  - 网页抓取
  - Puppeteer
  - Playwright
platform: wechat
date: 2026-04-22
source: https://github.com/h4ckf0r0day/obscura
---

# 内存仅30MB！AI Agent专属的无头浏览器，802 Stars！

> 「做 AI 自动化和网页抓取，还在用 Chrome？」

## 问题痛点

传统无头浏览器的局限：

| 问题 | Chrome | 影响 |
|------|--------|------|
| 内存占用 | 200+ MB | 服务器成本高 |
| 启动速度 | ~2 秒 | 效率低 |
| 反检测 | 无 | 容易被屏蔽 |

## 解决方案：Obscura

**Obscura** 是 Rust 编写的开源无头浏览器，完美替代 Chrome：

| 指标 | Obscura | Chrome |
|------|---------|--------|
| 内存 | **30 MB** | 200+ MB |
| 页面加载 | **85 ms** | ~500 ms |
| 启动速度 | **Instant** | ~2s |
| 反检测 | **内置** | 无 |
| Puppeteer | **支持** | 支持 |
| Playwright | **支持** | 支持 |

## 核心功能

### 🚀 超轻量级
- 内存仅 30MB
- 二进制仅 70MB
- 单文件，无依赖

### ⚡ 极速性能
- 页面加载 85ms
- 启动速度 Instant
- 支持并行抓取

### 🛡️ 内置反检测
- Stealth 模式
- 指纹随机化
- 追踪器拦截（3,520 个域名）

### 🔌 兼容主流工具
- Puppeteer
- Playwright
- 通过 CDP 协议完全兼容

## 安装方式

### 下载二进制

```bash
# Linux x86_64
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-x86_64-linux.tar.gz
tar xzf obscura-x86_64-linux.tar.gz

# macOS Apple Silicon
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-aarch64-macos.tar.gz
tar xzf obscura-aarch64-macos.tar.gz
```

### 源码构建

```bash
git clone https://github.com/h4ckf0r0day/obscura.git
cd obscura
cargo build --release --features stealth
```

## 适用场景

| 场景 | 适用原因 |
|------|---------|
| AI Agent 自动化 | 内置反检测，兼容 Puppeteer/Playwright |
| 大规模网页抓取 | 内存低、速度快、支持并行 |
| 数据采集 | 支持 JavaScript 渲染 |

---

**GitHub 搜索 obscura，802 Stars，Apache 2.0 开源！**

#Rust #无头浏览器 #AI工具 #网页抓取