# Skills-Link 视频项目

## 项目概览

- **项目名称**: skills-link-video
- **来源**: https://github.com/shanliuling/skills-link
- **主题**: 一个 skills 文件夹，所有 AI 应用共享
- **主题风格**: tech-modern（科技现代风）
- **平台**: 微信视频号 / 小红书 / 抖音

## 规格参数

| 参数 | 值 |
|------|------|
| 分辨率 | 1080×1920（9:16竖屏） |
| 帧率 | 60fps |
| 视频时长 | 约40秒 |
| 音频语速 | 1.2x |
| 字幕 | ASS格式，72px，黄色，底部居中 |
| 字体 | PingFang SC |

## 核心卖点

1. **41+ AI Agent 支持** — Claude Code / Cursor / Windsurf / Cline / Gemini CLI / Trae 等
2. **单命令安装** — `npm i -g skills-link`
3. **符号链接方案** — 每个 app 的 `~/.xxx/skills` 指向同一个 Master 目录
4. **跨设备同步** — `skills-link sync` 推送到 GitHub，另一台机器自动拉取
5. **rules-link 支持** — 同时支持 rules 同步

## 工作原理

```
Claude Code ──┐
Cursor ───────┤
Windsurf ─────┤
Cline ────────┼──▶  ~/AISkills/  ◀──▶  GitHub
Gemini CLI ───┤        ▲
Trae ─────────┤        │
Roo Code ─────┘   Master 目录
                  (唯一数据源)
```

## 支持的 Agent（41+）

Claude Code, Cursor, Windsurf, Cline, Gemini CLI, Trae, Roo Code, Continue, CodeGPT, GitHub Copilot, Goose, OpenClaw, Kiro CLI, Qwen Code, Kimi Code CLI, Felo, Augment, Zed, Julep, Roo Code, Mistral Vibe, Droid 等。

## 命令

| 命令 | 说明 |
|------|------|
| `skills-link` | 主命令 — 同步 skills 到所有应用 |
| `skills-link add <repo>` | 从 GitHub 安装 skill |
| `skills-link list` | 列出本地 skills |
| `skills-link sync` | 推送变更到 GitHub |
| `skills-link app` | 管理启用的应用 |
| `rules-link` | 同步 rules |

## 安装要求

- Node.js 18+
- Windows / macOS / Linux
- Windows 使用 Junction links（无需管理员权限）
- macOS / Linux 使用原生 symlinks