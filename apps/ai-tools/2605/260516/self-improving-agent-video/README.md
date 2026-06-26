# Self-improving Agent 视频项目

## 项目概述

- **标题**: Self-improving Agent
- **副标题**: 持续优化的AI智能体
- **核心功能**: 记录经验总结、错误信息与修正方案，以实现持续优化
- **技能地址**: https://cn.clawhub-mirror.com/pskoett/self-improving-agent

## 技术规格

- 分辨率: 1080×1920 (竖屏)
- 帧率: 60fps
- 时长: 46秒
- 主题: 科技现代风 (Tech Vision)
- 配色: 主色#2563EB, 辅色#7C3AED, 强调色#10B981, 背景色#0F172A

## 视频场景

1. **标题页** - Self-improving Agent 大字标题
2. **痛点引入** - AI助手重复犯错的困扰
3. **解决方案** - Self-improving Agent 介绍
4. **核心功能** - 记录经验/保存错误/修正方案
5. **工作原理** - 3步流程展示
6. **效果展示** - 数据可视化（↓60%错误率，↑85%效率）
7. **应用场景** - 代码审查、文档撰写、数据分析、问题诊断
8. **开源信息** - 开源社区创新实践
9. **结尾** - 总结与召唤行动

## 文件结构

```
self-improving-agent-video/
├── assets/
│   ├── cover.png          # 封面图
│   ├── audio.mp3          # 配音音频
│   ├── script.txt         # 配音脚本
│   └── subtitles.srt       # 字幕文件
├── video-project/
│   ├── src/
│   │   ├── Video.tsx      # 主视频组件（9场景）
│   │   └── index.tsx      # Remotion入口
│   ├── package.json
│   └── tsconfig.json
├── out/
│   ├── video_final.mp4    # 最终成片（主版本）
│   ├── video_xhs.mp4      # 小红书版本
│   └── png_seq_full/      # 完整PNG序列（2760帧）
└── docs/
```

## 渲染说明

Remotion 渲染时 h264 流有编码问题，解决方案：
1. 使用 `--sequence` 标志渲染 PNG 序列
2. 使用 ffmpeg 编码 PNG 序列为 h264
3. 合并音频和字幕

```bash
# 渲染PNG序列
cd video-project
npx remotion render src/index.tsx Video out/png_seq/ --sequence --log=error

# ffmpeg编码
ffmpeg -framerate 60 -i out/png_seq/element-%04d.png \
  -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -r 60 \
  out/video_fixed.mp4

# 合并音频
ffmpeg -i out/video_fixed.mp4 -i ../assets/audio.mp3 \
  -filter_complex "[1:a]atrim=duration=46,asetpts=PTS-STARTPTS[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -t 46 \
  out/video_with_audio.mp4

# 烧字幕
ffmpeg -i out/video_with_audio.mp4 \
  -vf "subtitles=../assets/subtitles.srt:force_style='FontSize=36,PrimaryColour=&H00FFFFFF,Outline=2'" \
  -c:v libx264 -preset fast -crf 20 -c:a copy \
  out/video_final.mp4
```

## 配音信息

- 语音: 微软神经网络语音 (zh-CN-XiaoxiaoNeural)
- 语速: +20%
- 时长: ~46秒

## 输出文件

| 文件 | 时长 | 分辨率 | 帧率 | 用途 |
|------|------|--------|------|------|
| video_final.mp4 | 46s | 1080×1920 | 60fps | 主版本 |
| video_xhs.mp4 | 46s | 1080×1920 | 60fps | 小红书 |
