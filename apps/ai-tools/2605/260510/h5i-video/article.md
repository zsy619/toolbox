# h5i - 原始内容分析

## 项目概述

**h5i** (发音 "high-five") — AI 时代版本控制系统，不仅记录代码变化，还记录 AI 生成代码时的推理过程。

## 核心问题

AI 编程时代，Git 只能记录「是什么变化」，无法回答：
- **谁触发了这个变更？** (哪个 Prompt)
- **AI 跳过了什么或推迟了什么？**
- **AI 当时在想什么？**
- **能否从上次停止的地方继续？**

## 解决方案：h5i

h5i 是 Git 的副驾驶，集成 Claude Code 和 Codex，开箱即用——每个 Prompt、决策、文件操作都被捕获为第一类 Git 对象。

## 四大核心命令

### 1. h5i context — 记录推理过程
- 记录目标 (goal)、里程碑 (milestones)
- 记录每个 OBSERVE / THINK / ACT 步骤
- 作为第一类 Git 对象存储
- 支持从上次停止的地方继续
- 支持 Claude Code → Codex 任务交接

### 2. h5i claims — 内容寻址的事实
- 为文件附加短小的内容寻址事实
- 例如：「HTTP helpers 只在 src/api/client.py」
- **证据变化时自动失效** — 过时指导永不泄露
- Live claims 注入到未来的 Agent 会话
- **减少 69% 缓存读取 Token** (实测)

### 3. h5i notes — 记录探索足迹
- 附加每个会话的探索足迹
- 不确定时刻、盲改 (未读就改的文件)
- 标记最需要人工 review 的提交

### 4. h5i vibe — 5秒审计
- AI 足迹分析
- 全 AI 编写的目录
- 泄露的 API tokens
- 提示注入检测

## 实测数据 (N=10 实验)

| 指标 | 无 claims | 有 claims | 变化 |
|------|----------|----------|------|
| Cache-read tokens | 528,136 ± 101,765 | 165,722 ± 105,423 | **−68.6%** |
| Read tool calls | 5.2 ± 1.1 | 1.0 ± 0 | **−80.8%** |
| Assistant turns | 16.5 ± 2.8 | 6.1 ± 3.2 | **−63.0%** |
| Wall time | 46 ± 15 s | 20 ± 7 s | **−55.6%** |

## 工作流程

1. **初始化**: `h5i init` → 创建 .git/.h5i/ 和 Agent 配置文件
2. **连接 Agent**: `h5i hook setup` → 为 Claude Code 设置钩子
3. **正常编程**: h5i 后台记录推理过程
4. **提交**: `h5i commit` → 自动附加 provenance
5. **分享**: `h5i push / h5i pull` → 同步团队

## 技术架构

纯 Git 副驾驶，存储在专用 refs 中，不污染工作树：

| Ref | 内容 |
|-----|------|
| refs/h5i/notes | 每次提交的元数据 |
| refs/h5i/context | 推理工作区作为 DAG |
| refs/h5i/ast | AST 快照用于结构化 blame |
| refs/h5i/checkpoints/\<agent\> | Agent 内存快照 |

## 其他功能

- `h5i log` — 带 prompts、models、tokens 的提交历史
- `h5i blame` — 行级/AST 级 blame，带 AI 溯源
- `h5i policy` — 策略即代码
- `h5i memory` — 快照/差异/恢复 Claude 或 Codex 内存状态
- `h5i resume` — 一屏交接简报
- `h5i rollback / rewind` — 回滚 AI 提交

## 安装方式

```bash
curl -fsSL https://raw.githubusercontent.com/Koukyosyumei/h5i/main/install.sh | sh
```

或从源码构建：

```bash
cargo install --git https://github.com/h5i-dev/h5i h5i-core
```
