# gnhf 项目详解

## 项目简介

gnhf (Good Night, Have Fun) 是一款 ralph/autoresearch 风格的编排器，让你的 AI 智能体在你睡觉时持续运行——每次迭代朝着目标完成一个小的、被提交记录的、有文档的变更。

你醒来时会看到满满的干净工作和完整的事件日志。

## 核心理念

> **Before I go to bed, I tell my agents: good night, have fun**
> (睡前我对我的智能体说：晚安，玩得开心)

## 核心功能

### 1. 一句话启动
只需输入一句指令，就能唤起 Claude Code 或 Codex，进入全自动代码迭代循环。

### 2. 自动 Git 提交
每次成功修改都会自动生成独立的 Git 提交记录，保留清晰的工作轨迹。

### 3. 自动回滚重试
遇到运行报错会自动回滚代码并执行重试，完全不需要人工干预。

### 4. 迭代记忆机制
内置迭代记忆机制，每轮结果会写入笔记文件供下一轮读取，让智能体知道之前做了什么。

### 5. 智能退避策略
成功的改动单独提交，失败的自动回滚。连续失败会指数退避，不会一直烧钱。

### 6. Worktree 多智能体模式
能用 worktree 模式同时跑多个智能体，各自独立互不干扰。

## 支持的智能体

- **Claude Code** - Anthropic AI 编程助手
- **Codex** - OpenAI AI 编程助手
- **Rovo Dev** - Atlassian AI 编程助手
- **OpenCode** - 开源 AI 编程助手

## 快速开始

```bash
# 安装
npm install -g gnhf

# 进入 Git 仓库（需要干净的 working tree）
cd your-project

# 一句话启动
gnhf "reduce complexity of the codebase"

# 带参数启动
gnhf "implement feature X" --max-iterations 10 --max-tokens 5000000

# Worktree 多智能体模式
gnhf --worktree "implement feature X" &
gnhf --worktree "add tests for module Y" &
```

## 适用场景

- 🌙 让 AI 值夜班，持续优化代码
- 🔄 批量代码重构和优化
- 🧪 自动化测试生成
- 📝 文档自动更新
- 🎯 多任务并行处理
