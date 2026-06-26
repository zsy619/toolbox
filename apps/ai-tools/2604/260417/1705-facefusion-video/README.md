# FaceFusion AI 换脸工具风险警示视频

## 项目概览

- **项目名称**: facefusion-video
- **主题**: FaceFusion AI换脸工具的危险性与防范
- **作者**: 鸟哥 | 蓝鸟会🕊️ (@NFTCPS)
- **平台**: 微信视频号 / 小红书 / 抖音
- **创建时间**: 2026-04-17

## 视频规格

| 参数 | 值 |
|------|-----|
| 分辨率 | 1080×1920（竖屏） |
| 帧率 | 60fps |
| 时长 | ~57秒 |
| 主题风格 | tech-modern（科技现代风） |
| 字体 | PingFang SC / Microsoft YaHei |
| 字幕 | ASS格式，底部居中，10px |

## 视频时间轴（3420帧 @ 60fps）

| 场景 | 时间 | 帧 | 内容 |
|------|------|-----|------|
| 1 | 0-3s | 0-180 | 开场 Hook：AI换脸诈骗已来临 |
| 2 | 3-12s | 180-720 | FaceFusion 工具介绍（27.5k Stars） |
| 3 | 12-24s | 720-1440 | 四大危险特性 |
| 4 | 24-38s | 1440-2280 | 现实中的四个诈骗场景 |
| 5 | 38-48s | 2280-2880 | 社会问题分析 |
| 6 | 48-57s | 2880-3420 | 四个自保建议 + CTA |

## 文件清单

### 文档目录 (docs/)
- [README.md](README.md) - 本文件
- [article.md](article.md) - 原始推文内容
- [video-script.md](video-script.md) - 视频分镜脚本
- [copy.md](copy.md) - 小红书/视频号/抖音营销文案
- [wechat-copy.md](wechat-copy.md) - 公众号正文
- [posting-guide.md](posting-guide.md) - 多平台发布指南
- [landing-page.html](landing-page.html) - 宣传落地页
- [article-page.html](article-page.html) - 文章阅读页
- [wechat-page.html](wechat-page.html) - 公众号适配页
- [session-log.md](session-log.md) - Token消耗追踪
- [report.json](report.json) - 执行报告

### 资产目录 (docs/assets/)
- [cover.png](assets/cover.png) - 封面图
- [gen_subtitles.py](assets/gen_subtitles.py) - 字幕生成脚本

### 音频目录 (audio/)
- [neural_1_2x.m4a](audio/neural_1_2x.m4a) - edge-tts 音频（1.2x）
- [subtitles_57s.ass](audio/subtitles_57s.ass) - ASS字幕文件

### 视频项目 (video-project/)
- [src/Root.tsx](video-project/src/Root.tsx) - Remotion 根组件
- [src/VerticalVideo.tsx](video-project/src/VerticalVideo.tsx) - 竖屏视频组件
- [src/themes/tech-modern.ts](video-project/src/themes/tech-modern.ts) - 主题配置
- [out/toutiao-final.mp4](video-project/out/toutiao-final.mp4) - 最终视频
