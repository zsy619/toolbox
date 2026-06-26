# Trello OpenClaw 技能视频项目

> 通过视频介绍 OpenClaw Trello 技能的核心功能和使用方法

## 项目信息

- **标题**: Trello
- **副标题**: 看板 · 列表 · 卡片管理
- **核心功能**: 通过 Trello REST API 管理 Trello 看板、列表和卡片
- **技能地址**: cn.clawhub-mirror.com/steipete/trello

## 技术规格

| 参数 | 值 |
|------|-----|
| 分辨率 | 1080×1920 (9:16 竖屏) |
| 帧率 | 60fps |
| 时长 | 48.8 秒 |
| 主题风格 | 科技现代风 (Tech Vision) |
| 主色 | `#2563EB` |
| 辅色 | `#7C3AED` |
| 强调色 | `#10B981` |
| 背景色 | `#0F172A` |

## 文件结构

```
trello-skill-video/
├── docs/
│   ├── assets/
│   │   └── cover.png              # 封面图 (1080×1920)
│   ├── video-script.md           # 视频脚本
│   ├── copy.md                   # 营销文案集
│   ├── wechat.md                # 公众号文案
│   ├── README.md                 # 项目说明
│   └── posting-guide.md         # 发布指南
├── audio/
│   ├── full_narration.txt       # 配音脚本
│   ├── neural_full.mp3          # 原始 TTS 音频
│   ├── male_processed.m4a       # 处理后音频 (1.05x)
│   ├── subtitles.srt            # 字幕
│   └── subtitles_adjusted.srt   # 时间轴调整后字幕
└── video-project/
    ├── src/
    │   └── Video.tsx            # Remotion 视频组件
    ├── out/
    │   ├── video_noaudio.mp4    # 无音频视频
    │   ├── final_vertical.mp4  # 最终视频 (无声)
    │   ├── final_with_subs.mp4 # 最终视频 (含字幕)
    │   └── platforms/
    │       ├── wechat.mp4      # 微信视频号版
    │       ├── xiaohongshu.mp4 # 小红书版
    │       ├── youtube_shorts.mp4 # YouTube Shorts 版
    │       └── douyin.mp4       # 抖音版
    └── tsconfig.json
```

## 场景结构 (9 场景)

| 场景 | 时间 | 内容 |
|------|------|------|
| 1 | 0-5.5s | 封面：Trello 大字 + 功能标签 |
| 2 | 5.5-11.5s | REST API 概念 |
| 3 | 11.5-18.5s | 看板管理 API |
| 4 | 18.5-24.5s | 列表操作 |
| 5 | 24.5-31.5s | 卡片管理 API |
| 6 | 31.5-36.5s | 标签与成员 |
| 7 | 36.5-42.5s | Webhook 事件订阅 |
| 8 | 42.5-47s | 四大适用场景 |
| 9 | 47-53s | CTA 安装命令 |

## 技术栈

- **Remotion**: 视频渲染框架
- **FFmpeg**: 视频处理、音频合成、字幕烧入
- **edge-tts**: 微软神经网络配音
- **Python PIL**: 封面图生成

## 快速开始

### 重新渲染视频

```bash
cd video-project
npx remotion render src/Video.tsx VerticalVideo out/video_noaudio.mp4
```

### 合并音频

```bash
ffmpeg -y -i out/video_noaudio.mp4 -i audio/male_processed.m4a \
  -c:v copy -c:a copy -map 0:v -map 1:a -shortest \
  out/final_vertical.mp4
```

### 烧入字幕

```bash
ffmpeg -y -i out/final_vertical.mp4 \
  -vf "subtitles=audio/subtitles_adjusted.srt:force_style='FontSize=11,Alignment=2,PrimaryColour=&H00FFFF&,Position=50%,MarginL=50,MarginR=50,MarginV=30'" \
  -c:a copy \
  out/final_with_subs.mp4
```
