# nftcps-video — agency-agents AI代理公司

## 项目概览

| 项目 | 内容 |
|------|------|
| **名称** | nftcps-video |
| **来源** | [X.com @NFTCPS](https://x.com/NFTCPS/status/2044688228964594060) |
| **主题** | agency-agents — 把整个 AI 代理公司开源了 |
| **作者** | 鸟哥 \| 蓝鸟会 (@NFTCPS) |
| **数据** | 70 RT · 265 👍 · 15 回复 |
| **创建时间** | 2026-04-17 |
| **主题风格** | tech-modern（科技现代风） |
| **技能规范** | [video-creator SKILL.md](../../../../.openclaw/skills/video-creator/SKILL.md) |

---

## 视频规格

| 参数 | 值 |
|------|---|
| 时长 | 57 秒 |
| 分辨率 | 1080×1920（9:16 竖屏） |
| 帧率 | 60fps |
| 编码 | H.264 / AAC |
| 最终文件 | `video-project/out/nftcps-final.mp4` |
| 文件大小 | 4.2MB |
| 音频 | edge-tts zh-CN-YunjianNeural 1.621x |
| 字幕 | ASS 10px 黄色，\N 同屏多行 |

---

## 时间轴（9个场景）

| # | 场景 | 时长 | 内容摘要 |
|---|------|------|---------|
| 1 | Hook | 0-3s | 用 Claude Code 还在自己写系统提示词？你已经落后一个版本了 |
| 2 | 引入 | 3-6s | agency-agents，80+ 个 AI 专家代理 |
| 3 | 工程部门 | 6-12s | 前端·后端·AI工程师·安全·智能合约·SRE·数据库 |
| 4 | 设计部门 | 12-16s | UI·UX·图片提示词·Whimsy Injector |
| 5 | 营销+销售 | 16-24s | Reddit/TikTok/小红书/公众号 + 外呼/竞品/提案/销售管道 |
| 6 | 核心价值 | 24-32s | 具体沟通风格·完整作业流程·实际交付物示例 |
| 7 | 全平台 | 32-38s | Claude Code/Cursor/Copilot/Aider/Windsurf/Gemini CLI/OpenCode |
| 8 | 收尾CTA | 38-48s | 大多数人还在"帮我写函数"，顶层玩家已经在调度专家团队 |
| 9 | 链接 | 48-57s | github.com/msitarzewski/agency-agents |

---

## 字体大小（按 THEMES.md 规范）

| 元素 | 字号 |
|------|------|
| 场景标题（部门标签） | 26-30px |
| 主标题（agency-agents） | 100px |
| Hook 主标题 | 48-72px |
| 正文（岗位列表） | 42-52px |
| 辅助说明 | 26-30px |

> ⚠️ **全部内容块上下左右居中**，禁止拆分标题区/内容区

---

## 文件清单

```
nftcps-video/
├── docs/
│   ├── README.md              ← 项目首页
│   ├── article.md              ← 原始抓取内容
│   ├── video-script.md         ← 分镜脚本
│   ├── copy.md                 ← 营销文案集（小红书/视频号/抖音）
│   ├── wechat-copy.md          ← 公众号文案
│   ├── posting-guide.md        ← 发布指南
│   ├── landing-page.html       ← 落地页
│   ├── article-page.html       ← 文章阅读页
│   ├── wechat-page.html       ← 公众号适配页
│   ├── session-log.md         ← Session 日志
│   ├── report.json             ← 执行报告
│   └── assets/
│       ├── cover.png           ← 封面图（1080×1920）
│       ├── generate_cover.py   ← PIL 封面生成脚本
│       └── gen_subtitles.py    ← 字幕生成脚本
├── audio/
│   ├── neural_1_2x.m4a        ← 原始音频
│   ├── neural_1_2x_speed.m4a  ← 1.621x 处理后音频（57s）
│   └── subtitles_57s.ass        ← ASS 字幕
└── video-project/
    ├── package.json
    ├── src/
    │   ├── index.tsx
    │   ├── Root.tsx
    │   ├── VerticalVideo.tsx
    │   └── themes/tech-modern.ts
    └── out/
        ├── nftcps-57s-noaudio.mp4  ← 无音频原片
        ├── nftcps-muxed.mp4         ← 混流后（含音）
        └── nftcps-final.mp4         ← 最终视频（含字幕）
```

---

## 质量检查

- ✅ 视频：1080×1920 60fps
- ✅ 音频：mean=-23.7dB（正常音量）
- ✅ 字幕：ASS 10px 黄色底部居中，\N 同屏多行
- ✅ 封面：PIL 生成 1080×1920（34KB）
- ✅ 字体：主标题 72-100px，场景标题 26-52px，全部居中
