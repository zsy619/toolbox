# Skills-Link 公众号文案

## 公众号标题
一个文件夹，41+AI应用共享skills！

## 摘要（≤44字）
Skills-Link用符号链接方案，让所有AI编程工具共享一个skills目录，跨设备同步，41+Agent支持。

## 正文

### 开头（引出问题）

用AI编程工具的同学，有没有这样的烦恼？

Claude Code配了一套skills，Cursor配了另一套，Windsurf又是第三套……

每次更新一个skill，要手动同步到41个地方。太麻烦了。

### 引出方案

GitHub上有一个项目叫Skills-Link，它用符号链接方案解决这个问题。

核心思路：**~/AISkills/ 作为唯一数据源，所有AI应用的skills链接到这里。**

### 核心功能

**41+ AI Agent支持**

Claude Code、Cursor、Windsurf、Cline、Gemini CLI、Trae、Roo Code、Continue、GitHub Copilot、Goose、OpenClaw、Qwen Code、Kimi Code CLI、Kiro CLI……还有universal fallback，任何未列出的agent也能用。

**符号链接方案**

每个app的`~/.xxx/skills`变成指向~/AISkills/的符号链接。新增或编辑一个skill，所有应用立即可见。

**跨设备同步**

skills-link sync推送到GitHub，另一台机器运行skills-link自动拉取。

**rules-link支持**

同时支持rules同步。

### 使用方式

```bash
npm i -g skills-link
skills-link
```

首次运行自动引导，检测应用、导入skills、创建链接。

### 结尾

GitHub: github.com/shanliuling/skills-link
MIT许可，跨平台支持。