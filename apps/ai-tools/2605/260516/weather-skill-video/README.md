# Weather 技能视频项目

## 项目概述

本项目用于制作 Weather 技能的推广视频，主题为"实时天气与天气预报"。

## 项目信息

| 属性 | 值 |
|------|------|
| 技能名称 | Weather |
| 技能地址 | https://cn.clawhub-mirror.com/steipete/weather |
| 核心功能 | 免费获取实时天气与天气预报，无需API密钥 |
| 主题风格 | 科技现代风 (Tech Vision) |

## 技术规格

| 属性 | 值 |
|------|------|
| 分辨率 | 1080×1920 (竖屏) |
| 帧率 | 60fps |
| 时长 | 38.4 秒 |
| 配色 | 主色#2563EB, 辅色#7C3AED, 强调色#10B981, 背景色#0F172A |

## 文件结构

```
weather-skill-video/
├── docs/
│   ├── README.md          # 本文档
│   ├── video-script.md    # 视频脚本
│   ├── copy.md            # 营销文案
│   ├── wechat.md          # 公众号文案
│   ├── posting-guide.md   # 发布指南
│   └── assets/
│       └── cover.png       # 封面图
├── audio/
│   ├── full_narration.txt  # 配音文稿
│   ├── male_processed.m4a  # 处理后音频
│   └── subtitles.srt       # 字幕文件
├── out/
│   ├── video_with_subtitles.mp4   # 完整版（含字幕）
│   ├── video_with_audio.mp4       # 完整版（无字幕）
│   ├── wechat_video_30s.mp4       # 微信视频号版（30秒）
│   ├── xiaohongshu_video.mp4      # 小红书版
│   └── youtube_video.mp4          # YouTube版
└── video-project/
    ├── src/
    │   ├── index.tsx
    │   └── Video.tsx      # Remotion视频组件
    ├── out/
    └── package.json
```

## 视频内容

### 场景列表

1. **封面** (0-4s) - 技能名称与副标题
2. **痛点** (4-8s) - API注册繁琐的痛点
3. **解决方案** (8-12s) - Weather技能登场
4. **免费功能** (12-16s) - 无需API密钥
5. **全球城市** (16-20s) - 支持全球城市查询
6. **详细数据** (20-24s) - 温度湿度风速
7. **天气预报** (24-28s) - 未来天气预报
8. **极速响应** (28-32s) - 响应速度快
9. **安装方式** (32-38s) - 安装命令

### 配音文稿

> 今天给大家介绍一个超级实用的 OpenClaw 技能 —— Weather。
> 
> 想象一下，你不需要注册任何 API 密钥，不需要支付任何费用，直接就能获取实时天气信息和天气预报。这就是 Weather 技能带给你的体验。
> 
> 它支持全球城市的天气查询，可以获取当前温度、湿度、风速，还能查看未来几天的天气预报。无论你是做旅行规划、活动策划，还是日常出行参考，它都能帮你快速获取准确的天气数据。
> 
> 而且响应速度极快，数据来源可靠。安装也非常简单，只需要在终端执行一行命令就能完成。
> 
> 如果你经常需要查询天气，或者想让你的 AI 助手具备天气查询能力，这个技能绝对值得一试。

## 生成文件

### 视频文件

| 文件 | 时长 | 说明 |
|------|------|------|
| video_with_subtitles.mp4 | 38.4s | 完整版，含烧入字幕 |
| video_with_audio.mp4 | 38.4s | 完整版，无字幕 |
| wechat_video_30s.mp4 | 30s | 微信视频号版（截断） |
| xiaohongshu_video.mp4 | 38.4s | 小红书版 |
| youtube_video.mp4 | 38.4s | YouTube版 |

### 文档文件

| 文件 | 说明 |
|------|------|
| video-script.md | 视频脚本 |
| copy.md | 营销文案集 |
| wechat.md | 公众号文案 |
| posting-guide.md | 多平台发布指南 |

## 使用说明

### 视频渲染

```bash
cd video-project
npx remotion render WeatherSkill out/video_noaudio.mp4 --log=error
```

### 音频处理

```bash
# 原始音频生成
edge-tts --voice zh-CN-YunjianNeural --file audio/full_narration.txt --write-media audio/neural_full.mp3

# 音频后处理
ffmpeg -y -i audio/neural_full.mp3 \
  -af "silenceremove=start_periods=1:start_duration=0.2:start_threshold=-50dB:detection=peak,silenceremove=stop_periods=-1:stop_duration=0.2:stop_threshold=-50dB:detection=peak,atempo=1.2" \
  -c:a aac -b:a 256k -ar 48000 -ac 2 \
  audio/male_processed.m4a
```

### 字幕烧入

```bash
ffmpeg -y -i out/video_with_audio.mp4 \
  -vf "subtitles=audio/subtitles.srt:force_style='FontSize=11,Alignment=2,PrimaryColour=&H00FFFF&,Position=50%,MarginL=50,MarginR=50,MarginV=30'" \
  -c:v libx264 -preset fast \
  -c:a copy \
  out/video_with_subtitles.mp4
```

## 技术栈

- **Remotion** - 视频渲染框架
- **edge-tts** - 微软神经网络配音
- **FFmpeg** - 音视频处理
- **Python PIL** - 封面图生成