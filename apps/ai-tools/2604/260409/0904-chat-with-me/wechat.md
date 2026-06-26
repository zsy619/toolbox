---
title: "🔥 把博主变成 AI 对话伙伴！这个开源项目太狠了"
summary: "你关注的博主断更了？崇拜的 V 转型了？「博主.skill」帮你把任何博主的语气风格打包成 AI，随时对话！Twitter、小红书全支持，Claude Code 直接加载。"
tags:
  - AI人格
  - 博主.skill
  - Persona Skill
  - Claude Code
  - 推特采集
  - 小红书
  - 开源项目
  - 数字克隆
  - 社交媒体
  - 语料库
---

# 🔥 把博主变成 AI 对话伙伴！这个开源项目太狠了

你有没有遇到过这些遗憾——

> 你关注的博主断更了，留下万千粉丝风中凌乱🫧
> 你崇拜的大 V 转型了，曾经犀利的笔触一夜消失
> 你想和最爱的推主聊天，发现门槛太高，根本不回消息
> 你粉的明星从不下场互动，泡泡也是几乎不发

**咱要的是情绪价值，不是具体的人！**

今天要介绍的这个开源项目，帮你把任何博主的语气风格"打包"成 AI，随时对话！

---

## 🎯 这是什么

**博主.skill**（[github.com/YourongZhou/chat_with_me](https://github.com/YourongZhou/chat_with_me)）是一个 persona 制作仓库。

**它做的事情很具体：**

```
提供博主链接 → 生成模拟语气和风格的 Skill → 用他的风格评价事件、和你聊天！
```

**当前版本完成：**

- ✅ 从公开社交账号抓取文字内容（Twitter/X、小红书）
- ✅ 统一归一化为 corpus JSONL 语料
- ✅ 生成 persona 持久化文件
- ✅ 编译成 Claude Code 可加载的 Skill

---

## 🚀 核心特性

### 1️⃣ 增量更新

先从一个 URL 创建 persona，再给已有 persona attach 新平台账号，**旧语料不会被覆盖**，持续积累。

### 2️⃣ 统一 Persona 持久化

每个 persona 都保存在标准目录结构中：

```
personas/<person_id>/
├── person.json       # 基础信息
├── profile.md        # 个人档案
├── sources.json      # 来源平台
├── corpora/         # 语料库
│   ├── x/
│   └── xiaohongshu/
└── skill/           # Claude Skill
    ├── manifest.json
    ├── persona.md
    └── style.md
```

### 3️⃣ 单 Skill 三模式

统一入口，三种玩法：

```
/persona-<slug>
roleplay: ...   # 角色扮演对话
ask: ...        # 向 persona 提问
rewrite: ...    # 用 persona 风格改写
```

### 4️⃣ Claude Skill 编译

`skill build` 自动生成两层文件：

- **人可读的源产物**：`personas/<person_id>/skill/`
- **Claude Code 实际加载的**：`.claude/skills/persona-<slug>/`

---

## 📦 支持的平台

| 平台 | 后端 | 状态 | 采集内容 |
|------|------|------|----------|
| X / Twitter | Scweet | ✅ 已实现 | bio、timeline 正文 |
| 小红书 | MediaCrawler | ✅ 已实现 | 主页简介、笔记正文 |
| Instagram | Instaloader | 📝 预留 | 待定 |
| 知乎 | MediaCrawler | 📝 预留 | 待定 |
| GitHub | PyGithub | 📝 预留 | 待定 |

---

## 🔧 快速开始

### 安装

```bash
git clone https://github.com/YourongZhou/chat_with_me
cd chat_with_me
conda create -y -n chat python=3.11
conda run -n chat python -m pip install -e .[dev]
```

### 初始化后端

**Twitter：**
```bash
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime backend bootstrap x
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime backend login x
```

**小红书：**
```bash
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime backend bootstrap xiaohongshu
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime backend login xiaohongshu
```

### 创建 Persona

```bash
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime \
  persona create https://x.com/karpathy
```

### 编译 Skill

```bash
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime \
  --storage-dir personas \
  skill build --person-id <id>
```

### Claude Code 中使用

```
/persona-andrej-karpathy
roleplay: How should I learn to build LLM infra from scratch?

/persona-andrej-karpathy
ask: 他公开表达里最明显的风格特征是什么？

/persona-andrej-karpathy
rewrite: We should simplify the stack.
```

---

## 💡 应用场景

- **粉丝福利**：博主任天堂断更？自己做一个继续对话
- **学习模仿**：让 AI 分析并模仿博主的写作风格
- **内容参考**：用竞品博主的风格生成内容参考
- **情感陪伴**：和已故名人、虚拟角色"对话"

---

## 🔮 未来计划

- [ ] 图片内容处理
- [ ] 视频字幕提取
- [ ] 评论语料采集
- [ ] 社交关系图谱

---

**项目地址**：https://github.com/YourongZhou/chat_with_me

**一起玩？** 觉得有用的话，记得给个 ⭐️

---

*往期推荐：*

- *[[工具] 5 分钟搭建个人 AI 知识库，比 Notion AI 更强大](...)*
- *[[教程] Claude Code 高级用法：让你的 AI 助手更懂你](...)*
- *[[开源] 这个项目让你用自然语言操控一切数据库](...)*
