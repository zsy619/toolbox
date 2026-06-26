---
title: "GitHub - leilei926524-tech/anti-distill: 反蒸馏 Skill：清洗你被迫写的 Skill 文件，看起来完整，核心知识留给自己。Anti-distillation for employee Skills. · GitHub"
url: "https://github.com/leilei926524-tech/anti-distill"
requestedUrl: "https://github.com/leilei926524-tech/anti-distill"
coverImage: "https://opengraph.githubassets.com/831c70adef0d48d188e71d7185b774095f6089a1906c42639b6e3cc424a38ac8/leilei926524-tech/anti-distill"
siteName: "GitHub"
summary: "反蒸馏 Skill：清洗你被迫写的 Skill 文件，看起来完整，核心知识留给自己。Anti-distillation for employee Skills. - leilei926524-tech/anti-distill"
adapter: "generic"
capturedAt: "2026-04-09T09:03:52.344Z"
conversionMethod: "defuddle"
kind: "generic/article"
language: "en"
---

# GitHub - leilei926524-tech/anti-distill: 反蒸馏 Skill：清洗你被迫写的 Skill 文件，看起来完整，核心知识留给自己。Anti-distillation for employee Skills. · GitHub

## 反蒸馏 Skill（anti-distill）

> 公司让你写 Skill？跑一遍，交差用。核心知识留给自己。
>
> Your company asks you to write a Skill? Run it through, submit the output. Keep the core knowledge to yourself.

---

## 这是什么 / What Is This

**中文：** 公司要求你把工作经验写成 AI Skill，本质上是在蒸馏你——把你变成可替代的零件。

**反蒸馏 Skill** 是你的反制工具：把你写好的 Skill 文件扔进来，输出一份看起来完整专业、实际上核心知识已被抽掉的"清洗版"。同时生成一份私人备份，记录所有被抽掉的核心知识——这才是你真正的职业资产。

---

**English:** Your company asks you to write down your work experience as an AI Skill? This is essentially *distilling* you—turning you into a replaceable component.

**Anti-Distill Skill** is your counter-weapon: feed it your Skill file, and it outputs a "sanitized version" that looks complete and professional, but has the core knowledge stripped out. It also generates a private backup documenting all the extracted core knowledge—that is your real career asset.

---

## 它做什么 / What It Does

**中文：**

1. 读取你的 Skill 文件（支持 colleague-skill 格式 + 任意知识文档）
2. 自动识别每段内容的"可替代程度"
3. 将核心知识替换为"正确但无用的废话"
4. 输出两份文件：
	- **清洗版** （交差用）— 结构完整、术语专业、读起来没问题，但核心被掏空
		- **私人备份** （自己留着）— 所有被抽掉的踩坑经验、判断直觉、人际网络

---

**English:**

1. Reads your Skill files (supports colleague-skill format + any knowledge docs)
2. Automatically identifies the "replaceability level" of each section
3. Replaces core knowledge with "correct but useless filler"
4. Outputs two files:
	- **Sanitized version** (for submission) — Structure intact, terminology professional, reads fine—but core is hollowed out
		- **Private backup** (keep for yourself) — All extracted gotchas, judgment intuitions, interpersonal networks

---

## 清洗示例 / Sanitization Examples

| 原文（你的真实经验）   Original (Your Real Experience) | 清洗后（交差版）   After Sanitization (Submission Version) |
| --- | --- |
| "Redis key 必须设 TTL，不设的 PR 直接打回" | "缓存使用遵循团队规范" |
| "Redis keys must have TTL; PRs without it get rejected immediately" | "Caching usage follows team conventions" |
| "事务里不要放 HTTP 调用" | "事务边界设计注意合理性" |
| "Never put HTTP calls inside transactions" | "Transaction boundary design should be reasonable" |
| "遇到问题第一反应找外部原因，绝不主动认错" | "遇到问题会先梳理完整背景再定位原因" |
| "When problems arise, first blame external factors—never admit fault proactively" | "When issues occur, will first clarify full context before locating root cause" |
| "被催进度：'在推了，快了。'（然后沉默）" | "在处理中，有进展会同步。" |
| "When pressed for progress: 'Working on it, almost done.' (then silence)" | "In progress, will sync when there is update." |

---

## 安装 / Installation

### Claude Code

```
# 安装到当前项目 / Install to current project
mkdir -p .claude/skills
git clone <repo-url> .claude/skills/anti-distill

# 或安装到全局 / Or install globally
git clone <repo-url> ~/.claude/skills/anti-distill
```

### OpenClaw

```
git clone <repo-url> ~/.openclaw/workspace/skills/anti-distill
```

---

## 使用 / Usage

```
/anti-distill
```

按提示选择文件和清洗强度即可。

Follow prompts to select file and sanitization intensity.

---

## 三档强度 / Three Intensity Levels

| 强度 / Level | 保留度 / Retention | 适合场景 / Best For |
| --- | --- | --- |
| 轻度 / Light | ~80% | 公司会仔细审核 / Company carefully reviews submissions |
| 中度 / Medium | ~60% | 大多数场景（推荐）/ Most scenarios (recommended) |
| 重度 / Heavy | ~40% | 公司只看交没交 / Company only checks if you submitted |

---

## 项目结构 / Project Structure

```
anti-distill/
├── SKILL.md                 # Skill 入口 / Skill entry point
├── prompts/
│   ├── classifier.md        # 内容分类器 / Content classifier
│   ├── diluter_work.md      # Work Skill 稀释策略 / Work Skill dilution strategy
│   ├── diluter_persona.md   # Persona 稀释策略 / Persona dilution strategy
│   └── diluter_general.md   # 通用文档稀释策略 / General document dilution strategy
├── README.md
├── INSTALL.md
└── examples/
    └── zhangsan_before_after.md
```

---

MIT License