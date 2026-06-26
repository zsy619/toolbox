# ClawTeam 视频项目

> 基于 Remotion 制作的 AI Agent 团队协作主题视频

## 项目信息

- **主题**: ClawTeam - 港大开源多Agent协作框架
- **时长**: 60秒
- **分辨率**: 1080x1920 (竖屏 9:16)
- **帧率**: 60fps
- **风格**: 科技现代风 (Tech Modern)

## 项目结构

```
clawteam-multiagent-2026/
├── docs/                          # 文档目录
│   ├── README.md                  # 本文件
│   ├── article.md                 # 原始文章内容
│   ├── video-script.md            # 视频脚本
│   ├── wechat-copy.md             # 微信公众号文案
│   ├── posting-guide.md           # 多平台发布指南
│   └── assets/                    # 视觉素材
└── video-project/                 # Remotion 视频项目
    ├── src/
    │   ├── index.ts               # 入口文件
    │   ├── Root.tsx              # Composition 定义
    │   └── VerticalVideo.tsx     # 主视频组件
    ├── out/
    │   └── video.mp4             # 渲染输出视频
    ├── package.json
    ├── tsconfig.json
    └── remotion.config.ts
```

## 视频场景

| 场景 | 时长 | 内容 |
|------|------|------|
| 封面 | 0-3秒 | ClawTeam 主标题 + 副标题 |
| 痛点 | 3-8秒 | 单兵作战的AI Agent痛点 |
| 解决方案 | 8-16秒 | ClawTeam架构图 |
| 核心特点 | 16-28秒 | 极简架构/一键安装/兼容性强 |
| 应用场景 | 28-45秒 | ML实验/全栈开发/AI投资 |
| 快速上手 | 45-55秒 | 终端命令演示 |
| 结尾 | 55-60秒 | CTA + 关注提示 |

## 技术栈

- **框架**: Remotion 4.x
- **语言**: TypeScript + React
- **动画**: useCurrentFrame + interpolate + spring
- **主题色**: 科技蓝 #2563EB / 电紫色 #7C3AED / 活力绿 #10B981

## 音频配音

- **语音**: Azure Neural TTS - zh-CN-YunjianNeural (温和男声)
- **原始时长**: 63.2秒
- **处理后时长**: 55秒 (1.05x加速 + 去静音)
- **最终时长**: 60秒 (补齐静音)

## 渲染命令

```bash
cd video-project
npm install
npx remotion render VerticalVideo --output out/video.mp4

# 音频混流
ffmpeg -y -i out/video.mp4 -i audio/neural_final.m4a -c:v copy -c:a copy -map 0:v -map 1:a -shortest -t 60 video.mp4
```

## 相关链接

- 原文章: https://www.toutiao.com/article/7620006839392092735/
- ClawTeam: https://github.com/openclaw/clawteam
