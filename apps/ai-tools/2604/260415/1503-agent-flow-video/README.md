# agent-flow 视频项目

## 项目概述

- **主题**: agent-flow - AI Agent 编排框架
- **Stars**: +2,300 (总计 15,200)
- **核心功能**: 可视化 AI Agent 编排 | 支持多模型切换
- **技术特点**: Python + React 架构 | Docker 容器化部署
- **适用人群**: 需要构建 AI 工作流的团队
- **项目地址**: https://github.com/microsoft/agent-flow

## 目录结构

```
agent-flow-video/
├── docs/                          # 文档目录
│   ├── README.md                 # 文档首页
│   ├── video-script.md           # 视频脚本
│   ├── copy.md                   # 营销文案集
│   ├── posting-guide.md          # 多平台发布指南
│   └── assets/                   # 视觉素材
│       └── cover.png             # 封面图
├── video-project/                # 视频项目
│   ├── src/                      # Remotion 源代码
│   ├── out/                      # 输出视频
│   └── assets/                   # 视频素材
└── audio/                        # 音频文件
    ├── full_narration.txt        # 完整配音文案
    ├── neural_full.mp3           # 原始配音
    ├── neural_processed.m4a      # 处理后音频
    └── subtitles.srt             # 字幕文件
```

## 视频规格

- **分辨率**: 1080x1920 (9:16竖屏)
- **帧率**: 60fps
- **时长**: 45-60秒
- **字体**: 大号居中
- **主题**: 科技现代风

## 字幕规格

- 字体：10px 宋体 (SimSun)
- 颜色：黄色 &H0000FFFF
- 粗体：是
- 黑色描边：1px
- 位置：底部居中（Alignment=2）
- 距底边：30px（MarginV=30）

## 工作流程

1. ✅ 创建项目目录结构
2. ✅ 生成文档（README.md, video-script.md, copy.md, posting-guide.md）
3. ⬜ 生成封面图（科技现代风）
4. ⬜ 生成配音（edge-tts，zh-CN-YunjianNeural）
5. ⬜ 生成字幕（与音频同步）
6. ⬜ 构建Remotion视频
7. ⬜ 输出到 video-project/out/
