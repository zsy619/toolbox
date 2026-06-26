---
title: "赛博算命 Skill：用 Claude Code 批八字"
summary: "基于 Claude Code 的八字排盘与命理分析工具，参照九本经典典籍，交互式对话完成命盘分析"
tags:
  - Claude Code
  - Skill
  - 八字
  - 命理
  - AI工具
platform: all
source: https://github.com/jinchenma94/bazi-skill
---

# 赛博算命 Skill：用 Claude Code 批八字

## 什么是赛博算命 Skill

**赛博算命 Skill** 是一个基于 Claude Code 的八字排盘与命理分析工具。通过交互式对话收集出生信息，排出四柱八字，参照九本经典命理典籍进行专业分析。

## 三大功能

### 1. 信息收集
逐步收集姓名、阳历/农历生日、出生时辰、性别、出生地等信息

### 2. 排盘计算
自动排出年柱、月柱、日柱、时柱，计算大运与流年

### 3. 综合分析
日主强弱、十神关系、五行平衡、格局判定、大运流年解读，以及事业、感情、健康等方面的建议

## 九本经典参考典籍

| 典籍 | 简称 |
|------|------|
| 《穷通宝典》 | 论日主调候 |
| 《三命通会》 | 论格局神煞 |
| 《滴天髓》 | 论五行旺衰 |
| 《渊海子平》 | 论十神六亲 |
| 《千里命稿》 | 论命例实证 |
| 《协纪辨方书》 | 论择日神煞 |
| 《果老星宗》 | 论星命合参 |
| 《子平真诠》 | 论用神格局 |
| 《神峰通考》 | 论命理辨误 |

## 使用方法

在 Claude Code 中输入以下任意关键词即可触发：

`算八字` `看八字` `批八字` `排八字` `四柱` `命盘` `算命` `排盘` `bazi`

## 安装方法

```bash
# 安装到当前项目
mkdir -p .claude/skills
git clone https://github.com/jinchenma94/bazi-skill .claude/skills/bazi

# 或安装到全局
git clone https://github.com/jinchenma94/bazi-skill ~/.claude/skills/bazi
```

---

⚠️ 本 Skill 仅供传统文化学习与娱乐参考，请理性看待。
