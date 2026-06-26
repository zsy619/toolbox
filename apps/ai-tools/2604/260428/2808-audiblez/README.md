# Audiblez 视频项目

## 项目概述

- **项目名称**: Audiblez - 从电子书生成有声书
- **来源**: https://github.com/santinic/audiblez
- **主题**: AI有声书生成工具
- **标签**: AI, TTS, 有声书, Kokoro, Python

## 规格

- **分辨率**: 1080×1920（竖屏）
- **帧率**: 60fps
- **时长**: 约30-45秒
- **语速**: 1.2x
- **主题风格**: tech-modern（蓝紫系）

## 核心亮点

1. **Kokoro-82M TTS**: 仅82M参数的高质量语音合成模型
2. **多语言支持**: 支持英/西/法/日/中/印地/意/葡萄牙等9种语言
3. **M4B输出**: 生成标准有声书格式
4. **GPU加速**: CUDA加速，5分钟完成《动物农场》
5. **GUI界面**: v4版本提供图形界面

## 文件清单

```
audiblez-video/
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
│       ├── gui-screenshot.png
│       └── cover.png
├── audio/
│   ├── neural_1_2x.m4a
│   └── subtitles.ass
└── video-project/
    ├── src/
    │   └── index.ts
    └── out/
        └── final-with-subs.mp4
```

## 来源链接

- GitHub: https://github.com/santinic/audiblez
- 文章: https://claudio.uk/posts/audiblez-v4.html
- Kokoro模型: https://huggingface.co/hexgrad/Kokoro-82M
