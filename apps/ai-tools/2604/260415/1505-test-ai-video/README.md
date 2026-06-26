# test-ai 视频项目

## 项目概述

| 属性 | 内容 |
|------|------|
| 主题 | test-ai - AI 自动化测试框架 |
| Stars | 5,800+ |
| 核心功能 | AI 自动生成测试用例 \| 失败自动录屏 |
| 技术栈 | TypeScript + Python |
| 框架支持 | Jest / Playwright |
| 适用人群 | QA 团队、测试开发工程师 |
| 项目地址 | https://github.com/playwright/test-ai |

## 文件结构

```
test-ai-video/
├── docs/                          # 文档目录
│   ├── README.md                 # 项目文档
│   ├── video-script.md           # 视频脚本
│   ├── copy.md                   # 营销文案
│   ├── posting-guide.md          # 发布指南
│   └── assets/                   # 视觉素材
│       └── cover.png             # 封面图
├── video-project/                # 视频项目
│   ├── src/                      # Remotion 源码
│   ├── out/                      # 输出视频
│   └── assets/                   # 视频素材
└── audio/                        # 音频文件
    ├── full_narration.txt         # 配音文稿
    ├── neural_full.mp3           # 原始配音
    └── neural_processed.m4a      # 处理后配音
```

## 视频规格

| 属性 | 规格 |
|------|------|
| 分辨率 | 1080x1920 (9:16竖屏) |
| 帧率 | 60fps |
| 时长 | 50-60秒 |
| 主题 | 科技现代风 |
| 配音 | 微软 Azure Neural TTS (zh-CN-YunjianNeural) |
| 字幕 | ASS 格式，10px 宋体，黄色，黑边 |

## 字幕规格

| 属性 | 规格 |
|------|------|
| 字体 | SimSun (宋体) |
| 大小 | 10px |
| 颜色 | 黄色 &H0000FFFF |
| 粗体 | 是 |
| 描边 | 1px 黑色 |
| 位置 | 底部居中 (Alignment=2) |
| 距底边 | 30px (MarginV=30) |

## 工作流程

1. ✅ 内容分析
2. ✅ 文档生成 (README, script, copy, guide)
3. ⬜ 封面图生成
4. ⬜ 配音生成
5. ⬜ 字幕生成
6. ⬜ Remotion 视频构建
7. ⬜ 视频渲染输出

## 发布平台

- [ ] 微信视频号
- [ ] 小红书
- [ ] 抖音
- [ ] YouTube Shorts
