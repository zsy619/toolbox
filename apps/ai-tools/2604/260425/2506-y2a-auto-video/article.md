---
title: "Y2A-Auto - YouTube自动搬运到AcFun/bilibili"
summary: "Y2A-Auto是一款将YouTube视频自动搬运到AcFun和bilibili的一体化工具，支持AI翻译、字幕生成、内容审核、智能监控，全流程自动化。"
tags:
  - Y2A-Auto
  - YouTube
  - AcFun
  - bilibili
  - 自动搬运
  - 视频工具
platform: all
source: https://github.com/fqscfqj/Y2A-Auto
---

# Y2A-Auto - YouTube自动搬运到AcFun/bilibili

## 项目概述

**Y2A-Auto** 是一款将 YouTube 视频自动搬运到 AcFun / bilibili 的一体化工具，支持从下载、ASR、字幕翻译、字幕质检、内容审核到上传的全流程自动化。

> **一句话理解**：YouTube 视频一键同步到国内平台，全自动。

## 核心亮点

### 全流程自动化

| 步骤 | 功能 |
|------|------|
| 1 | `yt-dlp` 下载视频与封面 |
| 2 | 自动语音识别（ASR）生成字幕 |
| 3 | 字幕翻译、质检、后处理 |
| 4 | AI 生成标题、简介、标签 |
| 5 | 内容安全审核（阿里云 Green） |
| 6 | 自动上传到 AcFun / bilibili |

### 支持平台

- **AcFun**：国内老牌二次元视频平台
- **bilibili**：国内最大弹幕视频网站
- **双平台同步**：一次搬运，两个平台同时上线

### 智能功能

- **AI 字幕翻译**：支持 Whisper、Voxtral、FireRedASR2S
- **字幕质检**：AI 质量检查，确保字幕准确
- **内容审核**：阿里云 Green 安全检测
- **YouTube 监控**：频道/关键词定时抓取

## 技术规格

| 参数 | 值 |
|------|------|
| 语言 | Python 3.11+ |
| 部署方式 | Docker / 本地 |
| 硬件编码 | NVIDIA / Intel / AMD / CPU |
| 默认编码 | HEVC / H.265，失败回退 H.264 |

## 相关链接

- GitHub: https://github.com/fqscfqj/Y2A-Auto
- Telegram Bot: @Y2AAuto_bot
- 265 Stars · 开源项目