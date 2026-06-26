# HTML Anything — 智能HTML编辑器

## 项目概述

HTML Anything 是由 Open Design 团队打造的智能HTML编辑器。核心理念：**Markdown是草稿，HTML才是人类阅读的最终形式**。在AI编程时代，你不再需要手动编辑文档，输出格式应该是读者真正想要的HTML。

## 核心特性

### 零API成本
无需任何API密钥。HTML Anything 复用你本地已有的 Claude Code、Cursor Agent、Codex、Gemini CLI、GitHub Copilot CLI、OpenCode、Qwen Coder、Aider 等8个AI编程工具的登录会话，实现**零额外开销**的文档生成。

### 75种技能模板
覆盖9大输出场景：
- **杂志文章** — 印刷级排版质感
- **演示文稿** — 20款Keynote风格
- **简历** — 专业排版
- **海报** — 新闻纸风格
- **小红书卡片** — 社交媒体适配
- **推文卡片** — X/推特适配
- **网页原型** — SaaS落地页/仪表盘
- **数据报告** — 专业图表
- **Hyperframes视频** — Remotion兼容帧脚本

### 一键导出
支持微信（juice内联CSS）、X/微博/知乎（高清PNG剪贴板）、知乎（LaTeX公式）、HTML下载、PNG下载。粘贴即可发布，无需二次排版。

### 流式渲染
通过SSE实现实时流式渲染。AI输出逐行解析，iframe实时预览生成过程。随时中断重提，避免浪费完整生成时间。

### 沙箱安全
所有用户生成的HTML在 `<iframe sandbox>` 隔离环境中运行，Tailwind CDN、Google Fonts、内联脚本均可用，但cookie和本地存储与主站隔离。

## 技术架构

基于4个开源项目构建：
- **nexu-io/open-design** — AI检测层、设计系统模型、SKILL.md协议
- **mdnice/markdown-nice** — CSS内联技术，微信/知乎适配
- **gcui-art/markdown-to-image** — iframe转高清PNG导出
- **alchaincyf/huashu-md-html** — 抗AI垃圾内容规范

## 使用方式

```bash
git clone https://github.com/nexu-io/html-anything
cd html-anything
pnpm install
pnpm dev
# → http://localhost:3000
```

打开浏览器后，顶栏自动检测已登录的AI编程CLI，右侧选择模板，左侧粘贴内容，⌘+Enter 即可生成。

## 输出质量

生成结果即为可发布成品，无须"之后再调整"。这是 HTML Anything 的质量标准——生成完成时，产出物就是受众最终看到的样子。