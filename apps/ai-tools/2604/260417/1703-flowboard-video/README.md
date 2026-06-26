# FlowBoard 视频项目

## 项目信息

- **名称**：FlowBoard - 智能任务管理看板
- **GitHub**：https://github.com/sakimi-9/FlowBoard
- **类型**：竖屏社交媒体视频
- **时长**：57秒
- **分辨率**：1080×1920
- **帧率**：60fps
- **语速**：1.306x（edge-tts）
- **主题**：tech-modern

## 项目结构

```
flowboard-video/
├── docs/
│   ├── README.md           # 本文件
│   ├── article.md           # 文章原文
│   ├── video-script.md      # 视频脚本
│   ├── copy.md              # 小红书/视频号/抖音文案
│   ├── wechat-copy.md       # 公众号文案
│   ├── posting-guide.md     # 发布指南
│   ├── landing-page.html     # 落地页
│   ├── article-page.html     # 文章页
│   ├── wechat-page.html     # 公众号文章页
│   └── assets/
│       ├── cover.png        # 封面图（1440×2560）
│       ├── gen_subtitles.py # 字幕生成脚本
│       └── theme.ts         # 主题配置
├── audio/
│   ├── neural_1x.m4a       # 原始音频（74.5s）
│   ├── neural_1_2x.m4a      # 加速音频（57s @ 1.306x）
│   ├── subtitles_57s.ass     # ASS字幕（10px，底部居中）
│   └── full_narration.txt  # 完整旁白文本
└── video-project/
    ├── src/
    │   ├── index.tsx        # Remotion入口
    │   ├── Root.tsx         # Composition定义
    │   ├── VerticalVideo.tsx # 竖屏视频组件
    │   └── themes/tech-modern.ts
    └── out/
        ├── flowboard-final.mp4    # 最终视频
        ├── flowboard-noaudio.mp4   # 无音频版本
        └── video_with_audio.mp4    # 音视频合并版
```

## 视频内容

### 场景划分

| 场景 | 时间 | 内容 |
|------|------|------|
| 1 | 0-5s | 封面：FlowBoard 大标题 |
| 2 | 5-12s | 痛点：任务管理混乱 |
| 3 | 12-20s | 解决方案引入 |
| 4 | 20-28s | 技术栈展示 |
| 5 | 28-42s | 五大核心能力 |
| 6 | 42-50s | 离线+隐私保护 |
| 7 | 50-57s | 结尾 GitHub 链接 |

### 字幕规格

- 字体：PingFang SC
- 字号：10px
- 颜色：黄色（#00FFFF）
- 位置：底部居中（Alignment=2）
- 边距：左右各30px，距底边30px
- 换行：WrapStyle=0，支持 `\N` 换行

## 技术栈

- **框架**：React 18 + TypeScript
- **构建**：Vite
- **渲染**：Remotion 4.0.448
- **配音**：edge-tts（zh-CN-YunjianNeural）
- **字幕**：ASS格式 + ffmpeg 烧录

## 使用说明

### 重新渲染视频

```bash
cd video-project
npm install
npx remotion render VerticalVideo out/flowboard-noaudio.mp4 --fps=60 --height=1920 --width=1080
```

### 合并音频 + 烧录字幕

```bash
# 1. 合并音频
ffmpeg -y -i out/flowboard-noaudio.mp4 -i audio/neural_1_2x.m4a \
  -c:v copy -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 \
  out/video_with_audio.mp4

# 2. 烧录字幕
ffmpeg -y -i out/video_with_audio.mp4 \
  -vf "ass=audio/subtitles_57s.ass" -c:a copy \
  out/flowboard-final.mp4
```

### 重新生成字幕

```bash
python3 docs/assets/gen_subtitles.py
```
