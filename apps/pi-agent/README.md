# pi-agent 教程站

本目录收录了 [buchidonggua/dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes/tree/main/pi-agent) 仓库中 **pi-agent 教程**的全部 27 篇内容，整理为可双击打开的离线网页。

## 文件结构

```
.
├── index.html              教程主页（导读 + 27 章 + 周边生态 / 视频 / 官方对照入口）
├── ecosystem.html          周边生态与延伸阅读（SDK 原仓 / 扩展目录 / 第三方教程）
├── videos.html             视频与可视化教程（官方讲解 / 实战 walkthrough / 第三方评测）
├── reference.html          官方权威对照（与 earendil-works/pi + pi.dev 文档逐项核对）
├── P01.html ~ P07.html     实战上手篇 · 7 章
├── M01.html ~ M10.html     源码精读篇 · TypeScript 版 · 10 章
├── M01-py.html ~ M10-py.html  源码精读篇 · Python 版 · 10 章（与 TS 同主题）
├── README.md               本说明
├── _pages/                 生成器源码（Python）
│   ├── build.py            Markdown → HTML 转换器
│   ├── docs_prac/          实战篇源 Markdown（GitHub 拉取）
│   ├── docs_src_ts/        源码篇 TS 版源 Markdown
│   └── docs_src_py/        源码篇 Python 版源 Markdown
└── _shared/                所有页面共享的资源（本地化，**离线可用**）
    ├── js/                 highlight.js 主包 + 8 种语言包
    └── css/                github-dark / github-light 主题
```

## 使用方式

- **直接双击** `index.html` 即可在浏览器中阅读——不依赖服务器、不依赖网络（除首次加载 highlight.js 已本地化的副本）
- 阅读实战篇从 `P01.html` 开始；想看 SDK 实现从 `M01.html` 起
- TS 版和 Python 版内容**主题对齐**，可平行阅读做对照

## 功能

| 功能 | 实现 |
|---|---|
| 代码高亮 | highlight.js 11.10（8 种语言：TS/Python/JS/Bash/JSON/XML/Markdown/纯文本） |
| 一键复制 | 代码块右上角「复制」按钮；clipboard API 优先 + execCommand 降级，file:// 下也可用 |
| 暗/亮主题 | 右上角 ◐ 按钮；localStorage 持久化 |
| TS ↔ Python 互链 | M01↔M01-py 等双向跳转 |
| 章节导航 | 每页底部「上一章 / 下一章」+ 侧栏同组全部章节 |
| 微信分享卡片 | 每个页面都有完整的 `itemprop` / OG / Twitter / JSON-LD |
| 外链安全 | 所有 `target="_blank"` 链接都加 `rel="noopener noreferrer"` |

## 如何更新

源仓库如有更新，只需：

```bash
cd _pages
python3 build.py
```

`build.py` 会从 GitHub 重新拉取最新 Markdown（URL 列表由 GitHub API 列目录生成，无文件名硬编码），重新生成全部 28 个 HTML。

## 官方权威补丁

对照表（reference.html）里 `warn / 新增` 项对应的官方内容，已在 `_pages/build.py` 的 `OFFICIAL_PATCHES` 字典里写成「🛡️ 官方权威补丁」段落，生成时自动注入到对应章节（`P02 / P06 / P07 / M02 / M10 / M10-py`）。改补丁只需编辑该字典并重新 `python3 build.py`。Python 版（`OFFICIAL_PATCHES_PY`）自带 Python 代码示例（snake_case API 名），与 TS 版的内容一一对应。

## 版权与授权

- **文档内容**：[CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/) — 来自 buchidonggua/dg-ai-notes 仓库，作者为 buchidonggua
- **本页生成器**（`build.py`）：本仓库自有，按与内容相同的 CC-BY-SA-4.0 分发
- **highlight.js**：[BSD-3-Clause](https://spdx.org/licenses/BSD-3-Clause.html)，见 [highlightjs/highlight.js](https://github.com/highlightjs/highlight.js)

分发时请保留每页底部的「本文源自 ...」与「CC-BY-SA-4.0」声明。