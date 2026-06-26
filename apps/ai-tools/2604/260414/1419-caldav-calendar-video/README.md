# CalDAV Calendar 技能视频项目

> 用 Remotion 制作的 60fps 竖屏视频，介绍 CalDAV Calendar 开源技能

## 项目概述

本项目为 CalDAV Calendar 技能制作了一套多平台适配的视频素材，核心功能是展示如何用 OpenClaw 技能统一管理多个日历服务（Google Calendar、iCloud、Outlook、Zoho 等）。

## 视频规格

| 平台 | 文件名 | 分辨率 | 时长 | 帧率 |
|------|--------|--------|------|------|
| 通用竖屏 | `final_with_subs.mp4` | 1080×1920 | 47.5s | 60fps |
| 黄色字幕版 | `final_yellow_subs.mp4` | 1080×1920 | 47.5s | 60fps |
| 小红书版 | `final_xiaohongshu.mp4` | 1080×1920 | 47.5s | 60fps |
| YouTube Shorts | `final_youtube_short.mp4` | 1080×1920 | 47.5s | 60fps |
| YouTube 横屏 | `final_youtube_landscape.mp4` | 1920×1080 | 47.5s | 60fps |

## 字幕规格

- **字体大小**：10px
- **颜色**：#FFFF00（黄色）
- **位置**：距底边 30px
- **样式**：粗体 + 黑色描边

## 目录结构

```
caldav-calendar-video/
├── docs/
│   ├── assets/
│   │   ├── cover.png          # 封面图
│   │   └── generate_cover.py  # 封面生成脚本
│   ├── README.md              # 本文件
│   ├── copy.md                # 各平台文案（标题/描述/标签）
│   ├── wechat.md              # 微信公众号推文
│   ├── posting-guide.md       # 多平台发布指南
│   └── video-script.md        # 视频脚本与配音稿
├── audio/
│   ├── full_narration.txt     # 完整配音文稿
│   ├── subtitles.srt          # SRT 字幕
│   ├── subtitles.ass          # ASS 字幕（白字黑边）
│   ├── subtitles_yellow.ass   # ASS 字幕（黄字黑边）
│   ├── neural_full.mp3        # 神经网络配音 MP3
│   ├── neural_processed.m4a   # 处理后音频
│   └── out_with_subs.mp4      # 字幕烧录中间产物
├── video-project/            # Remotion 项目
│   ├── src/
│   ├── out/video_noaudio.mp4  # 无音频视频
│   └── package.json
├── final_with_subs.mp4        # 最终输出（白字字幕）
├── final_yellow_subs.mp4      # 最终输出（黄字字幕）
└── final_xiaohongshu.mp4      # 小红书适配版
```

## 制作流程

1. **Remotion 渲染** → `video-project/out/video_noaudio.mp4`
2. **TTS 配音** → `audio/neural_full.mp3`（edge-tts，Azure 神经网络）
3. **音频处理** → `audio/neural_processed.m4a`
4. **字幕生成** → `audio/subtitles.ass` / `audio/subtitles_yellow.ass`
5. **FFmpeg 合成** → `final_*.mp4`

## 字幕烧录命令

```bash
# 白字黑边字幕
ffmpeg -i video-project/out/video_noaudio.mp4 \
  -i audio/neural_processed.m4a \
  -i audio/subtitles.ass \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -shortest final_with_subs.mp4

# 黄字黑边字幕（项目要求版本）
ffmpeg -i video-project/out/video_noaudio.mp4 \
  -i audio/neural_processed.m4a \
  -i audio/subtitles_yellow.ass \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -shortest final_yellow_subs.mp4
```

## 相关链接

- OpenClaw 技能市场
- CalDAV Calendar 技能说明文档
- Remotion 官方文档
- edge-tts 微软神经网络配音
