# Session Log - flowboard-video

## 项目信息
- **项目名称**: flowboard-video
- **项目描述**: FlowBoard 智能任务管理看板视频
- **GitHub**: github.com/sakimi-9/FlowBoard
- **开始时间**: 2026-04-17 09:55 GMT+8
- **结束时间**: 2026-04-17 12:16 GMT+8
- **总请求次数**: 14
- **状态**: 已完成

## 模型配置
- **默认模型**: minimax/MiniMax-M2.7
- **视频模型**: minimax/MiniMax-M2.7
- **图像模型**: Seedream (doubao-seedream-5-0-260128)

## 请求记录

| # | 时间 | 任务 | 模型 | 输入token | 输出token | 总token | 费用 | 处理时长 |
|---|------|------|------|----------|----------|---------|------|----------|
| 01 | 2026-04-17 09:55 | 项目初始化 / 内容研究 | minimax/MiniMax-M2.7 | - | - | - | - | - |
| 02 | 2026-04-17 10:00 | edge-tts 音频生成（74.5s原始） | edge-tts | - | - | - | - | - |
| 03 | 2026-04-17 10:01 | atempo 1.306x 处理（57s） | ffmpeg | - | - | - | - | - |
| 04 | 2026-04-17 10:05 | Remotion 视频渲染（3420帧） | remotion | - | - | - | - | ~3min |
| 05 | 2026-04-17 10:09 | ffmpeg 音频合并 | ffmpeg | - | - | - | - | - |
| 06 | 2026-04-17 10:09 | ffmpeg 字幕烧录 | ffmpeg | - | - | - | - | - |
| 07 | 2026-04-17 10:11 | 大字体修订（场景1-7） | minimax/MiniMax-M2.7 | - | - | - | - | - |
| 08 | 2026-04-17 10:49 | 字幕修订（10px，MarginL=30） | minimax/MiniMax-M2.7 | - | - | - | - | - |
| 09 | 2026-04-17 11:12 | 字幕重新烧录 | ffmpeg | - | - | - | - | - |
| 10 | 2026-04-17 11:49 | 文档补全（README等10个文件） | minimax/MiniMax-M2.7 | - | - | - | - | - |
| 11 | 2026-04-17 12:05 | Seedream 封面图生成 | Seedream API | - | - | - | - | - |
| 12 | 2026-04-17 12:06 | 封面图 PIL 裁剪 | python3 | - | - | - | - | - |
| 13 | 2026-04-17 12:13 | Remotion 封面渲染 | remotion | - | - | - | - | ~30s |
| 14 | 2026-04-17 12:16 | 封面帧提取 PNG | ffmpeg | - | - | - | - | - |

## 技术规格

| 项目 | 数值 |
|------|------|
| 视频时长 | 57秒 |
| 分辨率 | 1080×1920（竖屏） |
| 帧率 | 60fps |
| 音频 | edge-tts zh-CN-YunjianNeural，1.306x |
| 字幕 | ASS，10px，MarginL=30/MarginR=30/MarginV=30，底部居中 |
| 主题 | tech-modern |

## 文件清单

| 文件 | 状态 |
|------|------|
| docs/README.md | ✅ |
| docs/article.md | ✅ |
| docs/video-script.md | ✅ |
| docs/copy.md | ✅ |
| docs/wechat-copy.md | ✅ |
| docs/posting-guide.md | ✅ |
| docs/landing-page.html | ✅ |
| docs/article-page.html | ✅ |
| docs/wechat-page.html | ✅ |
| docs/session-log.md | ✅ 本文件 |
| docs/assets/cover.png | ✅ Remotion 渲染 |
| docs/assets/cover_seedream.png | ✅ Seedream 生成 |
| docs/assets/gen_subtitles.py | ✅ |
| docs/assets/generate_cover.py | ✅ |
| audio/neural_1x.m4a | ✅ |
| audio/neural_1_2x.m4a | ✅ |
| audio/subtitles_57s.ass | ✅ |
| audio/full_narration.txt | ✅ |
| video-project/out/flowboard-final.mp4 | ✅ 最终视频 |
