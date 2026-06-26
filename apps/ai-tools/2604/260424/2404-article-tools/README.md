# Article Tools - 项目首页

## 项目概览

| 属性 | 值 |
|------|-----|
| **项目名称** | Article Tools |
| **GitHub** | https://github.com/eternityspring/article-tools |
| **在线预览** | https://eternityspring.github.io/article-tools/ |
| **Stars** | 225 |
| **Forks** | 47 |
| **License** | Apache 2.0 |
| **平台** | 小红书 / 视频号 / 抖音 |
| **主题** | tech-modern（科技现代风） |

## 核心价值

> 你只需要按照 `draft.md` 的格式规范写作，其他的交给工具。

Article Tools 是一套**浏览器端文章排版工具**，零安装、打开即用，涵盖封面生成、二维码制作、Markdown 转微信公众号、Markdown 转 X（Twitter）四种工具。

## 工具列表

| 工具 | 文件 | 核心功能 |
|------|------|---------|
| 封面生成器 | `cover.html` | 多种配色、装饰风格、字体，支持素材图片导入，导出 PNG/复制图片 |
| 二维码生成 | `qrcode.html` | 生成带 Logo 的二维码 |
| MD → 微信排版 | `md-to-wechat.html` | Markdown 转微信公众号富文本 |
| MD → X 排版 | `md-to-x.html` | Markdown 转 X/Twitter 适配格式 |

## 视频规格

| 属性 | 值 |
|------|-----|
| **分辨率** | 1080×1920（9:16 竖屏） |
| **帧率** | 60fps |
| **时长** | 约 60-90 秒 |
| **编码** | H.264 + AAC |
| **封面尺寸** | 1080×1920（9:16） |

## 时间轴

| 时间 | 场景 |
|------|------|
| 0-3s | 封面：Article Tools 主标题 + 副标题 |
| 3-8s | 引出痛点：排版繁琐、效率低下 |
| 8-20s | 工具1：封面生成器（cover.html）|
| 20-32s | 工具2：Markdown 转微信公众号（md-to-wechat.html）|
| 32-44s | 工具3：Markdown 转 X 排版（md-to-x.html）|
| 44-56s | 工作流演示：三步完成发布 |
| 56-60s | CTA：零安装、浏览器即用 |

## 输出文件清单

```
article-tools/
├── docs/
│   ├── README.md              ✅ 项目首页
│   ├── article.md             ✅ 原始内容
│   ├── video-script.md        ✅ 视频脚本
│   ├── copy.md                ✅ 营销文案集
│   ├── wechat-copy.md         ✅ 公众号文案
│   ├── posting-guide.md       ✅ 发布指南
│   ├── landing-page.html      ✅ 落地页
│   ├── article-page.html      ✅ 文章阅读页
│   ├── wechat-page.html       ✅ 公众号适配页
│   ├── session-log.md         ✅ 会话日志
│   ├── report.json            ✅ 执行报告
│   └── assets/
│       ├── cover.png          ✅ 封面图（1080×1920）
│       └── generate_cover.py  ✅ 封面生成脚本
├── audio/
│   ├── neural_full.mp3        原始 TTS 音频
│   ├── neural_processed.m4a   处理后音频（1.2x）
│   └── subtitles_*.ass        ASS 字幕
└── video-project/
    ├── src/                   Remotion 源码
    ├── out/                   输出视频
    └── public/                公共资源
```

## 平台发布参数

| 平台 | 标题 | 标签 | 最佳发布时间 |
|------|------|------|--------------|
| 小红书 | Article Tools：写作 5 分钟，排版 1 秒搞定 | #效率工具 #写作神器 #公众号运营 #排版工具 #AI写作 | 19:00-22:00 |
| 视频号 | 写作 5 分钟，排版 1 秒 | #效率工具 #排版神器 #公众号运营 | 12:00-13:00 / 20:00-22:00 |
| 抖音 | 排版神器！零安装打开即用 | #效率工具 #排版神器 #公众号运营 #写作 | 12:00-13:00 / 18:00-20:00 |
