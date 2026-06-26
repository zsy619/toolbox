# Archify - Claude Skill 架构图生成器

## 项目信息

| 项目 | 值 |
|------|------|
| **项目名称** | archify-video |
| **来源** | GitHub tt-a1i/archify |
| **主题** | Claude Skill: 自然语言生成专业级架构图 |
| **规格** | 1080×1920 竖屏，60fps |
| **风格** | 赛博朋克（Cyberpunk） |
| **状态** | 🔄 进行中 |

## 核心功能

- **5 种图表类型**：Architecture / Workflow / Sequence / Data Flow / Lifecycle
- **深色/浅色主题**：一键切换，浏览器记住偏好
- **4× 超清导出**：PNG / JPEG / WebP / SVG
- **一键复制**：直接贴到 Slack / 飞书 / Notion / GitHub
- **单文件 HTML**：零依赖，发一个文件就能分享
- **聊天迭代**：继续描述即可修改图表

## 图表类型

| 类型 | 适合场景 |
|------|---------|
| Architecture | 系统组件、云资源、数据库、缓存 |
| Workflow | 请求生命周期、审批流程、CI/CD |
| Sequence | API 调用链、缓存回源、鉴权 |
| Data Flow | 数据管线、ETL/ELT、PII 隔离 |
| Lifecycle | 状态机、Agent Run 生命周期 |

## 文件清单

```
archify-video/
├── docs/
│   ├── README.md           ✅ 项目首页
│   ├── article.md          ✅ 原始内容
│   ├── video-script.md     ✅ 视频脚本
│   ├── copy.md             ✅ 营销文案
│   ├── wechat-copy.md      ✅ 公众号文案
│   ├── posting-guide.md    ✅ 发布指南
│   ├── landing-page.html   ✅ 落地页
│   ├── article-page.html   ✅ 文章页
│   ├── wechat-page.html   ✅ 微信适配页
│   ├── session-log.md      ✅ 会话日志
│   ├── report.json         ✅ 执行报告
│   └── assets/
│       └── cover.png       ⏳ 封面图
├── audio/
│   ├── neural_1_2x.m4a    ⏳ 配音
│   └── subtitles.ass      ⏳ 字幕
└── video-project/
    └── out/
        └── final-with-subs.mp4  ⏳ 最终视频
```

## 主题色（赛博朋克）

| 颜色 | 色值 | 用途 |
|------|------|------|
| 背景 | #0D0D1A | 深空黑 |
| 霓虹青 | #00FFFF | 主色调 |
| 霓虹品红 | #FF00FF | 辅助色 |
| 文字 | #FFFFFF | 白色 |
| 灰色 | #8888AA | 次要文字 |

## 来源链接

https://github.com/tt-a1i/archify