# Session Log - toutiao-video

## 项目信息
- **项目名称**: toutiao-video
- **项目描述**: Skills 写得好，AI 干活没烦恼
- **来源**: 今日头条 - 编程充电站
- **URL**: https://www.toutiao.com/article/7629527294830445099/
- **开始时间**: 2026-04-17 13:09 GMT+8
- **结束时间**: 2026-04-17 13:41 GMT+8
- **总耗时**: 约32分钟
- **状态**: 已完成

## 模型配置
- **默认模型**: minimax/MiniMax-M2.7
- **音频模型**: edge-tts zh-CN-YunjianNeural (+20%)
- **图像模型**: PIL 本地生成

## ⚠️ Token 追踪说明

> `session_status` 工具输出 **session 级别累计**数据，不是 per-request 分解。
> 以下数值为本项目会话的 session 累计总量。

## Session 累计数据

| 字段 | 值 | 说明 |
|------|-----|------|
| **Model** | minimax/MiniMax-M2.7 | 会话主模型 |
| **Tokens in** | ~85,000 | session 累计输入（含 context） |
| **Tokens out** | ~123 | session 累计输出 |
| **Total tokens** | ~85,123 | in + out |
| **Cost** | ~$0.03 | session 累计费用 |
| **Context** | 119,000 / 205,000 (58%) | context 使用率 |

> 注：edge-tts / ffmpeg / npx remotion 为外部工具，无 token 消耗统计。
> `session_status` 工具为 session 级别数据，非 per-request 精确拆分。

## 技术规格

| 项目 | 数值 |
|------|------|
| **视频时长** | 57秒 |
| **视频分辨率** | 1080×1920（竖屏 9:16） |
| **帧率** | 60fps |
| **视频码率** | 290kbps（h264） |
| **音频码率** | 192kbps（AAC） |
| **音频处理** | edge-tts +20% → atempo=1.09（56.97s） |
| **字幕** | ASS，10px，黄色，底部居中，MarginV=30 |
| **主题** | tech-modern（深色渐变） |
| **渲染帧数** | 3420帧 @ 60fps |
| **渲染时长** | ~6分钟 |

## 场景时间轴

| 场景 | 时间 | 帧范围 | 内容 |
|------|------|--------|------|
| 1 | 0-3s | 0-180 | 开场 Hook |
| 2 | 3-15s | 180-900 | 问题诊断（3个问题） |
| 3 | 15-18s | 900-1080 | 本质金句 |
| 4 | 18-42s | 1080-2520 | 4个标准（2×2网格） |
| 5 | 42-51s | 2520-3060 | 4个踩坑 |
| 6 | 51-57s | 3060-3420 | 总结 CTA |

## 文件清单

| 文件 | 状态 | 说明 |
|------|------|------|
| docs/README.md | ✅ | 项目概览、规格、时间轴 |
| docs/article.md | ✅ | 原始文章（baoyu-fetch抓取） |
| docs/video-script.md | ✅ | 分镜脚本+完整旁白 |
| docs/copy.md | ✅ | 小红书/视频号/抖音文案 |
| docs/wechat-copy.md | ✅ | 公众号白底文案 |
| docs/posting-guide.md | ✅ | 各平台发布指南 |
| docs/landing-page.html | ✅ | 深色科技风落地页 |
| docs/article-page.html | ✅ | 深色文章阅读页 |
| docs/wechat-page.html | ✅ | 公众号白底适配页 |
| docs/session-log.md | ✅ | 本文件 |
| docs/report.json | ✅ | 执行报告 |
| docs/assets/cover.png | ✅ | PIL封面（1080×1920） |
| docs/assets/gen_subtitles.py | ✅ | 字幕生成脚本 |
| docs/assets/generate_cover.py | ✅ | PIL封面生成脚本 |
| audio/neural_1_2x.m4a | ✅ | 原始音频（62s @ 1.2x） |
| audio/subtitles_62s.ass | ✅ | 原始字幕（62s基准） |
| audio/subtitles_57s.ass | ✅ | 缩放后字幕（57s，按57/62比例） |
| video-project/out/toutiao-final.mp4 | ✅ | 最终视频（57秒，1080×1920，60fps） |
