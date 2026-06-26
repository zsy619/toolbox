# Skills 写得好，AI 干活没烦恼 - 视频项目

## 项目信息

| 项目 | 内容 |
|------|------|
| **项目名称** | toutiao-video |
| **来源** | 今日头条 - 编程充电站 |
| **URL** | https://www.toutiao.com/article/7629527294830445099/ |
| **发布日期** | 2026-04-17 |
| **主题** | AI 编程 / Skills 设计原则 |
| **平台** | 视频号 / 小红书 / 抖音 / YouTube |

---

## 视频规格

| 参数 | 值 |
|------|------|
| **分辨率** | 1080×1920（竖屏 9:16） |
| **帧率** | 60fps |
| **时长** | ~57秒（1.2x 语速） |
| **主题** | tech-modern |
| **字体** | PingFang SC / Noto Sans SC |
| **配音** | edge-tts zh-CN-YunjianNeural |
| **字幕** | ASS，10px，黄色，底部居中 |

---

## 视频时间轴（57秒 / 1.2x）

| 场景 | 时间 | 内容 |
|------|------|------|
| 01 | 0:00-3s | 开场：Hook — 花半小时写 Skills，AI 越用越乱？ |
| 02 | 3:00-15s | 问题诊断：3个常见问题（目标模糊/步骤残缺/约束抽象） |
| 03 | 15:00-35s | 核心方法：4个标准（目标可验证/步骤可执行/约束可落地/示例可参考） |
| 04 | 35:00-48s | 踩坑记录：4个血泪教训 |
| 05 | 48:00-57s | 总结建议 + CTA |

---

## 核心文案

**标题**：Skills 写得好，AI 干活没烦恼

**Hook**：花半小时写了一套 Skills，AI 第一次用还行，后面越用越乱——这不是 AI 不行，是你没说清楚。

**核心观点**：
- Skills 本质 = 把思考过程显性化
- 好 Skills 的 4 个标准：目标可验证、步骤可执行、约束可落地、示例可参考

**适用人群**：重复性工作多、团队协作、个人项目开发者

---

## 文件清单

```
toutiao-video/
├── docs/
│   ├── README.md              ← 本文件
│   ├── article.md             ← 原始文章内容
│   ├── video-script.md        ← 视频分镜脚本
│   ├── copy.md                ← 营销文案集
│   ├── wechat-copy.md        ← 公众号白底文案
│   ├── posting-guide.md       ← 发布指南
│   ├── landing-page.html      ← 落地页
│   ├── article-page.html      ← 文章阅读页
│   ├── wechat-page.html      ← 公众号适配页
│   ├── session-log.md         ← 会话日志
│   └── assets/
│       ├── cover.png          ← 封面图（1440×2560）
│       └── gen_subtitles.py  ← 字幕生成脚本
├── audio/
│   ├── neural_1_2x.m4a        ← 处理后音频（1.2x）
│   └── subtitles_*.ass        ← 字幕文件
└── video-project/
    ├── src/
    │   ├── index.tsx
    │   ├── Root.tsx
    │   ├── VerticalVideo.tsx
    │   └── themes/tech-modern.ts
    └── out/
        └── toutiao-final.mp4  ← 最终视频
```

---

## 技术栈

- **Remotion** v4.0 — 竖屏视频渲染
- **edge-tts** — Azure 神经网络配音
- **FFmpeg** — 音频处理、字幕烧录
- **Seedream** — AI 封面图生成
- **baoyu 技能组** — 封面图、文案生成
