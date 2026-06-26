# local-llm-video 项目

## 项目概述

- **主题**: local-llm - 本地 LLM 部署工具
- **Stars**: +3,100 (总计 22,300)
- **核心功能**: 完全本地运行数据不出域 | 一键部署主流开源模型
- **技术特点**: Rust + CUDA | RTX 4090 运行 45 tokens/s
- **适用人群**: 需要私有化部署 AI 的企业
- **项目地址**: https://github.com/ollama/local-llm

## 目录结构

```
local-llm-video/
├── docs/
│   ├── assets/
│   │   └── cover.png          # 封面图
│   ├── README.md              # 文档首页
│   ├── video-script.md        # 视频脚本
│   ├── copy.md                # 营销文案集
│   └── posting-guide.md       # 多平台发布指南
├── video-project/
│   ├── src/
│   ├── out/
│   └── assets/
└── audio/
```

## 视频规格

- **分辨率**: 1080x1920 (9:16竖屏)
- **帧率**: 60fps
- **时长**: 45-60秒
- **字体**: 大号居中
- **主题**: 科技现代风

## 字幕规格

- **字体**: 10px 宋体 (SimSun)
- **颜色**: 黄色 &H0000FFFF
- **粗体**: 是
- **黑色描边**: 1px
- **位置**: 底部居中（Alignment=2）
- **距底边**: 30px（MarginV=30）

## 工作流程

1. ✅ 创建项目目录结构
2. ⬜ 生成文档（README.md, video-script.md, copy.md, posting-guide.md）
3. ⬜ 生成封面图（科技现代风）
4. ⬜ 生成配音（edge-tts，zh-CN-YunjianNeural）
5. ⬜ 生成字幕（与音频同步）
6. ⬜ 构建Remotion视频
7. ⬜ 输出到 video-project/out/
