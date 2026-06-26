# LLM Wiki 原始内容

## 项目信息
- **GitHub**: https://github.com/nashsu/llm_wiki
- **星标**: 2800+
- **基础方法论**: Karpathy LLM Wiki

## 核心定位

LLM Wiki 是一个跨平台桌面应用，能将你的文档自动转化为有组织、相互关联的知识库。

**与传统 RAG 的本质区别**：
- 传统 RAG：每次查询都从零检索和回答
- LLM Wiki：增量构建并维护一个持久化的 Wiki，知识编译一次，持续进化

## 核心功能

### 1. 四信号知识图谱

四维关联度模型：
- 直接链接 ×3.0 — 通过 [[wikilinks]] 链接的页面
- 来源重叠 ×4.0 — 共享同一原始资料的页面
- Adamic-Adar ×1.5 — 共享共同邻居的页面
- 类型亲和 ×1.0 — 相同页面类型的加分

图谱可视化使用 sigma.js + graphology + ForceAtlas2：
- 按页面类型或社区着色节点
- 按链接数缩放节点大小
- 边的粗细按关联权重变化

### 2. Louvain 社区检测

- 自动聚类 — 根据链接拓扑发现哪些页面自然归为一组
- 内聚度评分 — 每个社区按内部边密度评分
- 一键切换 — 按页面类型或按发现的知识集群着色

### 3. Chrome 网页剪藏

- Mozilla Readability.js 精确提取文章内容
- Turndown.js 将 HTML 转换为 Markdown
- 项目选择器 — 选择剪藏到哪个 Wiki
- 自动摄入 — 剪藏内容自动触发两步摄入流程

### 4. Obsidian 兼容

- 三栏布局：知识树/文件树（左）+ 聊天（中）+ 预览（右）
- Wiki 目录可直接作为 Obsidian 仓库使用
- [[wikilink]] 语法用于交叉引用

### 5. 两步思维链摄入

第一步（分析）：LLM 阅读资料 → 结构化分析
- 关键实体、概念、论点
- 与现有 Wiki 内容的关联
- 与现有知识的矛盾和张力

第二步（生成）：LLM 基于分析 → 生成 Wiki 文件
- 带 frontmatter 的资料摘要
- 实体页面、概念页面及交叉引用
- 更新 index.md、log.md、overview.md

### 6. 深度研究

- 网络搜索查找相关资料
- LLM 智能生成搜索主题（读取 overview.md + purpose.md 获取领域上下文）
- 研究结果自动摄入 Wiki
- 最多 3 个并发任务

## 技术架构

三层架构：
1. 原始资料（不可变）
2. Wiki（LLM 生成）
3. Schema（规则和配置）

核心操作：Ingest（摄入）、Query（查询）、Lint（检查）

技术栈：
- 桌面: Tauri v2（Rust 后端）
- 前端: React 19 + TypeScript + Vite
- UI: shadcn/ui + Tailwind CSS
- 图谱: sigma.js + graphology + ForceAtlas2
- 向量: LanceDB

## 使用场景

- 研究笔记
- 个人知识管理
- 知识体系构建
- 深度研究辅助
