# Browser Harness 内容分析

> 来源：https://github.com/browser-use/browser-harness

## 项目概述

Browser Harness 是最简单的、最薄的、自我修复的 harness，让 LLM 能够完全自由地完成任何浏览器任务。直接建立在 CDP (Chrome DevTools Protocol) 上。

## 核心理念

**"You will never use the browser again."**

Agent 在任务中途发现缺什么函数，直接自己写进去。不需要框架，不需要配方，没有护栏。一个 websocket 连 Chrome，中间什么都不夹。

## 工作原理

```
  ● agent: wants to upload a file
  │
  ● helpers.py → upload_file() missing
  │
  ● agent edits the harness and writes it    helpers.py   192 → 199 lines
  │                                                       + upload_file()
  ✓ file uploaded
```

Agent 在执行任务过程中，发现缺什么工具，就自己动手写进去。这是真正的 self-healing。

## 核心特性

### 1. Self-healing 能力

当 agent 发现缺少某个函数时，它会：
1. 暂停当前任务
2. 编辑 helpers.py 添加缺失的函数
3. 继续执行任务

### 2. 极简架构 (~592 lines of Python)

| 文件 | 行数 | 说明 |
|------|------|------|
| install.md | - | 首次安装和浏览器引导 |
| SKILL.md | - | 日常使用说明 |
| run.py | ~36 | 运行预加载 helper 的 Python |
| helpers.py | ~195 | 起始工具调用，agent 会编辑这些 |
| admin.py + daemon.py | ~361 | CDP websocket 和 socket bridge |

### 3. CDP 直连

直接建立在 Chrome DevTools Protocol 上，不需要任何中间层。

### 4. Domain Skills 可扩展

每个 site/task 都有对应的 skill，包含：
- 选择器 (selectors)
- 流程 (flows)
- 边界情况 (edge cases)

## 安装方式

### 方式一：Setup Prompt

复制以下内容到 Claude Code 或 Codex：

```
Set up https://github.com/browser-use/browser-harness for me.

Read `install.md` first to install and connect this repo to my real browser. Then read `SKILL.md` for normal usage. Always read `helpers.py` because that is where the functions are. When you open a setup or verification tab, activate it so I can see the active browser tab. After it is installed, open this repository in my browser and, if I am logged in to GitHub, ask me whether we should star it for me as a quick demo that the interaction works — only click the star if I say yes. If I am not logged in, just go to browser-use.com.
```

### 方式二：免费远程浏览器

Grab a key at cloud.browser-use.com/new-api-key

免费额度：3个并发浏览器 + 代理 + captcha 解决

## 使用场景

- **LinkedIn outreach** - 自动发送消息
- **Amazon 订单** - 自动下单
- **报销流程** - 自动填写报销单
- **任何网页任务** - agent 会自己学会

## 贡献指南

欢迎提交 PR！最好的帮助方式是：

在 [domain-skills/](domain-skills/) 下贡献一个新的领域 skill（你常用的 site 或 task）。

注意：**Skills are written by the harness, not by you.**

Agent 自己跑任务时发现什么非显而易见的东西，它会自己生成 skill 文件。不要手动编写 skill——agent 生成的那些才能反映实际工作中有效的做法。
