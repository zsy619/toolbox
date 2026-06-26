# Answer 技能视频项目

> OpenClaw Answer 技能宣传视频

## 项目信息

| 字段 | 值 |
|------|-----|
| 标题 | Answer |
| 副标题 | 开发者社群历史讨论搜索 |
| 技能地址 | https://cn.clawhub-mirror.com/rhyssullivan/answeroverflow |
| 视频时长 | 54.8 秒 |
| 分辨率 | 1080×1920 (竖屏 9:16) |
| 帧率 | 60fps |
| 主题风格 | 科技现代风 (Tech Vision) |

## 配色方案

| 颜色角色 | 色值 |
|---------|------|
| 主色 | #2563EB (科技蓝) |
| 辅色 | #7C3AED (电紫色) |
| 强调色 | #10B981 (活力绿) |
| 背景色 | #0F172A (深空黑) |

## 目录结构

```
answer-skill-video/
├── docs/                    # 文档目录
│   ├── README.md           # 本文件
│   ├── video-script.md     # 视频脚本（9场景分解）
│   ├── copy.md             # 多平台营销文案
│   ├── wechat.md           # 微信公众号文案
│   ├── posting-guide.md    # 发布指南
│   └── assets/
│       └── cover.png       # 封面图 (1080×1920)
│
├── audio/                   # 音频文件
│   ├── full_narration.txt  # 配音文稿
│   ├── neural_full.mp3     # 原始配音 (74.7s)
│   ├── male_processed.m4a  # 处理后配音 (54.8s, 1.2x速)
│   ├── subtitles.srt       # 原始字幕
│   └── subtitles_adjusted.srt # 调整后字幕
│
├── video-project/          # Remotion 项目
│   ├── src/
│   │   ├── index.ts        # Remotion 入口
│   │   └── Video.tsx       # 视频组件（9场景）
│   ├── out/
│   │   └── video_noaudio.mp4 # 渲染无音频视频
│   └── package.json
│
└── output/                  # 输出视频
    ├── answer_with_audio.mp4 # 合并音视频
    ├── answer_final.mp4      # 最终版（带字幕）
    ├── wechat_video.mp4      # 微信视频号版本
    ├── xiaohongshu_video.mp4 # 小红书版本
    └── youtube_video.mp4     # YouTube 版本
```

## 视频场景说明

| 场景 | 时间 | 帧区间 | 内容 |
|------|------|--------|------|
| 1 | 0-5.7s | 0-342 | 封面/标题 |
| 2 | 5.7-14.2s | 342-852 | 痛点展示 |
| 3 | 14.2-19s | 852-1140 | 海外社区宝藏 |
| 4 | 19-22.9s | 1140-1374 | Answer 登场 |
| 5 | 22.9-29.3s | 1374-1758 | 核心功能 |
| 6 | 29.3-40s | 1758-2400 | 使用示例 |
| 7 | 40-47s | 2400-2820 | 核心价值 |
| 8 | 47-51.5s | 2820-3090 | 安装方式 |
| 9 | 51.5-54.8s | 3090-3290 | 结尾CTA |

## 使用的技术

- **Remotion** v4.0.448 - 视频渲染框架
- **edge-tts** - 微软 Azure Neural TTS (zh-CN-YunxiNeural)
- **ffmpeg** - 音视频处理
- **Python PIL** - 封面图生成

## 创建时间

2026-04-14
