# 火宝短剧 - 项目分析文档

## 项目基本信息

| 参数 | 值 |
|------|------|
| 项目名称 | 火宝短剧 (Huobao Drama) |
| GitHub | https://github.com/chatfire-AI/huobao-drama |
| 许可证 | CC BY-NC-SA 4.0 |
| 状态 | 开源活跃 |
| 技术栈 | TypeScript 全栈 (Nuxt 3 + Hono + Mastra) |

## 核心定位

**一句话**：基于 AI 的一站式短剧生成平台，实现从剧本到成片的全流程自动化。

**目标用户**：
- 短视频创作者
- 内容创业者
- 短剧制作团队
- 对 AI 视频制作感兴趣的个人

## 功能特性

### 四大核心能力

1. **AI 驱动**
   - 使用大语言模型解析剧本
   - 智能提取角色、场景和分镜信息

2. **智能创作**
   - AI 绘图生成角色形象
   - 场景背景自动生成

3. **视频生成**
   - 文生视频模型
   - 图生视频模型
   - 自动生成分镜视频

4. **完整工作流**
   - 剧本 → 角色设计 → 分镜 → 视频合成
   - 一站式完成

### 功能列表

| 分类 | 功能点 |
|------|--------|
| AI 生成 | AI 生成角色形象、批量角色生成 |
| 角色管理 | 角色图片上传、角色音色分配与试听 |
| 分镜制作 | AI 自动拆解分镜脚本、场景描述和镜头设计 |
| 图片生成 | 分镜图片生成（文生图）、宫格图生成与切分 |
| 视频合成 | 图生视频自动生成、TTS 配音生成 |
| 后处理 | FFmpeg 单镜头合成、整集拼接导出 |
| 素材管理 | 素材库统一管理、本地存储支持 |
| 任务追踪 | 任务进度追踪 |

### 五大内置 Agent

| Agent | 职责 |
|-------|------|
| script_rewriter | 小说 → 格式化剧本改写 |
| extractor | 角色 + 场景智能提取与去重 |
| storyboard_breaker | 剧本 → 分镜序列拆解 |
| voice_assigner | 角色音色自动分配 |
| grid_prompt_generator | 角色/场景/宫格图提示词生成 |

### AI 服务支持

| 类型 | 支持厂商 |
|------|----------|
| 图片 | OpenAI、Gemini、MiniMax、火山引擎、阿里、Chatfire |
| 视频 | MiniMax、火山引擎/Seedance、Vidu、阿里 |
| TTS | MiniMax |

### 技术架构

**前端**：
- Nuxt 3 + Vue 3 + TypeScript
- 纯 CSS（无 UI 框架）
- 暗色主题

**后端**：
- Hono + Drizzle ORM + better-sqlite3
- Mastra AI Agents
- FFmpeg 视频处理

### 部署方式

1. **Docker 一键部署**（推荐）
2. **本地开发**（前后端分离）
3. **手动部署**（前后端分离构建）

## 竞品分析

**优势**：
- 开源免费
- 全流程自动化
- 支持多 AI 厂商
- Docker 部署简单

**差异化**：
- 专注短剧垂直场景
- 内置 5 个专业 Agent
- 支持本地部署

## 商业化

- 有商业版：https://drama.chatfire.site/shortvideo
- 有小说生成版：https://marketing.chatfire.site/huobao-novel/

## 项目亮点

1. **TypeScript 全栈** - 前后端统一语言
2. **Mastra Agent 框架** - 灵活的 AI Agent 配置
3. **多厂商适配** - 不绑定单一 AI 服务商
4. **本地优先** - 数据本地存储，保护隐私
5. **Docker 支持** - 开箱即用
