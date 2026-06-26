# Qwen3.6-Plus 视频项目 - 文档索引

## 📁 项目结构

```
qwen-video/
├── README.md                      # 项目总览
├── qwen-video.mp4                 # 🎬 视频成品 (60秒, 4.8MB)
├── docs/                          # 📄 文档目录
│   ├── README.md                  # 📋 文档索引 (本文)
│   ├── video-script.md            # 📝 视频脚本
│   ├── copy.md                    # 📣 营销文案集
│   ├── wechat-copy.yaml            # 🐚 公众号文案
│   ├── posting-guide.yaml          # 📤 发布指南
│   ├── landing-page.html           # 🌐 宣传落地页
│   ├── article-page.html           # 📖 文章阅读页
│   ├── wechat-page.html            # 💬 公众号适配页
│   └── assets/
│       └── cover.png              # 🖼️ 封面图
└── video-project/                  # 🎥 Remotion 项目
    ├── src/index.tsx
    └── out/VerticalVideo.mp4
```

## 📋 文档说明

| 文档 | 说明 | 大小 |
|------|------|------|
| **README.md** | 项目总览，包含视频信息、文件结构、技术栈、使用说明 | 3.2KB |
| **video-script.md** | 详细视频脚本，包含5个画面的分镜说明、平台适配文案、设计规范 | 2.4KB |
| **copy.md** | 营销文案集（小红书、视频号、抖音/快手版本） | 1.8KB |
| **wechat-copy.yaml** | 公众号专属文案（标题、摘要、正文、引导关注） | 1.0KB |
| **posting-guide.yaml** | 多平台发布指南（视频号、小红书、抖音/快手） | 2.3KB |
| **landing-page.html** | 宣传落地页（科技风，展示核心功能） | 4.5KB |
| **article-page.html** | 文章阅读页（深色主题，详细内容） | 4.4KB |
| **wechat-page.html** | 公众号适配页（微信友好排版） | 5.0KB |

## 🎬 视频信息

| 属性 | 值 |
|------|-----|
| **主题** | Qwen3.6-Plus 产品级交付能力的突破 |
| **时长** | 60 秒 |
| **分辨率** | 1080×1920 (9:16 竖屏) |
| **帧率** | 60 fps |
| **格式** | MP4 (H.264) |
| **文件大小** | 4.8 MB |

## 🎯 平台适配

### 小红书
- **标题**: Qwen3.6-Plus发布！AI进入产品级交付时代 🚀
- **正文**: 国产大模型评判标准已从"博学"全面转向"稳定性"与"工程交付能力"...
- **标签**: #AI #Qwen #阿里云 #大模型 #产品级交付 #工程能力

### 视频号
- **标题**: Qwen3.6-Plus：产品级交付能力的突破
- **描述**: 国产大模型评判标准已从"博学"全面转向"稳定性"与"工程交付能力"...

### 公众号
- **标题**: Qwen3.6-Plus发布：国产大模型进入产品级交付时代
- **摘要**: 国产大模型评判标准已从"博学"全面转向"稳定性"与"工程交付能力"...

---

## 🚀 快速开始

### 下载视频
```
~/.openclaw/workspace/qwen-video/qwen-video.mp4
```

### 查看封面
```
~/.openclaw/workspace/qwen-video/docs/assets/cover.png
```

### 本地预览视频项目
```bash
cd ~/.openclaw/workspace/qwen-video/video-project
npx remotion serve src/index.tsx
```

### 重新渲染视频
```bash
cd ~/.openclaw/workspace/qwen-video/video-project
npx remotion render src/index.tsx VerticalVideo --out out/video.mp4
```

---

## 📅 更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-04-03 | 1.0.0 | 初始版本，5场景60秒竖屏视频 + 全套文档 |

---

## 🔗 相关链接

- **原文链接**: https://mp.weixin.qq.com/s/Ldu0uOClS_XXfY0-RwKtcA
- **作者**: AIPress
- **阿里云百炼**: https://www.aliyun.com/
