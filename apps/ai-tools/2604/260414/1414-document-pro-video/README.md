# Document Pro 视频项目

## 项目概述

为 Document Pro 技能制作的主题宣传视频，支持多平台发布。

## 技能信息

- **技能名称**: Document Pro
- **技能地址**: https://cn.clawhub-mirror.com/jackeven02/document-pro
- **核心功能**: 赋予AI强大的文档处理能力，支持PDF、Word、PPT、Excel的读取、解析与信息提取

## 视频规格

| 规格 | 参数 |
|------|------|
| 分辨率 | 1080×1920 (竖屏) |
| 帧率 | 60fps |
| 时长 | 48.6秒 |
| 主题风格 | 科技现代风 (Tech Vision) |
| 主色 | #2563EB |
| 辅色 | #7C3AED |
| 强调色 | #10B981 |
| 背景色 | #0F172A |

## 文件结构

```
document-pro-video/
├── docs/
│   ├── assets/
│   │   └── cover.png          # 封面图 (1080×1920)
│   ├── video-script.md         # 视频脚本 (9场景)
│   ├── copy.md                 # 多平台文案
│   ├── wechat.md               # 公众号推文
│   └── README.md               # 项目说明
├── audio/
│   ├── full_narration.txt      # 配音脚本
│   ├── full_narration.srt      # 字幕文件
│   ├── male_processed.m4a      # 男声配音 (1.2x速度)
│   └── neural_full.mp3         # 原始TTS音频
├── video-project/
│   ├── src/
│   │   ├── index.tsx          # Remotion入口
│   │   └── Video.tsx           # 9场景视频组件
│   ├── public/
│   │   └── audio/
│   │       └── male_processed.m4a
│   └── out/
│       └── video_noaudio.mp4    # 无音频视频
├── out/
│   ├── video_final.mp4         # 最终视频 (主版本)
│   ├── wechat_video.mp4        # 微信视频号版本
│   ├── xiaohongshu_video.mp4   # 小红书版本
│   └── youtube_video.mp4       # YouTube版本
└── package.json
```

## 场景设计

| 场景 | 时间 | 内容 |
|------|------|------|
| S1 | 0-3s | 封面 - Document Pro标题 |
| S2 | 3-9s | 问题痛点 - 4种文档格式的困扰 |
| S3 | 9-15s | 解决方案介绍 |
| S4 | 15-21s | 功能1 - 多格式兼容 |
| S5 | 21-27s | 功能2 - AI智能解析 98%准确率 |
| S6 | 27-33s | 功能3 - 批量处理 20x效率 |
| S7 | 33-39s | 功能4 - 快速精准 |
| S8 | 39-45s | 行动号召 |
| S9 | 45-48.6s | 结尾 - 链接展示 |

## 技术栈

- **Remotion**: 视频渲染框架
- **React**: 视频组件开发
- **FFmpeg**: 视频处理、音频合并
- **edge-tts**: 微软神经网络配音
- **Python PIL**: 封面图生成

## 使用方法

### 重新渲染视频
```bash
cd video-project
npx remotion render src/index.tsx VerticalVideo out/video_noaudio.mp4 --log=error
```

### 合并音视频
```bash
cd /Users/zhushuyan/.openclaw/workspace/document-pro-video
ffmpeg -y -i video-project/out/video_noaudio.mp4 \
  -i audio/male_processed.m4a \
  -vf "subtitles=audio/full_narration.srt:force_style='FontName=Arial,FontSize=36,PrimaryColour=&H00FFFFFF'" \
  -c:v libx264 -crf 18 -preset fast \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  out/video_final.mp4
```

## 平台发布

| 平台 | 视频文件 | 封面图 | 文案 |
|------|----------|--------|------|
| 微信视频号 | out/wechat_video.mp4 | docs/assets/cover.png | docs/copy.md |
| 小红书 | out/xiaohongshu_video.mp4 | docs/assets/cover.png | docs/copy.md |
| YouTube | out/youtube_video.mp4 | docs/assets/cover.png | docs/copy.md |
| 公众号 | - | docs/assets/cover.png | docs/wechat.md |
