---
title: "autoskills - 一键配齐 AI Skill 栈"
summary: "一个命令自动扫描代码技术栈，匹配安装 AI Skills。React、Next.js、Tailwind、Prisma 都能自动装齐，人工精选安全可靠，支持 monorepo。"
tags:
  - TypeScript
  - AI工具
  - Skill
  - React
  - Next.js
  - 开发工具
  - 开源
platform: all
source: https://github.com/midudev/autoskills
---

# autoskills - 一键配齐 AI Skill 栈

## 项目概述

**autoskills** 是一个命令行工具，一键扫描项目技术栈，自动安装匹配的 AI Skills。

> **一句话理解**：输入一个命令，autoskills 自动检测你的技术栈，然后安装对应的 AI Skills。

## 核心定位

- **一句话**：一个命令，配齐整个 AI Skill 栈
- **安装方式**：`npx autoskills`
- **Stars**：3797
- **作者**：midudev（知名前端开发者）

## 为什么需要 autoskills？

### 手动安装的痛点

- 不知道项目需要哪些 Skills
- 一个个搜索、安装，费时费力
- 担心来源不明的 Skill 安全性

### autoskills 的解决方案

**自动检测技术栈**
- 扫描 package.json、配置文件
- 识别 React、Next.js、Tailwind、Prisma 等
- 全面覆盖主流技术栈

**自动安装匹配 Skills**
- 根据检测结果推荐合适 Skills
- 一键安装，无需手动搜索
- 版本兼容，自动处理

**人工精选，安全可靠**
- 所有 Skill 都经过人工审核
- 无安全隐患
- 支持 monorepo

## 支持的技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React, Next.js, Vue, Nuxt, Svelte |
| CSS框架 | Tailwind, CSS Modules, Styled Components |
| 数据库 | Prisma, Drizzle, MongoDB |
| 认证 | Auth.js, NextAuth, Clerk |
| 部署 | Vercel, Netlify, Cloudflare |
| API | tRPC, GraphQL, REST |
| 测试 | Vitest, Jest, Playwright |
| Linting | ESLint, Prettier, Biome |

## 使用方式

### 一键安装

```bash
npx autoskills
```

### 支持 monorepo

```bash
cd packages/my-app
npx autoskills
```

autoskills 会自动检测当前目录的技术栈。

## 功能特点

### 🚀 极速安装
- 几秒钟完成扫描和安装
- 无需手动搜索

### 🔍 智能检测
- 自动识别项目技术栈
- 精确匹配 Skills

### 🛡️ 安全可靠
- 人工精选 Skill
- 无恶意代码
- 版本兼容

### 📦 Monorepo 支持
- 支持 Nx、Rush、Turborepo
- 精准定位每个包

## 相关链接

- GitHub：https://github.com/midudev/autoskills
- Stars：3797
- Forks：367
- License：MIT