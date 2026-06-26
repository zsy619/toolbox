---
title: OpenClaw 技能指南：13,000+技能应该怎么装？
summary: ClawHub 已收录超 13,000 个技能，但约 12% 存在安全问题。本文整理了 5 个必装技能及安全避坑指南。
author: AI 工具指南
date: 2026-04-02
---

# OpenClaw 技能指南：13,000+技能应该怎么装？

## 📊 ClawHub 关键数据

截至 2026 年 3 月：

- **13,700+** 总收录技能
- **87%** 安全审核通过率
- **2,868** 高质量精选
- **180,000+** 最高安装量

## 什么是 OpenClaw Skills？

OpenClaw Skills 是 OpenClaw 的插件扩展系统。每个 Skill 本质上是一个文件夹，核心文件是 `SKILL.md`——包含 YAML 元数据和 Markdown 指令。

**Skills vs MCP 区别：**

| 维度 | MCP | Skills |
|------|-----|--------|
| 层级 | 底层通信协议 | 高层应用抽象 |
| 类比 | 相当于 HTTP | 相当于 Web 应用 |
| 开发门槛 | 需要理解协议规范 | 只需写 Markdown |
| 运行方式 | 独立进程，通过 JSON-RPC | 注入 OpenClaw 上下文 |

## 🎯 必装技能清单

### 1. Web Browsing — 浏览器自动化
- **安装量**: 180,000+
- **用途**: 网页浏览、数据抓取、表单填写
- 让 OpenClaw 像真人一样操作浏览器

### 2. Tavily Search — AI 专属搜索
- **安装量**: 85,000+
- **用途**: 高质量网页搜索，专为 AI Agent 设计
- 返回结果更结构化，适合 AI 解析

### 3. Felo Search — AI 综合答案
- **安装量**: 60,000+
- **用途**: 返回带引用来源的 AI 综合答案
- 适合需要快速获取结论的场景

### 4. Capability Evolver — 自进化引擎
- **安装量**: 35,000+
- **用途**: Agent 自动学习并创建新技能
- 让 AI 具备"自我进化"能力

### 5. Google Workspace — 全能办公
- **安装量**: 14,000+
- **用途**: Gmail、Calendar、Drive、Docs、Sheets 一站式连接
- 一个 Skill 覆盖 Google 全家桶

## ⚠️ 安全避坑提示

约 **12%** 的技能存在安全问题，请务必：

1. **优先安装官方审核通过的精选技能**
2. **仔细审查 SKILL.md 文件内容**，特别是执行脚本部分
3. **关注 ClawHavoc 供应链攻击**的最新防护策略

## 安装命令

```bash
npx clawhub@latest install web-browsing
npx clawhub@latest install tavily-search
npx clawhub@latest install felo-search
npx clawhub@latest install capability-evolver
npx clawhub@latest install gog
```

---

**关注我，了解更多 AI 工具技巧** 🚀