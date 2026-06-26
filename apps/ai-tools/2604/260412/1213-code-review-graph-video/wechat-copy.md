# 公众号文案 - code-review-graph

---

**标题**：Claude Code 每次都重读整个代码库？这个开源工具让AI只读需要的内容

**摘要**：code-review-graph 开源！用知识图谱解决 AI 编程工具重复读取代码的问题，8.2× token 节省。

**作者**：元曜科技

**日期**：2026-04-12

---

## 正文

### 开头

AI 编程工具每次任务都重读整个代码库？太浪费了！

**code-review-graph** 开源了！用知识图谱解决这个痛点。

---

### 核心技术

用 **Tree-sitter** 解析代码结构，构建持久化的代码地图。

通过 **MCP 协议**，AI 每次只读取相关的代码文件，而不是扫描整个代码库。

---

### 效果数据

| 指标 | 数值 |
|------|------|
| 平均 Token 节省 | **8.2×** |
| 最高节省 | **49×** |
| 图谱刷新 | **<2 秒** |

实测：代码审查平均节省 8.2 倍 Token，大型项目最高节省 49 倍。

还支持**增量更新**，文件改动后 2 秒内完成图谱刷新。

---

### 支持的工具

支持 **Codex**、**Claude Code**、**Cursor**，Windsurf、Zed 等主流工具。

19 种语言加上 Jupyter notebook，全部支持。

---

### 技术特点

- 完全本地存储，SQLite 数据库
- 开源免费

---

### 结尾

**安装命令**：`pip install code-review-graph`

---

**原文链接**：[github.com/tirth8205/code-review-graph](https://github.com/tirth8205/code-review-graph)

**引导关注**：觉得有帮助？欢迎关注「元曜科技」，获取更多 AI 工具使用技巧。
