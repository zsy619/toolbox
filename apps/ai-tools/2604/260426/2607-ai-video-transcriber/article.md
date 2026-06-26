---
title: "AI Video Transcriber - 用AI转录和总结视频/播客"
summary: "开源AI工具，支持YouTube、TikTok、Bilibili等30+平台，自动转录视频并生成摘要，多语言支持"
tags:
  - AI工具
  - 视频转录
  - 字幕生成
  - Whisper
  - 多平台支持
  - 开源项目
  - 视频处理
  - AI摘要
platform: all
source: https://github.com/wendy7756/AI-Video-Transcriber
---

# AI Video Transcriber

An AI-powered tool to transcribe and summarize videos and podcasts — supports YouTube, TikTok, Bilibili, Apple Podcasts, SoundCloud, and 30+ platforms.

## 核心特性

- 🎥 **多平台支持**：支持YouTube、TikTok、Bilibili、Apple Podcasts、SoundCloud等30+平台
- ⚡ **字幕优先架构**：对于有原生字幕的平台（如YouTube），直接提取字幕，无需下载音频，速度极快
- 🗣️ **智能转录**：使用Faster-Whisper进行高精度语音转文字
- 🤖 **AI文本优化**：自动纠错、补全句子、智能分段落
- 🌍 **多语言摘要**：支持多种语言生成智能摘要
- 🔧 **自定义模型**：可配置任何OpenAI兼容API端点（OpenAI、OpenRouter、本地LLM等）
- ⚙️ **条件翻译**：当摘要语言与源语言不同时，自动翻译字幕
- 📱 **移动端友好**：完美支持移动设备

## 系统要求

- Python 3.8+
- FFmpeg
- 任意OpenAI兼容提供商的API密钥

## 硬件要求

| 配置 | 要求 |
|------|------|
| 最低 | 4GB RAM，双核CPU |
| 推荐 | 8GB RAM，四核CPU |
| 理想 | 16GB RAM，多核CPU，SSD存储 |

## Whisper模型对比

| 模型 | 参数 | 仅英语 | 多语言 | 速度 | 内存占用 |
|------|------|--------|--------|------|----------|
| tiny | 39M | ✓ | ✓ | 快 | 低 |
| base | 74M | ✓ | ✓ | 中等 | 低 |
| small | 244M | ✓ | ✓ | 中等 | 中等 |
| medium | 769M | ✓ | ✓ | 慢 | 中等 |
| large | 1550M | ✗ | ✓ | 非常慢 | 高 |

## 工作原理

1. **输入视频URL**：粘贴YouTube、Bilibili或其他支持平台的视频链接
2. **选择摘要语言**：从下拉菜单中选择输出语言
3. **（可选）配置AI模型**：点击AI设置展开面板，输入API Base URL和API Key
4. **开始处理**：点击转录按钮，进度条显示当前模式
   - ⚡ 字幕模式（绿色）：找到原生字幕，几秒内完成
   - 🎙 Whisper模式（琥珀色）：无字幕可用，下载音频进行转录
5. **查看结果**：审核优化后的字幕和AI摘要
6. **下载文件**：保存Markdown格式的文件（字幕/翻译/摘要）

## 技术栈

- **后端**：FastAPI + yt-dlp + Faster-Whisper + OpenAI API
- **前端**：HTML5 + CSS3 + JavaScript (ES6+) + Marked.js + Font Awesome
