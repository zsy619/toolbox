# OpenCode 视频项目 - 文档索引

## 📁 项目结构

```
opencode-video/
├── README.md                      # 项目总览
├── opencode-video.mp4             # 🎬 视频成品 (45秒, 3.5MB)
├── docs/                          # 📄 文档目录
│   ├── README.md                  # 📋 文档索引 (本文)
│   ├── video-script.md            # 📝 视频脚本
│   ├── copy.md                    # 📣 营销文案集
│   ├── wechat-copy.md             # 🐚 公众号文案
│   ├── posting-guide.md           # 📤 发布指南
│   ├── landing-page.html          # 🌐 宣传落地页
│   ├── article-page.html          # 📖 文章阅读页
│   ├── wechat-page.html           # 💬 公众号适配页
│   └── assets/
│       └── cover.png              # 🖼️ 封面图
└── video-project/                 # 🎥 Remotion 项目
    ├── src/index.tsx
    └── out/VerticalVideo.mp4
```

## 📋 文档说明

| 文档 | 说明 | 大小 |
|------|------|------|
| **README.md** | 项目总览，包含视频信息、文件结构、技术栈、使用说明 | 3.2KB |
| **video-script.md** | 详细视频脚本，包含5个场景的分镜说明、平台适配文案、设计规范 | 4.0KB |
| **copy.md** | 营销文案集（小红书、视频号、抖音/快手版本） | 3.6KB |
| **wechat-copy.md** | 公众号专属文案（标题、摘要、正文、引导关注） | 1.8KB |
| **posting-guide.md** | 多平台发布指南（视频号、小红书、抖音/快手） | 4.2KB |
| **landing-page.html** | 宣传落地页（科技风，展示核心功能） | 5.4KB |
| **article-page.html** | 文章阅读页（深色主题，详细内容） | 8.2KB |
| **wechat-page.html** | 公众号适配页（微信友好排版） | 6.4KB |

## 🎬 视频信息

| 属性 | 值 |
|------|-----|
| **主题** | 开源终端AI编程神器：OpenCode + oh-my-opencode |
| **时长** | 45 秒 |
| **分辨率** | 1080×1920 (9:16 竖屏) |
| **帧率** | 60 fps |
| **格式** | MP4 (H.264) |
| **文件大小** | 3.5 MB |

## 🎯 平台适配

### 小红书
- **标题**: 终端AI编程神器！开源免费，5分钟搭建你的AI开发团队 🚀
- **正文**: 还在浏览器、IDE、AI工具之间反复横跳？这款开源终端AI组合让你在命令行里完成项目分析、代码生成、多智能体协作！
- **标签**: #编程工具 #AI编程 #开源 #程序员 #终端 #效率工具 #OpenCode #Claude

### 视频号
- **标题**: 开源终端AI编程神器！5分钟搭建AI开发团队
- **描述**: OpenCode + oh-my-opencode 一站式安装教程。终端原生、多模型随便切、多Agent协同、完全免费！

### 公众号
- **标题**: 开源终端AI编程神器，5分钟让你的效率翻倍
- **摘要**: 还在为付费AI工具发愁？这款开源终端AI组合，零成本拥有你的专属AI开发团队！

---

## 🚀 快速开始

### 下载视频
```
~/.openclaw/workspace/opencode-video/opencode-video.mp4
```

### 查看封面
```
~/.openclaw/workspace/opencode-video/docs/assets/cover.png
```

### 本地预览视频项目
```bash
cd ~/.openclaw/workspace/opencode-video/video-project
npx remotion serve src/index.tsx
```

### 重新渲染视频
```bash
cd ~/.openclaw/workspace/opencode-video/video-project
npx remotion render src/index.tsx VerticalVideo --out out/video.mp4
```

---

## 📅 更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-04-03 | 1.0.0 | 初始版本，5场景45秒竖屏视频 + 全套文档 |

---

## 🔗 相关链接

- **原文链接**: https://www.toutiao.com/article/7623361799267189291/
- **OpenCode官网**: https://opencode.ai
