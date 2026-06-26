---
metadata:
  platform: xhs
  duration: 45
  theme: tech-modern
  fps: 60
  resolution: 1080x1920
---

# 博主.skill 视频脚本

## 场景总览

| 场景 | 时长 | 帧范围 | 内容 |
|------|------|--------|------|
| 封面 | 5秒 | 0-300 | 主标题 + 安装命令 |
| 痛点 | 7秒 | 300-720 | 引出共鸣痛点 |
| 方案 | 8秒 | 720-1200 | 核心解决方案 |
| 特性 | 12秒 | 1200-1920 | 三大特性展示 |
| 示例 | 8秒 | 1920-2400 | 使用示例 |
| 结尾 | 5秒 | 2400-2700 | CTA + 链接 |

**总时长**: 45秒 @ 60fps = 2700帧

---

## 场景 1: 封面（0-3秒）

- **画面**: 深色渐变背景，Logo 动画进入
- **文字**: "博主.skill"
- **副标题**: "把任何博主变成你的 AI 对话伙伴"
- **命令**: `git clone https://github.com/YourongZhou/chat_with_me`
- **音频**: 科技感开场音效

---

## 场景 2: 痛点共鸣（3-10秒）

- **标题**: "你有没有遇到过？"
- **要点**（依次出现）:
  - 你关注的博主断更了 🫧
  - 崇拜的 V 转型了
  - 想和推主聊天，门槛太高
  - 明星从来不下场互动
- **音频**: 旁白引出共鸣

---

## 场景 3: 核心方案（10-18秒）

- **标题**: "咱要的是情绪价值，不是具体的人"
- **流程图**（三步）:
  - Step 1: 📱 提供博主链接
  - Step 2: 🧠 AI 分析语气风格
  - Step 3: ✨ 生成对话 Skill
- **平台标签**: Twitter / X ✅  小红书 ✅  Instagram 📝  GitHub 📝
- **音频**: 旁白说明三步流程

---

## 场景 4: 核心特性（18-30秒）

### 特性 1: 增量更新
- 图标: 🔄
- 说明: 先从一个 URL 创建，再 attach 新平台，旧语料不覆盖

### 特性 2: 统一持久化
- 图标: 📦
- 说明: 标准化目录结构，persona 可追踪、可复用

### 特性 3: 三模式合一
- 图标: 🎭
- 说明: roleplay / ask / rewrite 一个 Skill 全搞定

### 特性 4: Claude Skill 编译
- 图标: ⚡
- 说明: 自动编译成 Claude Code 可加载的 Skill

---

## 场景 5: 使用示例（30-40秒）

- **命令展示**:
  ```bash
  # 创建 persona
  persona create https://x.com/karpathy

  # 编译 skill
  skill build --person-id <id>

  # Claude Code 中使用
  /persona-andrej-karpathy
  roleplay: How should I learn LLM infra?
  ```
- **对话示例**:
  - roleplay: "How should I learn LLM infra from scratch?"
  - ask: "他公开表达里最明显的风格特征是什么？"
  - rewrite: "用他的风格改写这句话"

---

## 场景 6: 结尾（40-45秒）

- **标题**: "欢迎加入数字人格时代"
- **链接**: github.com/YourongZhou/chat_with_me
- **标签**: #AI人格 #PersonaSkill #ClaudeCode #数字克隆 #社交媒体
- **CTA**: "Star ⭐ 一起玩"
- **音频**: 收尾音效

---

## 旁白文本

### 封面旁白（5秒）
> 与其追逐具体的人，不如拥有他的风格。

### 痛点旁白（7秒）
> 你有没有遇到过——关注的博主断更了，崇拜的 V 转型了，想聊的推主从来不理你？咱要的是情绪价值，不是具体的人！

### 方案旁白（8秒）
> 博主.skill 做三件事：提供博主链接，AI 分析语气风格，生成对话 Skill。支持 Twitter、小红书，未来还有更多平台。

### 特性旁白（12秒）
> 特性一，增量更新，先从一个平台开始，再逐步 attach 新账号，旧语料自动积累。特性二，统一持久化，所有 persona 标准化存储，可追踪可复用。特性三，三模式合一，roleplay、ask、rewrite，一个 Skill 全搞定。特性四，Claude Skill 编译，自动生成 Claude Code 可加载的 Skill。

### 示例旁白（8秒）
> 来看实际效果。用 /persona-andrej-karpathy 加载卡尔帕西的风格。可以角色扮演，询问他的观点，或者用他的风格改写任何内容。

### 结尾旁白（5秒）
> 欢迎加入数字人格时代。链接是 github.com/YourongZhou slash chat_with_me，有兴趣的给个 Star，一起玩。
