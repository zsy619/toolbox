# DouyinLiveRecorder 视频项目

## 项目概述

- **项目名称**: DouyinLiveRecorder - 多平台直播录制工具
- **来源**: https://github.com/ihmily/DouyinLiveRecorder
- **主题**: 开源多平台直播录制工具，40+平台支持
- **标签**: AI, 直播, FFmpeg, 录制工具, 开源

## 核心亮点

1. **多平台支持**: 抖音、TikTok、B站、快手、斗鱼、虎牙、YouTube 等 40+ 平台
2. **FFmpeg 实现**: 基于 FFmpeg 实现，稳定高效
3. **自动监测**: 自动监测直播状态并录制
4. **循环值守**: 适合长期挂机录制
5. **批量录制**: 支持批量录制多个主播内容

## 规格

- **分辨率**: 1080×1920（竖屏）
- **帧率**: 60fps
- **时长**: 约50-55秒
- **语速**: 1.2x
- **主题风格**: cyberpunk（赛博朋克）
- **字体**: 大字体（主标题100px+）
- **帧数**: ≥10帧

## 技术栈

- Python 3.11+
- FFmpeg
- Docker 支持
- 多平台直播源解析

## 文件清单

```
douyin-recorder/
├── docs/
│   ├── README.md
│   ├── article.md
│   ├── video-script.md
│   ├── copy.md
│   ├── wechat-copy.md
│   ├── posting-guide.md
│   ├── landing-page.html
│   ├── article-page.html
│   ├── wechat-page.html
│   ├── session-log.md
│   ├── report.json
│   └── assets/
│       ├── cover.png
│       ├── cover-wechat.png
│       └── cover-xiaohongshu.png
├── audio/
│   ├── neural_1_2x.m4a
│   └── subtitles.ass
└── video-project/
    └── out/
        └── final-with-subs.mp4
```

## 来源链接

- GitHub: https://github.com/ihmily/DouyinLiveRecorder
- Docker: https://hub.docker.com/r/ihmily/douyin-live-recorder
