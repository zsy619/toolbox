# UI UX Pro Max 视频创作项目

> 让AI写前端不再"程序员审美"！Claude Code秒变专业设计师。

## 项目概述

本项目基于推文内容创作，介绍 UI UX Pro Max 工具——一款给AI编程助手装上设计系统知识库的Skill。

**核心数据：**
- 161 条行业推理规则
- 67 种 UI 风格
- 161 套配色方案
- 57 组字体搭配

## 文件结构

```
docs/
├── README.md              # 本文件
├── video-script.md       # 视频脚本
├── copy.md              # 营销文案（小红书/视频号）
├── wechat-copy.md       # 公众号长文文案
├── wechat-page.html     # 公众号适配页（多端响应式）
├── posting-guide.md     # 多平台发布指南
├── landing-page.html    # 宣传落地页
└── assets/
    ├── cover.png         # 封面图 (2.4MB)
    └── illustration-kb.png  # 知识库插图 (1.2MB)

video-project/
├── out/
│   └── ui-ux-pro-max-v3.mp4  # 最终视频 (2.5MB, 30秒)
├── src/
│   ├── Root.tsx          # Remotion Composition 注册
│   └── Composition.tsx   # 视频组件源码
└── package.json
```

## 快速开始

### 视频渲染

```bash
cd video-project
npm install
npx remotion render UxProMaxVideo --output out/video --fps 60
```

### 查看视频

视频文件位于：`video-project/out/ui-ux-pro-max-v3.mp4`

## 内容来源

- **推文链接**: https://x.com/sitinme/status/2039156523751117146
- **发布时间**: 2026-04-01
- **作者**: sitin (@sitinme)

## 视频内容

| 时间 | 场景 | 内容 |
|------|------|------|
| 0-3s | 封面 | AI封面图 + UI UX Pro Max / 让AI写出专业设计 |
| 3-8s | 痛点 | AI写前端 / 功能没问题，界面不忍直视？ |
| 8-15s | 解决方案 | 💡 装上 UI UX Pro Max |
| 15-22s | 数据展示 | 161行业·67风格·161配色·57字体 |
| 22-27s | 安装方式 | /plugin marketplace add... |
| 27-30s | CTA | 让AI写出专业设计的页面 |

## 平台适配

| 平台 | 格式 | 时长 | 特点 |
|------|------|------|------|
| 微信视频号 | 9:16 | 30秒 | 科技内容增长快 |
| 小红书 | 9:16 | 15秒-3分钟 | 年轻用户多 |
| 抖音/快手 | 9:16 | 15秒-3分钟 | 流量大 |

## 安装 UI UX Pro Max

Claude Code：
```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

其他工具：
```bash
npm install -g uipro-cli
uipro init --ai cursor
```

## 相关资源

- [UI UX Pro Max 项目主页](https://nextlevelbuilder.ai)
- [Claude Code 官网](https://claude.ai/code)
- [Remotion 视频制作框架](https://remotion.dev)

## 许可证

本项目仅供学习交流使用，内容版权归原作者所有。
