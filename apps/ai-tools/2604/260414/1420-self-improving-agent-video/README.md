# Self-improving Agent 视频项目

> 持续优化的 AI 智能体 - 视频宣传素材

## 项目概述

本项目为 [Self-improving Agent](https://cn.clawhub-mirror.com/pskoett/self-improving-agent) 技能视频制作，包含视频素材、多平台文案及发布指南。

## 文件结构

```
self-improving-agent-video/
├── final_vertical.mp4          # 最终视频 (1080×1920, 60fps, 46s)
├── audio/
│   ├── full_narration.txt     # 配音脚本原文
│   ├── neural_full.mp3         # 原始 TTS 音频
│   └── male_processed.m4a      # 处理后音频 (1.2x 速度)
├── docs/
│   ├── assets/
│   │   └── cover.png           # 封面图
│   ├── video-script.md         # 视频脚本
│   ├── copy.md                  # 多平台文案
│   ├── wechat.md                # 公众号文章
│   ├── README.md                # 项目说明
│   └── posting-guide.md          # 发布指南
├── video-project/
│   ├── src/
│   │   ├── Video.tsx            # Remotion 视频组件 (9场景)
│   │   └── index.tsx             # 入口文件
│   ├── assets/                   # 视频素材
│   ├── public/                   # 公共资源
│   └── out/
│       ├── final_vertical.mp4   # 最终输出
│       └── video_noaudio.mp4    # 无音频版
└── docs/
```

## 视频规格

| 项目 | 数值 |
|------|------|
| 分辨率 | 1080×1920 (竖屏) |
| 帧率 | 60fps |
| 时长 | 45.99 秒 |
| 编码 | H.264 / AAC |
| 文件大小 | ~1.3MB |

## 场景列表

| 场景 | 时长 | 内容 |
|------|------|------|
| S1 | 5s | 封面 - 标题展示 |
| S2 | 6s | 痛点 - AI 回答错误 |
| S3 | 5s | 解法暗示 |
| S4 | 6s | 产品名称揭晓 |
| S5 | 6s | 功能1 - 错误记录 |
| S6 | 6s | 功能2 - 修正方案 |
| S7 | 6s | 功能3 - 知识库 |
| S8 | 5s | 效果展示 |
| S9 | 1s | CTA - 立即体验 |

## 配色方案

```
主色 (Primary):   #2563EB
辅色 (Secondary): #7C3AED
强调色 (Accent):  #10B981
背景色 (Background): #0F172A
```

## 技术栈

- **Remotion** v4.0.448 - 视频渲染
- **React** 18.2 - UI 框架
- **TypeScript** 5.9 - 类型系统
- **FFmpeg** - 音视频处理
- **edge-tts** - AI 配音 (微软神经网络)

## 快速开始

```bash
cd video-project

# 开发预览
npm start

# 渲染视频
npm run build
```

## 相关链接

- 技能地址: https://cn.clawhub-mirror.com/pskoett/self-improving-agent
- Remotion 文档: https://remotion.dev
- edge-tts: https://github.com/rany2/edge-tts
