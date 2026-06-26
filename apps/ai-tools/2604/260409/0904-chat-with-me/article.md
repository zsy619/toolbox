---
title: "博主.skill - 把任何博主变成你的 AI 对话伙伴"
summary: "你关注的博主断更了？崇拜的 V 转型了？「博主.skill」让你用博主的语气和风格继续对话！采集文字内容，生成模拟人格的 Skill，在 Claude Code 里用他的方式聊天。"
tags:
  - AI人格
  - 社交媒体
  - Persona Skill
  - Claude Code
  - 数字克隆
  - 推特采集
  - 小红书
  - 语料库
platform: all
---

# 博主.skill — 把任何博主变成你的 AI 对话伙伴

你有没有过这样的遗憾——

- 你关注的博主断更了，曾经犀利的笔触一夜消失
- 你崇拜的大 V 转型了，再也看不到熟悉的内容风格
- 你粉的明星从不下场互动，泡泡🫧几乎从不发
- 你想和最爱的推主聊天，发现门槛太高，根本不回消息

**咱要的是情绪价值，不是具体的人！**

---

## 这是什么

**博主.skill**（chat_with_me）是一个 persona 制作仓库。它的核心能力很简单：

> 提供博主链接 → 生成模拟他语气和风格的 Skill → 用他的风格评价事件，用他的语气和你聊天！

**当前版本完成的事情：**

1. 从公开社交账号抓取**文字内容**（Twitter/X、小红书）
2. 统一归一化为 corpus JSONL 语料
3. 生成 persona 持久化文件
4. 编译成 Claude Code 可加载的 Skill

---

## 核心特性

### 1. 统一 Persona 持久化

每个 persona 都被保存在标准目录结构中：

```
personas/<person_id>/
  person.json          # 基础信息
  profile.md           # 个人档案
  sources.json         # 来源平台
  corpora/
    x/<account>.jsonl    # Twitter 语料
    xiaohongshu/<account>.jsonl  # 小红书语料
  skill/
    manifest.json
    persona.md
    style.md
    examples.md
    commands.json
```

### 2. 增量更新

- 先从一个 URL 创建 persona
- 再给已有 persona attach 新平台账号
- **旧语料不会被覆盖**，持续积累

### 3. Claude Skill 编译

`skill build` 产出两层文件：

- **人可读的源产物**：`personas/<person_id>/skill/`
- **Claude Code 实际加载的**：`.claude/skills/persona-<slug>/`

### 4. 单 Skill 三模式

不再依赖三个独立 slash commands，统一入口：

```
/persona-<slug>
roleplay: ...   # 角色扮演对话
ask: ...        # 向 persona 提问
rewrite: ...     # 用 persona 风格改写内容
```

---

## 支持的平台

| 平台 | 后端 | 状态 | 采集内容 |
|------|------|------|----------|
| X / Twitter | Scweet | ✅ 已实现 | bio、timeline 正文 |
| 小红书 | MediaCrawler | ✅ 已实现 | 主页简介、笔记正文 |
| Instagram | Instaloader | 📝 预留 | 待定 |
| 知乎 | MediaCrawler | 📝 预留 | 待定 |
| GitHub | PyGithub | 📝 预留 | 待定 |

---

## 使用流程

### Step 1: 安装环境

```bash
git clone https://github.com/YourongZhou/chat_with_me
cd chat_with_me
conda create -y -n chat python=3.11
conda run -n chat python -m pip install -e .[dev]
```

### Step 2: 初始化后端

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

### Step 3: 创建 Persona

```bash
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime \
  persona create https://x.com/karpathy
```

### Step 4: 编译 Skill

```bash
conda run -n chat python -m social_persona_skill.cli \
  --runtime-root .runtime \
  --storage-dir personas \
  skill build \
  --person-id <id>
```

### Step 5: 在 Claude Code 中使用

```
/persona-andrej-karpathy
roleplay: How should I learn to build LLM infra from scratch?

/persona-andrej-karpathy
ask: 他公开表达里最明显的风格特征是什么？

/persona-andrej-karpathy
rewrite: We should simplify the stack and reduce operational complexity.
```

---

## 技术原理

### 采集层

- **Scweet**：从 Twitter/X 抓取 bio 和 timeline 正文
- **MediaCrawler**：小红书扫码登录态复用 + 笔记正文采集

### 归一化层

所有平台内容统一转换为 JSONL 格式：

```json
{"platform": "x", "account": "karpathy", "text": "...", "timestamp": "..."}
```

### Persona 生成层

根据语料生成：
- `profile.md`：身份背景
- `style.md`：说话风格
- `examples.md`：对话示例
- `persona.md`：人格定义

### Skill 编译层

最终打包为 Claude Code 可加载的 Skill，包含 manifest 和指令集。

---

## 应用场景

**粉丝福利**：博主任天堂断更？自己做一个继续对话！

**学习模仿**：想学某个博主的写作风格？让 AI 帮你分析并模仿！

**品牌监测**：用竞品博主的风格生成内容参考？

**情感陪伴**：和已故名人、虚拟角色"对话"？

---

## 未来计划

- [ ] 图片内容处理
- [ ] 视频字幕提取
- [ ] 评论语料采集
- [ ] 社交关系图谱

---

*项目地址：https://github.com/YourongZhou/chat_with_me*
