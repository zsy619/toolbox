# Slack 消息与频道控制技能 — 项目说明

## 项目概述

本项目展示如何为 Slack 添加「消息控制」能力，包括表情回应和消息置顶两个核心功能。

## 功能特性

- **表情回应**：对频道或私信中的任何消息快速添加表情回应，一键反馈态度
- **消息置顶**：将重要消息置顶，确保所有成员都能看到；支持取消置顶
- **即时反馈**：无需打字，团队沟通更高效

## 技术栈

- Remotion：竖屏视频渲染（1080×1920，60fps）
- edge-tts：微软神经网络配音
- ffmpeg：字幕烧录与视频合成

## 文件结构

```
slack-skill-video/
├── audio/
│   ├── full_narration.txt     # 完整旁白文案
│   ├── male_processed.m4a     # 处理后的男声配音
│   ├── neural_full.mp3        # 原始神经网络配音
│   └── subtitles.srt          # SRT 字幕文件
├── docs/
│   ├── README.md              # 本文件
│   ├── copy.md                # 社交媒体文案
│   ├── wechat.md              # 微信公众号推文
│   ├── posting-guide.md       # 多平台发布指南
│   └── video-script.md        # 视频脚本
├── output/
│   ├── final_yellow_subs.mp4  # 最终输出（含黄色硬字幕）
│   └── ...
└── video-project/
    ├── src/                   # Remotion 源码
    └── out/video_noaudio.mp4  # 无音频视频片段
```

## 字幕规格

- 字体大小：10px
- 颜色：#FFFF00（黄色）
- 位置：距底边 30px
- 样式：粗体 + 黑色描边

## 制作流程

1. 用 Remotion 渲染视频片段（video_noaudio.mp4）
2. 用 edge-tts 生成配音（male_processed.m4a）
3. 用 ffmpeg 烧录 SRT 字幕，合成最终视频

## 许可证

MIT License
