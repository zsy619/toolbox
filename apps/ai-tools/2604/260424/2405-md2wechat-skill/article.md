---
title: "md2wechat-skill - Markdown转微信公众号神器"
summary: "用 Markdown 写公众号文章，一键转换为精美排版并自动上传到微信草稿箱。支持 AI 多主题样式和批量发布，让公众号写作像发朋友圈一样简单。"
source: https://github.com/geekjourneyx/md2wechat-skill
tags:
  - Markdown
  - 微信公众号
  - 排版工具
  - AI 写作
  - CLI工具
  - 效率工具
platform: all
---

# md2wechat-skill

## 项目概述

**md2wechat** 是一个让微信公众号写作更高效的工具。

> **一句话理解**：用 Markdown 写文章 → 一键转换 → 自动发到微信草稿箱

## 核心定位

- **一句话**：用 Markdown 写公众号，像发朋友圈一样简单
- **安装方式**：Homebrew / NPM / Go / install.sh（支持 macOS/Linux/Windows）
- **最新版本**：v2.0.7
- **作者**：geekjourneyx（独立开发者/AI Builder）

## 五大核心功能

| 功能 | 命令 | 说明 |
|------|------|------|
| Markdown 转换 | `convert` | 将 Markdown 转换为微信格式 HTML |
| AI 风格写作 | `write` | 用创作者风格辅助写作，自动生成文章和封面提示词 |
| AI 去痕 | `humanize` | 去除 AI 生成痕迹，让文章听起来更自然 |
| 小绿书 | `create_image_post` | 创建图片消息，最多 20 张图片 |
| 草稿推送 | `convert --draft` | 一键发送到微信草稿箱 |

## write vs convert

| 对比项 | `write` 命令 | `convert` 命令 |
|--------|-------------|----------------|
| **输入** | 一个想法/观点/片段 | 完整的 Markdown 文件 |
| **输出** | 结构化提示词（AI 处理后生成文章） | 微信格式 HTML |
| **用途** | 从零开始创作 | 格式转换已有内容 |
| **封面** | 自动生成封面提示词 | 需要手动指定封面图 |

## 两种转换模式

| 模式 | 适合谁 | 特点 |
|------|--------|------|
| API 模式 | 追求稳定、快速 | 调用 md2wechat.cn API，秒级响应 |
| AI 模式 | 追求精美排版 | 生成 AI request，由 Claude 等继续生成 HTML |

## 主题系统（30+ 主题）

**四大系列**：

| 系列 | 特点 | 命令示例 |
|------|------|---------|
| Minimal | 干净克制，纯色文字无装饰 | `--theme minimal-gold` |
| Focus | 居中对称，标题上下双横线 | `--theme focus-gold` |
| Elegant | 层次丰富，左边框递减 + 渐变背景 | `--theme elegant-gold` |
| Bold | 视觉冲击，标题满底色 + 圆角投影 | `--theme bold-gold` |

每系列 8 种颜色：gold / green / blue / orange / red / navy / gray / sky

另有 6 个基础主题：default / bytedance / apple / sports / chinese / cyber

## AI 写作风格

当前内置风格：**Dan Koe**（深刻犀利、接地气）

可自定义：在 `writers/` 目录下创建 YAML 文件即可。

## AI 去痕

| 强度 | 命令 | 适合场景 |
|------|------|---------|
| gentle | `--intensity gentle` | 文章已经比较自然 |
| medium | 默认 | 大多数场景 |
| aggressive | `--intensity aggressive` | AI 味很重的文章 |

## 多平台支持

| 平台 | 支持方式 |
|------|---------|
| Claude Code | `npx skills add ...` |
| Codex | `npx skills add ...` |
| OpenCode | `npx skills add ...` |
| Obsidian / Claudian | 安装 CLI + skill |
| OpenClaw | 专用 skill 包 |

## 安装方式

```bash
# macOS 优先 Homebrew
brew install geekjourneyx/tap/md2wechat

# Node 环境
npm install -g @geekjourneyx/md2wechat

# Go 环境
go install github.com/geekjourneyx/md2wechat-skill/cmd/md2wechat@v2.0.7

# 一键安装脚本
curl -fsSL https://github.com/geekjourneyx/md2wechat-skill/releases/download/v2.0.7/install.sh | bash
```

## 快速使用

```bash
# 1. 配置微信
md2wechat config init

# 2. 写好 Markdown 文章

# 3. 预览效果
md2wechat preview article.md

# 4. 转换并发送草稿
md2wechat convert article.md --draft --cover cover.jpg
```

## AI 图片生成

支持多种服务：ModelScope / TuZi / OpenAI / OpenRouter / Google Gemini / 火山引擎

```bash
# 生成封面图
md2wechat generate_cover --article article.md

# 生成信息图
md2wechat generate_infographic --article article.md --preset infographic-comparison
```

## 适合人群

| 你是 | 痛点 | md2wechat 帮你 |
|------|------|---------------|
| 内容创作者 | 微信编辑器太难用，排版花时间 | Markdown 写作，自动排版 |
| 产品经理 | 要发公告，但不会 HTML | 不用学代码，一行命令搞定 |
| 程序员 | 习惯 Markdown，讨厌微信编辑器 | 保持你的写作习惯 |
| AI 用户 | 用 AI 生成内容，但要手动复制粘贴 | AI 生成 → 微信草稿，无缝衔接 |

## 相关链接

- GitHub：https://github.com/geekjourneyx/md2wechat-skill
- 国际站：https://www.md2wechat.com/
- 国内站：https://md2wechat.cn/
