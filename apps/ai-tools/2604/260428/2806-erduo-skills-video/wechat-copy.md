---
title: "这个AI Agent技能库太全了！6大工具一站式解决"
summary: "Erduo Skills AI Agent技能库，提供每日日报、RSS精选、转录翻译、Web To Markdown、Gemini水印移除等6大工具"
tags:
  - AI工具
  - Agent技能
  - RSS
  - 翻译
  - 转录
  - 开源项目
source: https://github.com/rookie-ricardo/erduo-skills
---

# 这个 AI Agent 技能库太全了！6 大工具一站式解决

信息太多处理不过来？想给 AI 配一套完整的工作流工具？

今天推荐一个开源项目——**Erduo Skills**，AI Agent 技能库，让你的工具能力瞬间提升！

## 6 大核心技能

**🗞 每日日报**
多源抓取 + 智能筛选，自动生成技术日报。Master-Worker 架构，并行抓取支持无头浏览器处理 JS 渲染页面。聚合 HackerNews、HuggingFace Papers、ProductHunt 等多层级信源。

**📰 AK RSS Digest**
固定 RSS 源精选摘要，10 分制打分过滤，仅输出 7 分以上高质量内容。预设信源清单，默认抓取最近 7 天。

**✍️ 转录精修师**
语音转录文本精修为高可读性文章。核心原则：文字精修师，不是内容概括师——保留原句原词，拒绝高度概括。自动删除口水词、精准降噪。

**🌐 翻译精修师**
四步精翻工作流：**分析 → 初译 → 审校 → 终稿**。支持 ZH↔EN、ZH↔JA 双向翻译，内置 9 种风格预设。

**🔗 Web To Markdown**
URL 路由抓取 + Readability 清洗，输出干净 Markdown。通用网页走 r.jina.ai，微信公众号、知乎、飞书走 cuimp Chrome 指纹 HTTP 抓取。

**🖼 Gemini 水印移除**
逆向 Alpha 混合算法去除 Gemini 图片右下角水印，像素级还原。纯 Python 实现，仅依赖 Pillow。

## 安装方式

```bash
npx skills add rookie-ricardo/erduo-skills
```

一条命令，装好就能用！

---

项目完全开源，MIT License，GitHub 地址：
https://github.com/rookie-ricardo/erduo-skills

如果你觉得有用，点个**在看**或者**转发**给需要的朋友！

我是书彦，持续分享 AI 工具和效率技巧 🚀
