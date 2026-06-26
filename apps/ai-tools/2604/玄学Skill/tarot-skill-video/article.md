---
title: "🔮 Tarot Skill：AI 塔罗占卜 Agent Skill"
summary: "AI 塔罗占卜 Agent Skill，78张完整牌义，6种牌阵，真随机抽牌脚本，支持 Cursor/Claude Code/OpenClaw"
tags:
  - Tarot
  - AI Agent
  - Skill
  - Cursor
  - Claude Code
  - OpenClaw
platform: all
source: https://github.com/daman-ovo-0404/tarot-skill
---

# 🔮 Tarot Skill：AI 塔罗占卜 Agent Skill

## 什么是 Tarot Skill

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
Python 脚本 `scripts/draw.py`，密码学安全随机源，位置权重、时段因子、正逆位概率全内置

### 解读方法论
四维透镜模型 / 牌间关系推理 / 叙事弧串联 / 反巴纳姆检验

## 支持平台

- Cursor
- Claude Code
- OpenClaw agents

## 快速使用

```bash
# 单张今日指引
python3 scripts/draw.py --spread single

# 三牌阵 + 问题
python3 scripts/draw.py --spread three --question "事业方向"

# 凯尔特十字
python3 scripts/draw.py --spread celtic --question "感情"
```
