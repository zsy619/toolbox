# wx-favorites-viz - 微信收藏可视化视频项目

## 项目概述

| 项目 | 内容 |
|------|------|
| 源链接 | https://github.com/zhuyansen/wx-favorites-report |
| 项目类型 | Claude Code Skill / 数据可视化工具 |
| 主题 | tech-modern（科技现代风） |
| 平台 | 视频号 / 小红书 / 抖音 |

## 视频规格

| 规格 | 值 |
|------|---|
| 分辨率 | 1080×1920（竖屏 9:16） |
| 帧率 | 60fps |
| 时长 | 约 56 秒（1.2x 语速） |
| 编码 | H.264 / AAC |
| 字幕 | ASS 格式，PingFang SC 10px 黄色，底部居中 |

## 时间轴

| 场景 | 时间范围 | 内容 |
|------|----------|------|
| 封面 | 0-3s | 项目名称 + Claude Code Skill |
| 痛点 | 3-9s | 微信收藏吃灰问题引入 |
| 解决方案 | 9-16s | Claude Code 一句话搞定 |
| 技术流程 | 16-26s | frida / 解密 / ECharts 三步 |
| 功能展示 | 26-40s | 报告功能介绍 |
| 踩坑经验 | 40-50s | 6 轮迭代 8 个坑 |
| 结尾 | 50-56s | GitHub 开源地址 |

## 文件清单

```
wx-favorites-viz/
├── docs/
│   ├── README.md              # 本文件
│   ├── article.md             # 原始内容
│   ├── video-script.md        # 视频脚本
│   ├── copy.md                # 营销文案集
│   ├── wechat-copy.md         # 公众号文案
│   ├── posting-guide.md       # 发布指南
│   ├── landing-page.html      # 落地页
│   ├── article-page.html      # 文章阅读页
│   ├── wechat-page.html       # 公众号适配页
│   ├── session-log.md         # Session 日志
│   ├── report.json            # 执行报告
│   └── assets/
│       ├── cover.png          # 封面图
│       ├── generate_cover.py  # 封面生成脚本
│       └── gen_subtitles.py   # 字幕生成脚本
├── audio/
│   ├── neural_full.mp3        # 原始音频
│   ├── neural_1_2x.m4a        # 处理后音频（1.2x）
│   └── subtitles_*.ass        # 字幕文件
└── video-project/
    ├── src/                   # Remotion 源码
    ├── out/                   # 渲染输出
    └── package.json
```

## 技术栈

| 组件 | 技术 |
|------|------|
| 密钥提取 | frida 17.x, CCKeyDerivationPBKDF hook |
| 数据库解密 | PyCryptodome AES-256-CBC, HMAC-SHA512 |
| 数据解析 | Python sqlite3 + regex XML |
| 可视化 | ECharts 5.x CDN, echarts-wordcloud 2.x |
| 报告格式 | 单文件 HTML，暗色主题 |

## 报告功能

- 统计卡片：总数、跨越天数、日均、来源数
- 月度趋势折线 + 面积图
- 内容类型甜甜圈图
- 来源 Top 15 水平柱状图
- 星期 × 小时活跃热力图
- 词云 / 标签云
- 可筛选可搜索收藏浏览区
- 详情弹窗

## 踩坑记录

- 微信 4.x 表结构变化（`FavItems` → `fav_db_item`）
- 收藏密钥只在打开收藏页面时才加载
- SIP 阻止签名微信 App Store 版，需复制到 ~/Desktop 再签名
- XML 字段名不统一（`<pagetitle>` vs `<title>`）

## 项目状态

- [x] Step 0: 文档生成
- [ ] Step 1: 内容获取
- [ ] Step 2: 分析内容
- [ ] Step 3: 构建项目
- [ ] Step 4: 生成文案
- [ ] Step 5: 构建 HTML
- [ ] Step 6: 生成视觉（封面）
- [ ] Step 7: 生成音频
- [ ] Step 8: 生成字幕
- [ ] Step 9: 质量检查
- [ ] Step 10: 生成视频
- [ ] Step 11: 生成报告
