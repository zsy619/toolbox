# Agent Browser - 视频项目

> AI 智能体无头浏览器自动化 - 宣传视频制作项目

## 项目概述

本项目用于制作 Agent Browser 技能视频，支持多平台发布（微信视频号、小红书、抖音、YouTube）。

## 主题信息

- **标题**: Agent Browser
- **副标题**: AI 智能体无头浏览器自动化
- **核心功能**: 面向 AI 智能体的无头浏览器自动化命令行工具，支持可访问性树快照与基于引用的元素定位功能
- **技能地址**: https://cn.clawhub-mirror.com/matrixy/agent-browser-clawdbot

## 技术规格

| 参数 | 值 |
|------|-----|
| 分辨率 | 1080×1920 (竖屏) |
| 帧率 | 60fps |
| 时长 | 约47秒 |
| 主题风格 | 科技现代风 (Tech Vision) |
| 主色 | #2563EB |
| 辅色 | #7C3AED |
| 强调色 | #10B981 |
| 背景色 | #0F172A |

## 项目结构

```
agent-browser-video/
├── docs/                           # 📄 文档目录
│   ├── README.md                   # 项目文档
│   ├── video-script.md             # 视频脚本
│   ├── copy.md                     # 营销文案集
│   ├── wechat.md                   # 公众号文案
│   ├── posting-guide.md            # 多平台发布指南
│   └── assets/                     # 视觉素材
│       └── cover.png               # 封面图
│
├── audio/                          # 🎵 音频文件
│   ├── full_narration.txt          # 完整配音文案
│   ├── neural_full.mp3             # 原始神经网络配音
│   └── male_processed.m4a          # 处理后配音（1.2x加速）
│
└── video-project/                  # 🎬 视频项目
    ├── src/
    │   ├── index.tsx               # 入口文件
    │   └── Video.tsx               # 视频组件（9场景）
    ├── out/                        # 渲染输出
    │   ├── agent-browser-video.mp4 # 主视频
    │   ├── agent-browser-wechat.mp4# 视频号版本
    │   ├── agent-browser-xhs.mp4   # 小红书版本
    │   └── agent-browser-youtube.mp4# YouTube版本
    ├── assets/                     # 视频素材
    ├── node_modules/
    └── package.json
```

## 视频场景设计 (9场景 × 60fps)

| 场景 | 名称 | 时长 | 内容 |
|------|------|------|------|
| 1 | 封面 | 5秒 | Agent Browser 标题展示 |
| 2 | 痛点 | 5秒 | 传统方案问题：XPath脆弱等 |
| 3 | 介绍 | 5秒 | 产品介绍，神器引出 |
| 4 | 功能一 | 7秒 | 可访问性树快照 |
| 5 | 功能二 | 6秒 | 基于引用的元素定位 |
| 6 | 应用 | 6秒 | 自动化测试、数据采集等 |
| 7 | 技术 | 5秒 | 主流浏览器、多AI框架 |
| 8 | 行动 | 5秒 | CTA 试试 Agent Browser |
| 9 | 结尾 | 3秒 | 开源免费，链接在描述栏 |

**总时长**: 47秒

## 快速开始

### 1. 渲染视频

```bash
cd /Users/zhushuyan/.openclaw/workspace/agent-browser-video/video-project

# 渲染视频（不带音频，因为需要单独合并处理后的音频）
npx remotion render AgentBrowserVideo out/agent-browser-video.mp4
```

### 2. 合并音视频

```bash
ffmpeg -y \
  -i out/agent-browser-video.mp4 \
  -i ../audio/male_processed.m4a \
  -c:v copy -c:a copy \
  -shortest \
  out/agent-browser-final.mp4
```

### 3. 烧入字幕

```bash
ffmpeg -y \
  -i out/agent-browser-final.mp4 \
  -vf "subtitles=../audio/subtitles.srt:force_style='FontSize=11,Alignment=2,PrimaryColour=&H00FFFF&,Position=50%,MarginL=50,MarginR=50,MarginV=30'" \
  out/agent-browser-with-subs.mp4
```

### 4. 生成多平台版本

```bash
# 微信视频号（保持原始）
cp out/agent-browser-final.mp4 out/agent-browser-wechat.mp4

# 小红书（添加水印或调整）
# ...

# YouTube（保持原始）
cp out/agent-browser-final.mp4 out/agent-browser-youtube.mp4
```

## 音频说明

| 文件 | 说明 |
|------|------|
| `neural_full.mp3` | edge-tts 原始生成，58秒 |
| `male_processed.m4a` | atempo=1.2x 加速处理，约43秒 |

**配音脚本**: `audio/full_narration.txt`

## 文档说明

| 文件 | 用途 |
|------|------|
| `video-script.md` | 完整的视频分镜脚本 |
| `copy.md` | 各平台营销文案 |
| `wechat.md` | 公众号专用文案 |
| `posting-guide.md` | 各平台发布指南 |

## 相关链接

- **技能地址**: https://cn.clawhub-mirror.com/matrixy/agent-browser-clawdbot
- **GitHub**: https://github.com/matrixy/agent-browser-clawdbot

## 技术栈

- **Remotion**: 视频渲染框架
- **edge-tts**: 微软神经网络配音
- **ffmpeg**: 音视频处理
- **Python PIL**: 封面图生成
