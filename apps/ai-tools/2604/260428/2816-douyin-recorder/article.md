# DouyinLiveRecorder 项目详解

## 项目简介

DouyinLiveRecorder 是一款简易的可循环值守的直播录制工具，基于 FFmpeg 实现多平台直播源录制，支持自定义配置录制以及直播状态推送。

## 支持平台（40+）

### 国内平台
- 🇨🇳 抖音、TikTok
- 📺 B站（哔哩哔哩）
- 🎮 快手、斗鱼、虎牙
- 🎙️ YY、Acfun、映客
- 🌸 花椒直播、酷狗直播
- 📱 小红书、知乎直播
- 🛒 淘宝直播、京东直播

### 海外平台
- 🌐 YouTube
- 🎮 Twitch
- 💜 TikTok
- 🌸 ShowRoom
- 📺 bigo
- 其他 30+ 平台

## 核心功能

### 1. FFmpeg 录制
基于 FFmpeg 实现，稳定高效，支持多种格式输出。

### 2. 自动监测
自动监测直播状态，开播即录制，无需人工干预。

### 3. 循环值守
适合长期挂机录制，不错过任何一场直播。

### 4. 批量录制
支持同时录制多个主播/多个平台。

### 5. Docker 部署
一行命令即可部署，支持 Windows、Linux、Mac。

## 技术架构

- **语言**: Python 3.11+
- **录制引擎**: FFmpeg
- **部署方式**: Docker Compose
- **配置**: JSON/YAML 配置文件

## 快速开始

```bash
# Docker 部署
docker run -d \
  --name douyin-recorder \
  -v /path/to/config:/app/config \
  ihmily/douyin-live-recorder

# 或克隆后运行
python demo.py
```

## 适用场景

- 📺 长期追直播的主播粉丝
- 🎬 视频创作者采集素材
- 📚 研究直播内容的学者
- 🏢 MCN 机构批量管理
