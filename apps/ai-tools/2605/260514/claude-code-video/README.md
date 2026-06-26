# Claude Code 配置深度指南 - 视频创作项目文档

> 月账单下降 40% 的秘密 | 出海 Web 开发实战

## 📁 项目结构

```
claude-code-video/
├── docs/                           # 📄 文档目录
│   ├── README.md                  # 📑 文档首页
│   ├── video-script.md            # 🎬 视频脚本
│   ├── copy.md                    # ✍️ 营销文案集
│   ├── wechat-copy.md            # 📝 公众号文案
│   ├── landing-page.html          # 🚀 宣传落地页
│   └── wechat-page.html          # 💬 公众号适配页
│
└── video-project/                 # 🎥 Remotion 视频项目
    ├── src/
    └── out/                       # 🎬 输出视频
```

---

## 🎬 视频资源 (大字体版)

| 平台 | 文件 | 分辨率 | 尺寸比 | 大小 |
|------|------|--------|--------|------|
| 微信视频号 / 抖音 | `claude-code-large-wechat.mp4` | 1080x1920 | 9:16 | ~2.2 MB |
| 小红书 | `claude-code-large-xiaohongshu.mp4` | 1080x1440 | 3:4 | ~2.2 MB |
| YouTube / B站 | `claude-code-large-youtube.mp4` | 1920x1080 | 16:9 | ~2.2 MB |

---

## 📄 文档说明

| 文档 | 说明 |
|------|------|
| `README.md` | 文档首页 |
| `video-script.md` | 视频脚本 (6场景/30秒) |
| `copy.md` | 营销文案集 (4种渠道) |
| `wechat-copy.md` | 公众号文案 |
| `landing-page.html` | 宣传落地页 |
| `wechat-page.html` | 公众号适配页 |

---

## 🎬 视频内容 (6场景/30秒/60fps/大字体)

| # | 场景 | 时间 | 核心文案 | 字体大小 |
|---|------|------|----------|----------|
| 1 | 封面 | 0-3秒 | Claude Code 配置深度指南 | 96px |
| 2 | 问题 | 3-8秒 | 响应跑偏？上下文失控？ | 64px |
| 3 | 核心 | 8-18秒 | 三套核心配置 | 56px |
| 4 | 效果 | 18-24秒 | 月账单下降 40% | 180px |
| 5 | 配置 | 24-27秒 | Permission 设置 | 56px |
| 6 | CTA | 27-30秒 | 配置的本质 | 48px |

---

## 📝 核心内容要点

### 三套核心配置
1. **CLAUDE.md** - 项目级系统提示词，放在根目录
2. **模型选择** - 日常 Sonnet，架构 Opus
3. **上下文管理** - 任务拆小 + 摘要接力

### 效率提升
- 月账单下降 **40%**
- 产出效率没有下降

### Permission 设置
- **总是允许**：读取文件、创建文件、npm run、git status
- **每次确认**：删除文件、git push、数据库迁移
- **总是拒绝**：项目外文件、网络请求

### 出海专项配置
- Stripe：金额用分（整数），Webhook 验证签名
- i18n：文案走国际化，不硬编码
- GDPR：用户数据脱敏，合规处理

---

## 🔗 相关链接

- **原文**: 知乎专栏

---

## 📅 项目信息

| 项目 | 信息 |
|------|------|
| 创建日期 | 2026-03-31 |
| 版本 | 1.0.0 |
| 技术栈 | Remotion, React, TypeScript |
| 特点 | 大字体 (48-180px), 60fps |

---

*本文档由 video-creator skill 生成*
