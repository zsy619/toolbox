# Browser Harness 视频项目

> The simplest, thinnest, self-healing harness for LLM browser tasks

## 项目信息

| 属性 | 值 |
|------|-----|
| 项目名称 | Browser Harness |
| 项目类型 | AI Agent 浏览器工具 |
| GitHub | https://github.com/browser-use/browser-harness |
| Stars | 开源项目 |
| 许可证 | MIT |

## 核心理念

The simplest, thinnest, **self-healing** harness that gives LLM **complete freedom** to complete any browser task. Built directly on CDP.

Agent writes what's missing, mid-task. No framework, no recipes, no rails. One websocket to Chrome, nothing between.

## 核心特性

| 特性 | 说明 |
|------|------|
| Self-healing | AI mid-task 时自动补全缺失函数 |
| 极简架构 | ~592行 Python，无框架依赖 |
| CDP 直连 | 直接建立在 Chrome DevTools Protocol 上 |
| Domain Skills | 可扩展的领域技能系统 |

## 技术架构

- **run.py** (~36 lines) — 运行预加载 helper 的 Python
- **helpers.py** (~195 lines) — 起始工具调用，agent 会编辑这些
- **admin.py + daemon.py** (~361 lines) — CDP websocket 和 socket bridge

## 视频规格

| 参数 | 值 |
|------|-----|
| 分辨率 | 1080×1920 (9:16) |
| 帧率 | 60fps |
| 时长 | ~50秒 |
| 语速 | 1.2x |
| 主题 | tech-modern |
| 字幕 | PingFang SC 10px 黄色 |

## 文件清单

### 文档文件
- [ ] README.md (本文件)
- [ ] article.md (原始内容分析)
- [ ] video-script.md (分镜脚本)
- [ ] copy.md (营销文案)
- [ ] wechat-copy.md (公众号文案)
- [ ] posting-guide.md (发布指南)
- [ ] landing-page.html (落地页)
- [ ] article-page.html (文章页)
- [ ] wechat-page.html (微信适配页)
- [ ] session-log.md (会话日志)
- [ ] report.json (执行报告)

### 资源文件
- [ ] cover.png (封面图)
- [ ] neural_1_2x.m4a (配音)
- [ ] subtitles.ass (字幕)
- [ ] final-with-subs.mp4 (最终视频)

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-04-22 | 项目创建，完成文档结构 |
