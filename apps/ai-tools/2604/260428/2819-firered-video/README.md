# FireRed-OpenStoryline 视频项目

## 项目概述

- **项目名称**: FireRed-OpenStoryline - AI 视频创作智能体
- **来源**: https://github.com/FireRedTeam/FireRed-OpenStoryline
- **主题**: 基于 LLM/VLM 的自动化视频创作智能体
- **标签**: AI, 视频创作, LLM, VLM, 开源

## 核心亮点

1. **自然语言驱动**: 输入一句话，自动完成素材收集、剪辑、故事线构建、配音配乐
2. **对话式精修**: 通过自然语言删减、重组、修改字幕
3. **智能技能包**: 一键保存剪辑技能包，方便复刻同风格视频
4. **多风格支持**: 中草风格、幽默风格、产品种草、艺术风格等
5. **全流程自动化**: 从意图描述到成片输出

## 规格

- **分辨率**: 1080×1920（竖屏）
- **帧率**: 60fps
- **时长**: 约55秒
- **语速**: 1.2x
- **主题风格**: cyberpunk（赛博朋克）
- **字体**: 大字体（主标题100px+）
- **帧数**: 11帧

## 技术栈

- Python ≥3.11
- LLM/VLM 大语言模型
- FFmpeg
- Docker 支持
- ASR 语音识别

## 文件清单

```
firered-video/
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

- GitHub: https://github.com/FireRedTeam/FireRed-OpenStoryline
- HuggingFace Demo: https://fireredteam-firered-openstoryline.hf.space/
- ModelScope: https://www.modelscope.cn/studios/FireRedTeam/FireRed-OpenStoryline
