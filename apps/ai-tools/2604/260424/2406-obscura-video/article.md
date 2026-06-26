---
title: "Obscura - AI Agent 和网页抓取的顶级无头浏览器"
summary: "Rust编写的开源无头浏览器，内存仅30MB，支持Puppeteer/Playwright，内置反检测和追踪器拦截。AI Agent自动化和大规模网页抓取的理想选择。"
tags:
  - Rust
  - 无头浏览器
  - AI工具
  - 网页抓取
  - Puppeteer
  - Playwright
  - 反检测
  - 开源
platform: all
source: https://github.com/h4ckf0r0day/obscura
---

# Obscura - AI Agent 和网页抓取的顶级无头浏览器

## 项目概述

**Obscura** 是用 Rust 编写的开源无头浏览器引擎，专为 AI Agent 自动化和网页抓取设计。

> **一句话理解**：一个超轻量、极速、内置反检测的无头浏览器，兼容 Puppeteer 和 Playwright。

## 核心定位

- **语言**：Rust（性能卓越）
- **内存占用**：30MB（vs Chrome 200+MB）
- **二进制大小**：70MB
- **启动速度**：Instant（瞬时）
- **页面加载**：85ms（vs Chrome ~500ms）
- **协议**：Apache 2.0

## 为什么选择 Obscura？

| 指标 | Obscura | Headless Chrome |
|------|---------|-----------------|
| 内存 | **30 MB** | 200+ MB |
| 二进制大小 | **70 MB** | 300+ MB |
| 反检测 | **内置** | 无 |
| 页面加载 | **85 ms** | ~500 ms |
| 启动速度 | **Instant** | ~2s |
| Puppeteer | **支持** | 支持 |
| Playwright | **支持** | 支持 |

## 核心功能

### 1. 超轻量级
- 内存仅 30MB
- 二进制仅 70MB
- 单文件，无依赖（无需 Chrome、Node.js）

### 2. 极速性能
- 页面加载 85ms
- 启动速度 Instant
- 支持并行抓取

### 3. 内置反检测（Stealth Mode）
- 每个会话随机化指纹（GPU、屏幕、Canvas、音频、电池）
- 真实的 navigator.userAgentData
- event.isTrusted = true
- navigator.webdriver = undefined
- 追踪器拦截（3,520 个域名）

### 4. Puppeteer/Playwright 兼容
通过 Chrome DevTools Protocol (CDP) 实现完全兼容：
```javascript
// Puppeteer
await puppeteer.connect({ browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser' });

// Playwright
await chromium.connectOverCDP({ endpointURL: 'ws://127.0.0.1:9222' });
```

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

Requires Rust 1.75+

## 快速使用

### 抓取页面

```bash
# 获取页面标题
obscura fetch https://example.com --eval "document.title"

# 提取所有链接
obscura fetch https://example.com --dump links

# 渲染JavaScript并导出HTML
obscura fetch https://news.ycombinator.com --dump html
```

### 启动 CDP 服务器

```bash
obscura serve --port 9222 --stealth
```

### 并行抓取

```bash
obscura scrape url1 url2 url3 ... \
  --concurrency 25 \
  --eval "document.querySelector('h1').textContent" \
  --format json
```

## 性能基准

| 页面类型 | Obscura | Chrome |
|---------|---------|--------|
| 静态HTML | **51 ms** | ~500 ms |
| JS + XHR + fetch | **84 ms** | ~800 ms |
| 动态脚本 | **78 ms** | ~700 ms |

## Stealth 模式

### 反指纹
- 每个会话随机化指纹
- 真实的 navigator.userAgentData
- event.isTrusted = true
- navigator.webdriver = undefined

### 追踪器拦截
- 3,520 个域名被拦截
- 自动阻止分析、 广告、遥测脚本
- 启用 `--stealth` 标志

## 适用场景

| 场景 | 适用原因 |
|------|---------|
| AI Agent 自动化 | 内置反检测，兼容 Puppeteer/Playwright |
| 大规模网页抓取 | 内存低、速度快、支持并行 |
| 数据采集 | 支持 JavaScript 渲染 |
| 自动化测试 | 兼容现有工具链 |

## 相关链接

- GitHub：https://github.com/h4ckf0r0day/obscura
- Stars：802
- Forks：58
- License：Apache 2.0