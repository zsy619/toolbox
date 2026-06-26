# awesome-design-md - 让 AI 前端生成更美观

## 项目概述

一个 GitHub 项目，通过收集各知名产品的 DESIGN.md 设计规范文件，让 AI 生成的前端代码风格更加统一、美观。

- **GitHub**: https://github.com/search?q=awesome-design-md
- **核心理念**: 用 Markdown 描述设计系统，让 AI 直接读取
- **收录内容**: Linear、Vercel、Stripe、Notion、Spotify、Supabase 等的设计规范

## 核心价值

### 问题痛点
- AI 编程工具（Claude Code、Cursor、Codex）代码生成成熟
- 但 UI 风格难以稳定：按钮颜色、间距、字号每次都像随机抽奖
- 程序员面对混乱 UI，就像在解没有标准答案的题

### 解决方案
把设计系统写进 Markdown 文件，AI 编程 Agent 直接读取

### 优点
- 不需要 Figma 导出
- 不需要 JSON schema
- 不需要专门配置工具
- Markdown 是大模型擅长的格式

## 工作原理

1. **DESIGN.md**：Markdown 格式的设计规范文档
2. **AI 读取**：AI 编程 Agent 在生成代码前读取
3. **风格统一**：遵循统一的视觉风格规范

## 支持的品牌

| 品牌 | 风格特点 |
|------|----------|
| Linear | 暗色、科技感、高端 |
| Vercel | 黑白极简、强调排版与留白 |
| Stripe | 精致、金融感 |
| Notion | 简约、内容为主 |
| Spotify | 现代、音乐感 |
| Supabase | 暗色、工程感 |

## 使用方法

1. 找一个喜欢的 DESIGN.md 风格
2. 复制到项目根目录
3. 告诉 AI：生成 UI 时必须遵循这个文件

## 效果对比

**使用前**：纯靠模型猜 UI，一致性差

**使用后**：
- 字体层级更稳定
- 组件间距更合理
- 按钮 hover 效果更一致
- 暗色模式更像"有设计系统支撑"

## Unix 哲学

> do one thing and do it well

- 不引入复杂工具链
- 不要求设计师额外学习
- 不依赖某个特定平台
- 只用纯文本表达规则

## 局限性

- 不能替代完整的交互设计
- 不能替代品牌设计团队的审美判断
- 部分信息可能是推断而非官方来源
- 复杂组件和动效仍需手工补充

---

*视频制作于 2026-04-11*