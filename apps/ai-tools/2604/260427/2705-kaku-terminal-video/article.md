# Kaku - 为 AI 编码而生的终端

## 项目概览

- **项目名称**: Kaku (書く, かく)
- **GitHub**: https://github.com/tw93/Kaku
- **主题**: A fast, out-of-the-box terminal built for AI coding
- **作者**: tw93
- **许可证**: MIT

## 核心特点

### 1. Zero Config
开箱即用，默认配置 JetBrains Mono、macOS 字体渲染、低分辨率字体

### 2. Theme-Aware Experience
自动切换深色/浅色模式，随 macOS 主题变化，优化的选区颜色和字体粗细

### 3. Curated Shell Suite
内置 zsh 插件，集成 prompt、diff、导航工作流

### 4. Fast & Lightweight
- 可执行文件大小减少 40%（约 40MB）
- 启动延迟：即时启动
- Shell 引导：100ms（上游 200ms）

### 5. WezTerm-Compatible Config
完全兼容 WezTerm Lua 配置，无迁移成本

### 6. Polished Defaults
- 选中即复制
- 可点击的文件路径
- 历史记录 peek
- 分屏输入广播
- 后台标签页完成时的视觉提示

## AI 助手功能

### 错误修复
命令失败时自动建议修复，按 Cmd+Shift+E 应用

### 自然语言转命令
在提示符输入 #，Kaku 发送给 LLM 并将结果注入回命令行

### AI 工具配置
支持 Claude Code、Codex、Gemini CLI、Copilot CLI、Kimi Code 等

## 安装方式

```bash
# 下载 DMG
brew install tw93/tap/kakuku

# 或手动
# 下载 Kaku DMG → 拖到 Applications
```

## 快捷键

- 新建标签: Cmd + T
- 新建窗口: Cmd + N
- 分屏垂直: Cmd + D
- 分屏水平: Cmd + Shift + D
- AI 面板: Cmd + Shift + A
- 应用 AI 建议: Cmd + Shift + E
- 打开 Lazygit: Cmd + Shift + G
- Yazi 文件管理器: Cmd + Shift + Y

## 三部曲

- **Kaku (書く)** - 写代码
- **Waza (技)** -  drills habits
- **Kami (紙)** - ships documents