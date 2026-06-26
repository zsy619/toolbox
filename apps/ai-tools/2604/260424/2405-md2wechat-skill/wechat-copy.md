---
title: 用Markdown写公众号，像发朋友圈一样简单！
author: 元曜科技
summary: md2wechat 是一个让微信公众号写作更高效的工具，一行命令完成 Markdown 到精美排版的转换，支持30+主题，自动发送到微信草稿箱。
tags:
  - Markdown
  - 微信公众号
  - 排版工具
  - AI写作
  - 效率工具
platform: wechat
date: 2026-04-22
source: https://github.com/geekjourneyx/md2wechat-skill
---

# 用Markdown写公众号，像发朋友圈一样简单！

> 「用 Markdown 写文章 → 一键转换 → 自动发到微信草稿箱」

## 五大核心功能

| 功能 | 命令 | 说明 |
|------|------|------|
| 📝 Markdown 转换 | `convert` | 一键转换为微信格式 |
| ✍️ AI 风格写作 | `write` | 自动生成结构完整的文章 |
| 🧹 AI 去痕 | `humanize` | 去除 AI 痕迹，更自然 |
| 🖼️ 小绿书 | `create_image_post` | 最多支持 20 张图片 |
| 📤 一键推送 | `convert --draft` | 直接发到微信草稿箱 |

## 30+ 精美主题

| 系列 | 特点 | 命令示例 |
|------|------|---------|
| Minimal | 干净克制，纯色文字 | `--theme minimal-gold` |
| Focus | 居中对称，标题双横线 | `--theme focus-gold` |
| Elegant | 层次丰富，左边框递减 | `--theme elegant-gold` |
| Bold | 视觉冲击，满底色圆角 | `--theme bold-gold` |

每系列 8 种颜色：gold / green / blue / orange / red / navy / gray / sky

## 快速上手

```bash
# 1. 安装
brew install geekjourneyx/tap/md2wechat

# 2. 配置微信
md2wechat config init

# 3. 开始使用
md2wechat convert article.md --draft
```

## 支持所有主流 AI 平台

Claude Code ✅ | OpenCode ✅ | Obsidian ✅ | OpenClaw ✅

---

**md2wechat - 让公众号写作更简单！**

#Markdown #微信公众号 #排版工具 #AI写作 #效率工具
