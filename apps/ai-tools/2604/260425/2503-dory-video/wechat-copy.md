---
title: Dory AI 原生 SQL 工作站
author: 元曜科技
summary: Dory 把 SQL 编辑器、AI 助手和数据库运维整合到一个桌面应用里，支持 ClickHouse 深度集成（监控+权限管理），数据本地存储，隐私无忧。
tags:
  - Dory
  - SQL 编辑器
  - AI 助手
  - 数据库运维
  - ClickHouse
platform: wechat
date: 2026-04-23
source: https://github.com/dorylab/dory
---

# Dory AI 原生 SQL 工作站

> 「SQL 编辑器 + AI 助手 + 数据库运维，三合一」

## 核心摘要

Dory 把 SQL 编辑器、AI 助手和数据库运维整合到一个桌面应用里。

- **ClickHouse 深度集成**：监控 + 权限管理
- **兼容主流数据库**：PostgreSQL、MySQL、SQLite 等
- **隐私优先**：数据存在本地，只有 AI 请求走 Cloudflare

## 核心功能

### 1. SQL Copilot
- **Ask** — 自然语言生成 SQL
- **Action** — 修复或重写当前 SQL
- **Context** — 解释查询逻辑和字段含义

### 2. ClickHouse 深度集成

| 功能 | 说明 |
|------|------|
| 实时监控 | 查询数、延迟、吞吐量 |
| 权限管理 | 用户、角色、授权 |

### 3. 多数据库支持

| 数据库 | 状态 |
|--------|------|
| ClickHouse | ✅ 深度集成 |
| PostgreSQL | ✅ 支持 |
| MySQL | ✅ 支持 |
| SQLite | ✅ 支持 |

## 安全特性

- 数据存在本地
- 只有 AI 请求走 Cloudflare

## 安装方式

| 平台 | 命令 |
|------|------|
| macOS | `brew install dorylab/dory/dory` |
| Docker | `docker run -d --name dory ...` |

## 相关链接

- GitHub: https://github.com/dorylab/dory
- 官网: https://app.getdory.dev

---

**102 Stars，AI 原生 SQL 工作站！**

#Dory #SQL #AI #数据库 #ClickHouse