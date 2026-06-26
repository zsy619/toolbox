# Obscura 视频项目

## 项目信息

| 项目 | 内容 |
|------|------|
| **项目名称** | obscura-video |
| **来源** | GitHub: h4ckf0r0day/obscura |
| **链接** | https://github.com/h4ckf0r0day/obscura |
| **描述** | The open-source headless browser for AI agents and web scraping |
| **Stars** | 802 |
| **Forks** | 58 |
| **语言** | Rust |
| **协议** | Apache 2.0 |

## 视频规格

| 参数 | 值 |
|------|------|
| 分辨率 | 1080×1920（竖屏） |
| 帧率 | 60fps |
| 时长 | 约45-50秒 |
| 主题 | tech-modern（科技现代风） |
| 主色调 | #3B82F6（蓝色） |

## 内容摘要

Obscura 是用 Rust 编写的开源无头浏览器，专为 AI Agent 自动化和网页抓取设计。

### 核心卖点

1. **超轻量**：内存仅 30MB（二进制 70MB），vs Chrome 200+MB
2. **极速启动**：Instant 启动，85ms 页面加载
3. **内置反检测**：Stealth 模式，自动随机化指纹
4. **Puppeteer/Playwright 兼容**：通过 CDP 协议

### 安装方式

```bash
# Linux
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-x86_64-linux.tar.gz

# macOS Apple Silicon
curl -LO https://github.com/h4ckf0r0day/obscura/releases/latest/download/obscura-aarch64-macos.tar.gz

# 构建源码
cargo build --release --features stealth
```

## 文件清单

| 文件 | 状态 |
|------|------|
| `docs/README.md` | ✅ 本文件 |
| `docs/article.md` | 待生成 |
| `docs/video-script.md` | 待生成 |
| `docs/copy.md` | 待生成 |
| `docs/wechat-copy.md` | 待生成 |
| `docs/posting-guide.md` | 待生成 |
| `docs/landing-page.html` | 待生成 |
| `docs/article-page.html` | 待生成 |
| `docs/wechat-page.html` | 待生成 |
| `docs/session-log.md` | ✅ 已初始化 |
| `docs/report.json` | 待生成 |
| `docs/assets/cover.png` | 待生成 |
| `audio/neural_1_2x.m4a` | 待生成 |
| `audio/subtitles_*.ass` | 待生成 |
| `video-project/out/final-with-subs.mp4` | 待生成 |

## 时间轴

- Step 0: 创建文档（当前）
- Step 1: 内容获取 ✅（GitHub API 已获取）
- Step 2: 分析内容
- Step 3: 构建项目
- Step 4: 生成文案
- Step 5: 构建HTML
- Step 6: 生成视觉
- Step 7: 生成音频
- Step 8: 生成字幕
- Step 9: 质量检查
- Step 10: 生成视频
- Step 11: 生成报告