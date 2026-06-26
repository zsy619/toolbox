# InfiniteTalk 视频项目

## 项目信息

| 项目 | 内容 |
|------|------|
| **项目名称** | infinitetalk-video |
| **来源** | GitHub: MeiGen-AI/InfiniteTalk |
| **链接** | https://github.com/MeiGen-AI/InfiniteTalk |
| **描述** | Unlimited-length talking video generation that supports image-to-video and video-to-video generation |
| **Stars** | 6196 |
| **Forks** | 1091 |
| **语言** | Python |
| **论文** | arxiv.org/abs/2508.14033 |

## 视频规格

| 参数 | 值 |
|------|------|
| 分辨率 | 1080×1920（竖屏） |
| 帧率 | 60fps |
| 时长 | 约50秒 |
| 主题 | tech-modern（蓝色科技风） |
| 主色调 | #3B82F6（蓝色） |

## 内容摘要

**InfiniteTalk** 是稀疏帧视频配音框架，支持无限时长生成。

### 核心功能

1. **稀疏帧视频配音 (Sparse-frame Video Dubbing)**
   - 输入视频和音频，生成口型准确的新视频
   - 不仅同步口型，还让头部摆动、身体姿势和面部表情与音频节奏保持一致

2. **无限时长生成 (Infinite-Length Generation)**
   - 支持生成超长时长视频
   - 打破同类工具只能生成几秒钟短片的限制

3. **静态照片说话 (Image-to-Video)**
   - 只需一张人物照片和一段音频
   - 即可生成该人物说话的动画视频

4. **高稳定性**
   - 相比 MultiTalk 更好保持身份一致性
   - 减少手部或身体的扭曲变形

### 技术亮点

- 基于 Wan2.1 基础模型开发
- 支持 480P 和 720P 分辨率
- 提供 Gradio 网页演示界面
- 提供 ComfyUI 工作流节点支持

### 适用场景

| 场景 | 说明 |
|------|------|
| 视频自媒体/搬运 | 外语视频翻译配音，同步口型 |
| 虚拟数字人 | AI 讲解员、虚拟主播 |
| 影视后期 | 台词修改和口型订正 |

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