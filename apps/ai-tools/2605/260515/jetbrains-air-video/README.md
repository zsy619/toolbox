# JetBrains Air IDE 视频项目文档

> 本项目基于 JetBrains 宣布停止开发 Fleet、转而打造全新 Agentic IDE "Air" 的重磅新闻制作。

## 📁 文档目录

| 文件 | 说明 |
|------|------|
| `README.md` | 文档首页（当前文件） |
| `video-script.md` | 视频脚本、平台适配文案 |
| `copy.md` | 营销文案集（多平台） |
| `wechat-copy.md` | 微信公众号专属文案 |
| `posting-guide.md` | 多平台发布指南 |
| `landing-page.html` | 宣传落地页 |
| `article-page.html` | 文章阅读页 |
| `wechat-page.html` | 公众号适配页 |
| `assets/` | 视觉素材目录 |

## 🎬 视频文件

视频文件位于 `video-project/out/` 目录：

| 文件 | 说明 | 风格 |
|------|------|------|
| `video.mp4` | 主视频 | 科技现代风 |
| `video-cyberpunk.mp4` | 赛博朋克版 | 霓虹发光风 |

## 📱 视频规格

- **分辨率**：1080x1920 (竖屏)
- **时长**：45秒
- **帧率**：60fps
- **编码**：H.264

## 🎨 视频内容

1. **封面**：JetBrains 重磅发布
2. **震惊开场**：Fleet 停止开发
3. **新品揭晓**：全新 Air IDE
4. **对比展示**：Fleet ❌ → Air ✅
5. **市场竞争**：VS Code | Cursor | Air
6. **结尾**：Air 即将到来

## 📝 内容摘要

### 核心信息
- **事件**：JetBrains 宣布停止开发 Fleet
- **新品**：全新 Agentic IDE "Air"
- **定位**：面向智能体（Agentic）开发
- **意义**：AI 编程时代的新选择

### 市场格局
- **VS Code**：Microsoft，生态丰富
- **Cursor**：AI 原生，增长迅猛
- **Air**：JetBrains，值得期待

## 🚀 快速开始

### 查看落地页
直接用浏览器打开 `landing-page.html` 即可预览宣传页面。

### 查看公众号文案
查看 `wechat-copy.md` 获取微信公众号风格的完整文案。

### 发布视频
1. 下载 `video-project/out/video.mp4`
2. 根据 `posting-guide.md` 的指南发布到各平台

## 📦 项目结构

```
jetbrains-air-video/
├── docs/                           # 📄 文档目录
│   ├── README.md                  # 文档首页
│   ├── video-script.md           # 视频脚本
│   ├── copy.md                    # 营销文案
│   ├── wechat-copy.md             # 公众号文案
│   ├── posting-guide.md           # 发布指南
│   ├── landing-page.html          # 落地页
│   ├── article-page.html          # 文章页
│   ├── wechat-page.html           # 公众号适配页
│   └── assets/                    # 视觉素材
│
├── video-project/                 # 🎬 视频项目
│   ├── src/
│   │   ├── index.tsx             # 入口文件
│   │   ├── Root.tsx              # 科技现代风组件
│   │   └── RootCyberpunk.tsx     # 赛博朋克风组件
│   ├── out/                       # 渲染输出
│   │   ├── video.mp4             # 主视频
│   │   └── video-cyberpunk.mp4   # 赛博朋克版
│   └── package.json
│
└── README.md                      # 项目说明
```

## 🔗 相关链接

- JetBrains 官网：https://www.jetbrains.com
- IntelliJ IDEA：https://www.jetbrains.com/idea/
- Fleet（历史）：https://www.jetbrains.com/fleet/

## 📅 更新日志

### 2026-04-01
- 初始版本创建
- 生成科技现代风视频
- 生成赛博朋克风视频
- 编写完整文档

---

*最后更新：2026-04-01*
