---
title: "Dory - AI 原生 SQL 工作站"
summary: "Dory 把 SQL 编辑器、AI 助手和数据库运维整合到一个桌面应用里，支持 ClickHouse 深度集成（监控+权限管理），兼容 PostgreSQL、MySQL 等主流数据库。本地安装或 Docker 部署，数据存在本地，只有 AI 请求走 Cloudflare。"
tags:
  - Dory
  - SQL 编辑器
  - AI 助手
  - 数据库运维
  - ClickHouse
platform: all
source: https://github.com/dorylab/dory
---

# Dory - AI 原生 SQL 工作站

## 项目概述

**Dory** 把 SQL 编辑器、AI 助手和数据库运维整合到一个桌面应用里。

> **核心摘要**：SQL 编辑器 + AI 助手 + 数据库运维，三合一。

## 核心摘要（必含）

1. **三合一整合**：SQL 编辑器、AI 助手、数据库运维，一个应用搞定
2. **ClickHouse 深度集成**：监控 + 权限管理
3. **兼容主流数据库**：PostgreSQL、MySQL、Neon、SQLite 等
4. **灵活部署**：本地安装或 Docker 部署
5. **隐私优先**：数据存在本地，只有 AI 请求走 Cloudflare

## 核心功能

### 1. SQL Copilot
AI 助手 grounded in real database schema：
- **Ask** — 自然语言生成 SQL
- **Action** — 修复或重写当前 SQL
- **Context** — 解释查询逻辑和字段含义

### 2. Schema-Aware 编辑器
- 基于真实数据库结构的智能补全
- 支持多表连接和子查询

### 3. Database Chatbot
- 内置对话式 AI 助手
- 自动理解数据库 schema
- 直接提问关于表和 SQL 的问题

### 4. ClickHouse 深度集成

**监控面板**：
- 实时指标：总查询数、慢查询、错误查询、活跃用户
- 查询延迟趋势（P50 / P95）
- 查询吞吐量趋势（QPM）
- 多维度过滤：用户、数据库、查询类型、时间范围

**权限管理**：
- 创建、编辑、删除数据库用户
- 创建角色和配置授权关系
- 支持集群级别权限操作

## 数据库支持

| 数据库 | 状态 |
|--------|------|
| ClickHouse | ✅ 深度集成 |
| PostgreSQL | ✅ 支持 |
| MySQL | ✅ 支持 |
| Neon | ✅ 支持 |
| MariaDB | ✅ 支持 |
| SQLite | ✅ 支持 |
| DuckDB | 🚧 计划中 |

## 技术栈

- Next.js + React + Tailwind
- Drizzle ORM
- Multi-model AI SDK
- Monaco Editor
- PGLite

## 相关链接

- GitHub: https://github.com/dorylab/dory
- 官网: https://app.getdory.dev
- 102 Stars · 开源项目