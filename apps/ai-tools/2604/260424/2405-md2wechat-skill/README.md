# md2wechat-skill

> 用 Markdown 写公众号文章，一键转换为精美排版并自动上传到微信草稿箱。支持 AI 多主题样式和批量发布，让公众号写作像发朋友圈一样简单。

## 项目信息

- **GitHub**: https://github.com/geekjourneyx/md2wechat-skill
- **最新版本**: v2.0.7
- **作者**: geekjourneyx（独立开发者/AI Builder）
- **站点**: [md2wechat.com](https://www.md2wechat.com/) / [md2wechat.cn](https://md2wechat.cn/)

## 视频规格

- **平台**: 小红书 / 视频号 / 抖音
- **分辨率**: 1080×1920（9:16 竖屏）
- **时长**: 75 秒
- **帧率**: 60fps
- **主题**: 科技现代风（深色背景 + 渐变）

## 视频场景（8 场景）

| 场景 | 内容 | 时长 |
|------|------|------|
| 1. 封面 | 主标题 + 副标题 | 5s |
| 2. 痛点 | 微信编辑器有多难用？ | 7s |
| 3. 解决 | 一行命令，全部搞定 | 10s |
| 4. 功能 | 5 大核心功能 | 18s |
| 5. 主题 | 30+ 精美主题 | 12s |
| 6. 平台 | 多 AI 平台支持 | 10s |
| 7. 上手 | 3 步快速开始 | 8s |
| 8. CTA | 结尾号召 | 5s |

## 文件清单

| 文件 | 路径 | 状态 |
|------|------|------|
| 项目首页 | `docs/README.md` | ✅ 已完成 |
| 原始内容 | `docs/article.md` | ✅ 已完成 |
| 视频脚本 | `docs/video-script.md` | ✅ 已完成 |
| 营销文案集 | `docs/copy.md` | ✅ 已完成 |
| 公众号文案 | `docs/wechat-copy.md` | ✅ 已完成 |
| 发布指南 | `docs/posting-guide.md` | ✅ 已完成 |
| 落地页 | `docs/landing-page.html` | ⏳ 生成中 |
| 文章页 | `docs/article-page.html` | ⏳ 生成中 |
| 微信适配页 | `docs/wechat-page.html` | ⏳ 生成中 |
| 会话日志 | `docs/session-log.md` | ✅ 已完成 |
| 执行报告 | `docs/report.json` | ✅ 已完成 |
| 封面图 | `docs/assets/cover.png` | ⏳ 待生成 |
| 最终视频 | `video-project/out/final-video.mp4` | ⏳ 待生成 |

## 核心功能

1. **Markdown 转换** — `convert` 将 Markdown 转换为微信格式 HTML
2. **AI 风格写作** — `write` 用创作者风格辅助写作
3. **AI 去痕** — `humanize` 去除 AI 生成痕迹
4. **小绿书** — `create_image_post` 创建图片消息
5. **草稿推送** — `convert --draft` 一键发送到微信草稿箱

## 主题系统

30+ 主题，分四大系列：

- **Minimal** — 干净克制，纯色文字（8 色）
- **Focus** — 居中对称，标题双横线（8 色）
- **Elegant** — 层次丰富，左边框递减（8 色）
- **Bold** — 视觉冲击，满底色圆角（8 色）

## 安装命令

```bash
# macOS 优先
brew install geekjourneyx/tap/md2wechat

# NPM
npm install -g @geekjourneyx/md2wechat

# Go
go install github.com/geekjourneyx/md2wechat-skill/cmd/md2wechat@v2.0.7

# 一键脚本
curl -fsSL https://github.com/geekjourneyx/md2wechat-skill/releases/download/v2.0.7/install.sh | bash
```

## 快速使用

```bash
# 配置微信
md2wechat config init

# 预览效果
md2wechat preview article.md

# 转换并发送草稿
md2wechat convert article.md --draft --cover cover.jpg
```
