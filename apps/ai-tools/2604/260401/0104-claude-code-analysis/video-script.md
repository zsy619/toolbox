# Claude Code 源码架构深度研究 - 视频脚本 (60秒版)

## 元数据
- **平台**: 微信视频号 / 小红书 / 抖音
- **时长**: 65秒
- **主题**: 科技现代风 (Tech Vision)
- **风格**: 现代科技、代码主题

## 小红书版本

### 标题
Anthropic 把 Claude Code 架构讲清楚了！🔍

### 正文
基于 cli.js.map 还原的 Claude Code 源码深度分析报告，11大章节系统性拆解。

📊 **核心数据**
- 4756 源码文件数
- <5% LLM API 调用
- 14+ 系统模块
- 4 种 Built-in Agents
- 4态 权限模型
- 3层 上下文压缩

🔍 **核心发现**
❌ 误解：Claude Code 只是个 CLI 工具
✅ 真相：Agent Operating System

📚 **核心章节**
1. Prompt 系统 - 模块化 Runtime Assembly
2. Agent 系统 - 职责分工而不是万能 Worker
3. Skills/Plugins/Hooks/MCP 生态
4. 四态权限模型
5. 先读后改铁律

### 标签
#ClaudeCode #AI编程 #源码分析 #Anthropic #程序员 #技术分享 #AgentOS #LLM #编程工具 #深度技术

## 视频号版本

### 标题
Claude Code 源码架构深度研究 | 65秒精讲

### 描述
基于 cli.js.map 还原源码，深入解析 Claude Code 的 Agent Operating System 架构设计。

### 话题
#ClaudeCode #AI编程 #源码分析 #技术深度

## 视频脚本 (65秒)

### 场景1: 封面 (0-5秒)
- **视觉**: 全屏封面图 + 标题叠加
- **文字**: "Claude Code 源码架构深度研究"
- **动画**: 封面图 + 文字淡入

### 场景2: 核心发现 (5-10秒)
- **视觉**: 误解 vs 真相 对比
- **文字**: ❌ 误解 vs ✅ 真相 (Agent Operating System)
- **动画**: 误解渐隐，真相高亮

### 场景3: 核心数据 (10-16秒)
- **视觉**: 数据卡片网格
- **文字**: 4756 / <5% / 14+ / 4 / 4态 / 3层
- **动画**: 数字滚动入场

### 场景4: Prompt系统 (16-22秒)
- **视觉**: 架构图背景 + 文字
- **文字**:
  - 💭 模块化 Runtime Assembly
  - 📋 getSystemPrompt() 真实结构
  - 🔄 Prompt Cache Boundary
- **动画**: 模块依次出现

### 场景5: Built-in Agents (22-28秒)
- **视觉**: Agent架构图背景
- **文字**:
  - 🔵 Explore Agent - 探索模式
  - 🟠 Plan Agent - 计划模式
  - 🟢 Verify Agent - 验证模式
  - 🟣 General Agent - 通用模式
- **动画**: 四种Agent依次出现

### 场景6: Fork vs Normal (28-34秒)
- **视觉**: 分支图示
- **文字**:
  - Fork Path - 分支探索
  - Normal Path - 常规执行
- **动画**: 两条路径分开

### 场景7: Skills生态 (34-40秒)
- **视觉**: 模块卡片
- **文字**:
  - 📦 Skill - 技能扩展
  - 🔌 Plugin - 插件系统
  - 🪝 Hook - 钩子机制
  - 🔗 MCP - Model Context Protocol
- **动画**: 模块依次出现

### 场景8: 四态权限 (40-46秒)
- **视觉**: 权限状态图
- **文字**:
  - ✅ Allow - 允许
  - ❓ Ask - 询问
  - 🚫 Deny - 禁止
  - 📖 ReadOnly - 只读
- **动画**: 四种状态依次出现

### 场景9: 核心设计 (46-52秒)
- **视觉**: 设计原则展示
- **文字**:
  - 🛡️ 先读后改铁律
  - 💭 三层上下文压缩
  - 🎭 Sub-Agent 身份注入
- **动画**: 原则依次淡入

### 场景10: 护城河 (52-58秒)
- **视觉**: 核心优势展示
- **文字**:
  - ⚡ 高效的Agent协作
  - 🔒 安全优先的设计
  - 🚀 强大的扩展生态
- **动画**: 优势依次出现

### 场景11: CTA (58-65秒)
- **视觉**: 深色背景 + 居中文字
- **文字**: "深入探索 AI 编程的未来"
- **动画**: 文字淡入 + 上浮

## 内容插图
- 插图1: 架构全景图 (Prompt/Agent/Skills/权限)
- 插图2: Agent系统图 (Explore/Plan/Verify/General)
- 插图3: 安全机制图 (4态权限/3层压缩)
