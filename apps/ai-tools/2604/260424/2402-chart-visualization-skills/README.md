# Chart Visualization Skills 视频项目

> Turn data into visual language for better thinking.

## 项目信息

| 属性 | 值 |
|------|-----|
| **名称** | chart-visualization-skills |
| **来源** | https://github.com/antvis/chart-visualization-skills |
| **作者** | AntV AI Team (Ant Group) |
| **协议** | MIT |
| **Stars** | Social (AntV 品牌) |
| **创建时间** | 2026-04-22 |

## 项目概述

Chart Visualization Skills 是 AntV 团队开源的数据可视化 AI 技能库，将数据转化为视觉语言，实现更好的思考。

## 核心技能（6个）

| 技能 | 功能 | 适用场景 |
|------|------|----------|
| chart-visualization | 26+图表类型智能生成 | 数据分析 |
| infographic-creator | 50+信息图模板 | 演示文稿 |
| icon-retrieval | 图标SVG搜索 | UI设计 |
| narrative-text-visualization | T8语法文本可视化 | 报告生成 |
| antv-s2-expert | 交叉分析表开发 | 表格分析 |
| antv-g6-graph | G6图可视化代码 | 关系图谱 |
| antv-g2-chart | G2图表代码生成 | 统计图表 |

## 技术亮点

- **G2 v5**: 30+图表类型，Spec Mode最佳实践
- **G6 v5**: 10+布局算法，15+交互行为
- **S2**: 多维交叉分析表引擎
- **Harness Engineering**: 174测试用例，准确率高达98.2%

## 评估结果

| 模型 | G2 | G6 |
|------|-----|-----|
| qwen3-coder-480b | 98.2% | 94.8% |
| Kimi-K2.5 | 97.7% | 96.9% |
| GLM-5.1 | 93.6% | 92.8% |
| DeepSeek-V3.2 | 90.8% | 97.9% |
| Context7 (Baseline) | 80.5% | 79.2% |

## 文件清单

```
chart-visualization-skills/
├── docs/
│   ├── README.md              ✅ 项目首页
│   ├── article.md             ✅ 原始内容
│   ├── video-script.md        ✅ 视频脚本
│   ├── copy.md                ✅ 营销文案
│   ├── wechat-copy.md         ✅ 公众号文案
│   ├── posting-guide.md        ✅ 发布指南
│   ├── landing-page.html       ✅ 落地页
│   ├── article-page.html       ✅ 文章页
│   ├── wechat-page.html        ✅ 微信适配页
│   ├── session-log.md          ✅ 会话日志
│   ├── report.json             ✅ 执行报告
│   └── assets/
│       ├── cover.png           ✅ 视频号封面
│       ├── cover-wechat.png    ✅ 公众号封面
│       └── cover-xhs.png       ✅ 小红书封面
├── audio/
│   ├── neural_1_2x.m4a         ✅ 配音
│   └── subtitles.ass           ✅ 字幕
└── video-project/
    └── out/
        └── final-with-subs.mp4  ✅ 最终视频
```

## 安装使用

```bash
# Claude Code
/plugin marketplace add antvis/chart-visualization-skills

# NPM
npm install -g @antv/chart-visualization-skills

# API
import { retrieve } from '@antv/chart-visualization-skills';
const skills = retrieve('bar chart', 'g2', 5);
```

## 视频规格

| 属性 | 值 |
|------|-----|
| 分辨率 | 1080×1920 (9:16) |
| 帧率 | 60fps |
| 时长 | ~45秒 |
| 主题 | tech-modern |
| 语速 | 1.2x |
