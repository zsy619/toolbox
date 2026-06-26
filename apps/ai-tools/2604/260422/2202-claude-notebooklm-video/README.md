# NFTCPS NotebookLM AI技能包 视频项目

## 项目信息

| 项目 | 值 |
|------|-----|
| 名称 | nftcps-video |
| 来源 | X推文 @NFTCPS |
| 链接 | https://x.com/NFTCPS/status/2045730120757891508 |
| 主题 | NotebookLM Claude技能包 |
| 风格 | tech-modern (蓝紫系) |
| 时长 | 约27秒 |
| 分辨率 | 1080×1920 (9:16竖屏) |
| 帧率 | 60fps |

## 项目结构

```
nftcps-video/
├── docs/
│   ├── README.md           # 项目说明（本文件）
│   ├── article.md          # 原始内容分析
│   ├── video-script.md     # 详细分镜脚本（含帧率计算）
│   ├── posting-guide.md    # 多平台发布指南
│   ├── copy.md             # 营销文案（视频号/小红书/抖音/公众号）
│   ├── wechat-copy.md       # 微信公众号专用文案
│   ├── landing-page.html    # HTML落地页
│   ├── article-page.html   # HTML文章页
│   ├── wechat-page.html     # 微信适配HTML页
│   ├── report.json         # 执行报告
│   └── assets/
│       └── cover.png       # 封面图
├── audio/
│   ├── neural_1_2x.m4a     # 配音（1.2x语速，27秒）
│   ├── subtitles.ass        # ASS字幕
│   └── subtitles.srt        # SRT字幕
└── video-project/
    ├── src/
    │   ├── index.ts        # Remotion入口
    │   ├── Root.tsx         # Remotion根组件
    │   ├── VerticalVideo.tsx # 主视频组件（6个场景）
    │   └── audio.m4a        # 音频文件
    └── out/
        └── final-with-subs.mp4  # 最终视频
```

## 视频内容

### 场景列表

| 序号 | 场景 | 时长 | 图标 | 内容 |
|------|------|------|------|------|
| 1 | 开场 | 5s | 🔥 | NotebookLM AI技能包 - 这个工具有点猛 |
| 2 | 功能介绍 | 5s | 🎙️ | 自动生成 - 把任何内容丢进NotebookLM |
| 3 | 来源1 | 5s | 📱 | 微信文章、YouTube、小宇宙播客 |
| 4 | 来源2 | 5s | 📄 | PDF、Word、Excel、EPUB电子书 |
| 5 | 来源3 | 5s | 💰 | 300+付费网站，NYT/FT/经济学人全绕过 |
| 6 | CTA | 2s | 👍 | 关注我，获取更多AI工具教程 |

### 核心卖点
- 支持微信文章、YouTube、小宇宙播客
- 支持PDF、Word、Excel、EPUB电子书
- 支持300+付费网站（NYT/FT/经济学人全绕过）
- 自然语言指令，无需编码

## 技术规格

| 项目 | 值 |
|------|-----|
| 渲染引擎 | Remotion |
| 输出格式 | MP4 (H.264) |
| 音频编码 | AAC |
| 字幕格式 | ASS (烧录) |
| 字幕字体 | Heiti SC |
| 字幕大小 | 8px |
| 字幕颜色 | 黄色 (#FFFF00) |
| 主题色 | 蓝 #2563EB + 紫 #7C3AED |
| 背景色 | #0D1117 |

## 文档说明

| 文档 | 说明 |
|------|------|
| README.md | 项目整体说明 |
| article.md | 原始内容来源和分析 |
| video-script.md | 详细分镜脚本，含帧率计算、动画参数 |
| posting-guide.md | 视频号/小红书/抖音发布参数 |
| copy.md | 各平台营销文案 |
| wechat-copy.md | 微信公众号专用文案 |
| landing-page.html | HTML落地页（含完整样式） |
| article-page.html | 文章阅读页 |
| wechat-page.html | 微信适配页（兼容微信内显示） |
| report.json | 执行报告（JSON格式） |

## 状态

- [x] 内容获取 (X推文)
- [x] 封面图生成
- [x] 文案撰写（多平台）
- [x] HTML页面生成（3个）
- [x] 音频生成
- [x] 字幕生成
- [x] Remotion代码构建
- [x] 视频渲染
- [x] 字幕烧录
- [x] 文档完整性检查

## 使用方式

```bash
# 渲染视频
cd ~/VideoProjects/nftcps-video/video-project
npx remotion render VerticalVideo out/final.mp4

# 烧录字幕
ffmpeg -y -i out/final.mp4 \
  -vf "ass='../audio/subtitles.ass'" \
  -c:v libx264 -preset fast \
  -c:a aac out/final-with-subs.mp4
```

## 作者信息

- **推文来源**: 鸟哥 | 蓝鸟会 (@NFTCPS)
- **原始链接**: https://x.com/NFTCPS/status/2045730120757891508
