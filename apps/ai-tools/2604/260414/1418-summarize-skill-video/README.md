# Summarize 技能视频项目

## 项目概述

为 Summarize 技能创建的宣传视频项目，支持多平台发布。

## 主题信息

- **标题**: Summarize
- **副标题**: 网页 PDF 图片 音频 视频总结
- **核心功能**: 使用 summarize 命令行工具快速总结各类内容
- **技能地址**: https://cn.clawhub-mirror.com/steipete/summarize

## 技术规格

| 项目 | 规格 |
|------|------|
| 分辨率 | 1080×1920 (竖屏) |
| 帧率 | 60fps |
| 时长 | 约 32 秒 |
| 主题 | 科技现代风 (Tech Vision) |
| 主色 | #2563EB |
| 辅色 | #7C3AED |
| 强调色 | #10B981 |
| 背景色 | #0F172A |

## 目录结构

```
summarize-skill-video/
├── docs/
│   ├── README.md          # 本文档
│   ├── video-script.md   # 视频脚本
│   ├── copy.md           # 营销文案集
│   ├── wechat.md         # 公众号文案
│   ├── posting-guide.md  # 发布指南
│   └── assets/
│       └── cover.png      # 封面图
├── video-project/
│   ├── src/
│   │   ├── Video.tsx     # 主视频组件 (9场景)
│   │   └── index.ts      # 入口文件
│   ├── out/              # 渲染输出
│   └── assets/           # 视频素材
└── audio/
    ├── full_narration.txt    # 配音脚本
    ├── neural_full.mp3       # 原始音频
    ├── male_processed.m4a    # 处理后音频
    └── subtitles.srt         # 字幕文件
```

## 视频场景

1. **封面** — 标题 + 徽章
2. **核心功能介绍** — "强大简单"
3. **网页总结** — 🌐
4. **PDF 总结** — 📄
5. **图片总结** — 🖼️
6. **音频总结** — 🎧
7. **视频总结** — 📺
8. **开源免费** — 三大卖点
9. **CTA 结尾** — URL + 号召

## 生成文件

### 视频文件
- `video-project/out/Video.mp4` — 原始渲染视频
- `video-project/out/final_video.mp4` — 含音频+字幕的最终视频
- `video-project/out/video-wx.mp4` — 微信视频号版
- `video-project/out/video-xhs.mp4` — 小红书版
- `video-project/out/video-yt.mp4` — YouTube版

### 文档文件
- `docs/video-script.md` — 视频脚本
- `docs/copy.md` — 营销文案
- `docs/wechat.md` — 公众号文案
- `docs/posting-guide.md` — 发布指南

## 使用工具

- **Remotion** — 视频渲染框架
- **edge-tts** — 微软神经网络配音
- **ffmpeg** — 视频处理和字幕烧入
- **PIL** — 封面图生成

## 渲染命令

```bash
cd video-project

# 渲染无音频视频
npm run build

# 合并音视频并烧入字幕
ffmpeg -y \
  -i out/Video.mp4 \
  -i ../audio/male_processed.m4a \
  -i ../audio/subtitles.srt \
  -c:v libx264 \
  -c:a aac \
  -c:s mov_text \
  -map 0:v -map 1:a -map 2:s \
  -shortest \
  -movflags +faststart \
  out/final_video.mp4
```
