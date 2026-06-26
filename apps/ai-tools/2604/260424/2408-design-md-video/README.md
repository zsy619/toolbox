# design.md 视频项目

## 项目信息

| 项目 | 内容 |
|------|------|
| **项目名称** | design-md-video |
| **来源** | GitHub: google-labs-co/design.md |
| **链接** | https://github.com/google-labs-co/design.md |
| **描述** | Design tokens 格式规范 - 机器可读 + 人类可读双层结构 |
| **备注** | 仓库返回404，使用用户提供内容创建 |

## 视频规格

| 参数 | 值 |
|------|------|
| 分辨率 | 1080×1920（竖屏） |
| 帧率 | 60fps |
| 时长 | 约50秒 |
| 主题 | tech-modern（蓝色科技风） |
| 主色调 | #3B82F6（蓝色） |

## 内容摘要

**design.md** 是 Google Labs 推出的设计 token 格式规范，核心创新是"机器可读 token + 人类可读 rationale"的双层结构。

### 核心格式

**1. YAML Front Matter（机器层）**
- colors：语义化命名 + 十六进制值
- typography：字体家族、字号、字重、行高、字距
- rounded / spacing：圆角与间距的阶梯尺度
- components：组件级 token，支持引用

**2. Markdown Body（人类层）**
8个固定章节：
1. Overview - 品牌与风格总览
2. Colors - 色彩角色与情感
3. Typography - 排版气质
4. Layout - 布局与留白策略
5. Elevation & Depth - 层级与阴影
6. Shapes - 形状语言
7. Components - 组件规范
8. Do's and Don'ts - 设计禁区

### CLI 工具链

- **lint**：结构校验 + WCAG 对比度检测 + token 引用完整性检查
- **diff**：对比两个版本的 DESIGN.md，识别回归
- **export**：导出为 Tailwind 主题配置或 W3C DTCG 标准 tokens.json
- **spec**：输出规范原文，便于注入 agent prompt

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