# Chandra OCR 2 视频项目

## 项目概述

- **项目名称**: Chandra OCR 2 - 文档智能识别模型
- **来源**: https://github.com/datalab-to/chandra
- **主题**: SOTA 文档 OCR 模型，支持 PDF/图片转 HTML/Markdown/JSON
- **标签**: AI, OCR, 文档识别, 开源

## 核心亮点

1. **SOTA 性能**: 外部 olmocr benchmark 第一，多语言 benchmark 显著提升
2. **多格式输出**: 支持 Markdown、HTML、JSON，保留布局信息
3. **90+ 语言支持**: 强大的多语言 OCR 能力
4. **手写识别**: 优秀的手写内容识别能力
5. **复杂文档**: 表格、数学公式、复杂布局表现出色
6. **双推理模式**: 本地（HuggingFace）和远程（vLLM）两种模式

## 规格

- **分辨率**: 1080×1920（竖屏）
- **帧率**: 60fps
- **时长**: 约50秒
- **语速**: 1.2x
- **主题风格**: cyberpunk（赛博朋克）
- **字体**: 大字体
- **帧数**: 10帧

## 技术栈

- Python
- vLLM / HuggingFace
- PyTorch
- Streamlit

## 文件清单

```
chandra-video/
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

- GitHub: https://github.com/datalab-to/chandra
- Homepage: https://www.datalab.to
- Playground: https://www.datalab.to/playground
- Discord: https://discord.gg/KuZwXNGnfH
