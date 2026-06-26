# Obsidian LLM Wiki 视频项目

> 用 LLM 持续维护 Obsidian 知识库的 Claude Code 全局 Skill

## 项目信息

| 属性 | 值 |
|------|-----|
| 项目名称 | Obsidian LLM Wiki |
| 项目类型 | Claude Code Skill |
| GitHub | https://github.com/Lesterffx/obsidian-llm-wiki |
| 灵感来源 | Andrej Karpathy llm-wiki |
| 核心功能 | 三层架构：raw/wiki/schema |

## 核心理念

LLM Wiki 的做法：LLM **持续构建和维护一个持久化的 wiki** —— 一组结构化、互相链接的 markdown 文件，位于你和原始资料之间。

知识编译一次，然后**保持最新**，而非每次查询重新推导。

## 三层架构

| 层级 | 目录 | 说明 |
|------|------|------|
| Schema | CLAUDE.md | 配置层：告诉 LLM 如何工作 |
| Wiki | wiki/ | 可写层：LLM 生成和维护 |
| Raw | raw/ | 不可变层：原始资料（只读） |

## 核心命令

| 命令 | 说明 |
|------|------|
| ingest | 处理新资料，集成到 wiki |
| query | 使用 wiki 回答问题 |
| lint | 健康检查 |
| migrate | 迁移已有笔记 |
| index | 重建 index.md |

## 视频规格

| 参数 | 值 |
|------|-----|
| 分辨率 | 1080×1920 (9:16) |
| 帧率 | 60fps |
| 时长 | ~55秒 |
| 语速 | 1.2x |
| 主题 | tech-modern |
| 字幕 | PingFang SC 10px 黄色 |

## 文件清单

- [ ] README.md
- [ ] article.md
- [ ] video-script.md
- [ ] copy.md
- [ ] wechat-copy.md
- [ ] posting-guide.md
- [ ] landing-page.html
- [ ] article-page.html
- [ ] wechat-page.html
- [ ] session-log.md
- [ ] report.json
- [ ] cover.png
- [ ] neural_1_2x.m4a
- [ ] subtitles.ass
- [ ] final-with-subs.mp4

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-04-22 | 项目创建 |
