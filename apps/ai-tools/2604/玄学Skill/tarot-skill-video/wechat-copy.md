---
title: "用 AI 批塔罗牌？这个 Tarot Skill 太神了"
summary: "AI 塔罗占卜 Agent Skill，78张完整牌义，6种牌阵，真随机抽牌脚本，支持 Cursor/Claude Code/OpenClaw"
tags:
  - Tarot
  - AI Agent
  - Skill
  - Cursor
  - Claude Code
source: https://github.com/daman-ovo-0404/tarot-skill
---

# 用 AI 批塔罗牌？这个 Tarot Skill 太神了

## 想学塔罗，但：

- 🤔 牌义太多记不住？
- 📚 牌阵太复杂不会用？
- 🎲 不知道怎么抽牌？

## 🔮 Tarot Skill 帮你搞定！

**Tarot Skill** 是 AI 塔罗占卜 Agent Skill，为 Cursor / Claude Code / OpenClaw 等 AI agent 提供专业级塔罗解读能力。

## 核心特性

### 78 张完整牌义
韦特 + 托特 + 现代心理塔罗三大系统融合，每张大阿卡纳含心理原型与托特视角

### 6 种牌阵
- 单张
- 三牌阵
- 五牌阵
- 月亮牌阵
- 马蹄形
- 凯尔特十字

### 牌间关系理论体系
愚人之旅 / 数字旅程 / 牌性 / 对位牌 / 宫廷牌关系网 / 生命之树

### 真随机抽牌脚本
`scripts/draw.py`，密码学安全随机源，位置权重、时段因子、正逆位概率全内置

## 支持平台

✅ Cursor
✅ Claude Code
✅ OpenClaw agents

## 快速使用

```bash
# 单张今日指引
python3 scripts/draw.py --spread single

# 三牌阵 + 问题
python3 scripts/draw.py --spread three --question "事业方向"

# 凯尔特十字
python3 scripts/draw.py --spread celtic --question "感情"
```

---

今天的分享就到这里，如果你觉得有用，点个**在看**或者**转发**给需要的朋友！

我是书彦，持续分享 AI 工具和效率技巧 🚀
