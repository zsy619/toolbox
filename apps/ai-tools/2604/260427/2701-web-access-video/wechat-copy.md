# 公众号文案 - Web Access

## 文章标题
给 AI Agent 装上完整联网能力！这个 Skill 太强了

## 摘要
Web Access Skill 补上了联网策略、CDP 浏览器操作、站点经验积累，让 AI Agent 如虎添翼。

## 正文

---

### AI Agent 的联网痛点

AI Agent 原本的联网能力（WebSearch、WebFetch）缺少调度策略和浏览器自动化能力。

面对复杂的联网任务，往往力不从心。

---

### Web Access Skill 来了

这个 Skill 补上的是：**联网策略 + CDP 浏览器操作 + 站点经验积累**。

兼容所有支持 SKILL.md 的 Agent（Claude Code、Cursor、Gemini CLI、Codex CLI 等）。

---

### 核心能力

**联网工具自动选择**
WebSearch / WebFetch / curl / Jina / CDP，按场景自主判断，可任意组合。

**CDP Proxy 浏览器操作**
直连用户日常 Chrome，天然携带登录态，支持动态页面、交互操作、视频截帧。

**三种点击方式**
- `/click`（JS click）
- `/clickAt`（CDP 真实鼠标事件）
- `/setFiles`（文件上传）

**并行分治**
多目标时分发子 Agent 并行执行，共享一个 Proxy，tab 级隔离。

**站点经验积累**
按域名存储操作经验（URL 模式、平台特征、已知陷阱），跨 session 复用。

---

### 一键安装

```bash
npx skills add eze-is/web-access
```

---

**相关链接**
GitHub：https://github.com/eze-is/web-access
官网：https://web-access.eze.is
