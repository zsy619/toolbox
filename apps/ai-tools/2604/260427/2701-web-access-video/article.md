# Web Access - 给 AI Agent 装上完整联网能力

## 项目概览

- **项目名称**: Web Access
- **GitHub**: https://github.com/eze-is/web-access
- **官网**: https://web-access.eze.is
- **作者**: 一泽 Eze
- **主题**: 给 Claude Code 等 Agent 装上完整联网能力的 Skill

## 核心能力

### 1. 联网工具自动选择
WebSearch / WebFetch / curl / Jina / CDP，按场景自主判断，可任意组合

### 2. CDP Proxy 浏览器操作
直连用户日常 Chrome，天然携带登录态，支持动态页面、交互操作、视频截帧

### 3. 三种点击方式
- `/click`（JS click）
- `/clickAt`（CDP 真实鼠标事件）
- `/setFiles`（文件上传）

### 4. 本地 Chrome 书签/历史检索
find-url.mjs 查询公网搜不到的目标（内部系统）或用户访问过的页面

### 5. 并行分治
多目标时分发子 Agent 并行执行，共享一个 Proxy，tab 级隔离

### 6. 站点经验积累
按域名存储操作经验（URL 模式、平台特征、已知陷阱），跨 session 复用

### 7. 媒体提取
从 DOM 直取图片/视频 URL，或对视频任意时间点截帧分析

## 版本更新

- **v2.5.0**: 本地 Chrome 资源检索（书签/历史查询）
- **v2.4.3**: 修复 CLAUDE_SKILL_DIR 路径问题
- **v2.4.1**: 跨平台支持（Windows / Linux / macOS）
- **v2.4**: 站点内 URL 可靠性、平台错误提示不可信
- **v2.3**: 浏览哲学重构、Jina 积极推荐

## 安装方式

```bash
# 方式一：npx skills 一键安装（推荐）
npx skills add eze-is/web-access
```

## 兼容平台

Claude Code、Cursor、Gemini CLI、Codex CLI 等支持 SKILL.md 的 Agent
