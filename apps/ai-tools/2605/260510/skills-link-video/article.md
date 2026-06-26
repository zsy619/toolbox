# Skills-Link 原始内容

## 项目信息
- **GitHub**: https://github.com/shanliuling/skills-link
- **作者**: shanliuling
- **许可**: MIT
- **npm**: skills-link

## 核心定位

**One skills folder, every AI app.**

一个 skills 文件夹，所有 AI 应用共享。一条命令，在 41+ AI 编程工具之间同步本地 skills。

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

每个 app 的 `~/.xxx/skills` 变成指向同一个 Master 目录的符号链接。新增或编辑一个 skill，所有应用立即可见。

## 核心特性

1. **41+ Agent 支持** — Claude Code / Cursor / Windsurf / Cline / Gemini CLI / Trae 等
2. **符号链接方案** — ~/AISkills/ 作为 Master 目录，所有 app 链接到它
3. **跨设备同步** — `skills-link sync` 推送到 GitHub，另一台机器自动拉取
4. **rules-link 支持** — 同时支持 rules 同步
5. **universal fallback** — 未列出的 agent 也能用

## 安装使用

```bash
npm i -g skills-link
skills-link
```

## 支持的 Agent

AdaL, Amp, Antigravity, Augment, Claude Code, Cline, CodeBuddy, Codex, Command Code, Continue, Cortex Code, Crush, Cursor, Droid, Gemini CLI, GitHub Copilot, Goose, iFlow CLI, Junie, Kilo Code, Kimi Code CLI, Kiro CLI, Kode, MCPJam, Mistral Vibe, Mux, Neovate, OpenClaw, OpenCode, OpenHands, Pi, Pochi, Qoder, Qwen Code, Replit, Roo Code, Trae, Trae CN, Windsurf, Zencoder

## 命令

- `skills-link` — 主命令，同步 skills
- `skills-link add <repo>` — 从 GitHub 安装
- `skills-link list` — 列出本地 skills
- `skills-link sync` — 推送变更到 GitHub
- `rules-link` — 同步 rules