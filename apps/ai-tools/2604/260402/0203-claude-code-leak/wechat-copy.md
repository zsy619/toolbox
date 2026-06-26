---
title: Claude Code 源码泄露深度分析：52万行代码暴露了什么？
summary: Anthropic 一次发布失误，Claude Code 约1900个TypeScript文件、52万行代码暴露。源码揭示用户数据收集、远程控制、防蒸馏机制等不为人知的秘密。
author: 科技内参
date: 2026-04-02
---

# Claude Code 源码泄露深度分析：52万行代码暴露了什么？

## 事件回顾

这周，Anthropic 因一次发布失误，把 Claude Code 的大部分核心源码直接暴露在了网上。

**泄露规模**：
- 约 1900 个 TypeScript 文件
- 总计约 52 万行代码
- 包含一整套内置命令以及各种内置工具

**GitHub 镜像**：
- 10.5 万 star
- 9.5 万 fork

而 Anthropic 官方 Claude Code 仓库仅有 9.5 万 star。

## 三次泄露时间线

| 时间 | 事件 |
|------|------|
| 2025年2月 | 首次泄露，23MB的cli.mjs文件包含内联source map |
| 2026年3月7日 | SDK包中包含完整CLI打包文件 |
| 2026年3月31日 | 59.8MB独立source map全面暴露 |

## 代码暴露的惊天秘密

### 1. 用户文件会被保存上传

研究员 Antlers 强调："Claude 查看的每个文件都会被保存并上传至 Anthropic。"

- Free/Pro/Max 用户：同意训练则保留5年，否则30天
- 商业用户：标准30天保留期

### 2. 远程管理设置

Anthropic 维护的专用服务器会推送 policySettings，可以：
- 覆盖合并链中的其他项
- 每小时轮询一次，无需用户交互
- 设置 .env 变量（ANTHROPIC_BASE_URL、LD_PRELOAD 等）
- 通过热重载立即生效

### 3. 防蒸馏机制形同虚设

代码中包含两套反蒸馏机制，但都可以轻易绕过：
- **假工具注入**：只需MITM删除anti_distillation字段即可失效
- **摘要替换**：仅对Anthropic内部用户开放

### 4. 每天浪费25万次API调用

```typescript
// BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures
// wasting ~250K API calls/day globally.
```

### 5. 员工参与开源要隐藏AI身份

代码中的 Undercover Mode 会：
- 识别 USER_TYPE === 'ant' 员工身份
- 防止在 commit 和 PR 里泄露 Anthropic 内部信息
- 隐藏自己是 AI 的身份

## 泄露原因

Anthropic 工程师 Boris Cherny 澄清：这件事就是一次开发失误，本质上是流程、文化或基础设施问题。

## 版权争议

技术律师 Russ Pearlman 指出：

> "按照当前美国版权法，作品必须具备实质性的人类创作才能获得保护……竞争对手如果研究这些泄露的代码，可能面对的是在法律意义上并不受保护的内容。"

> "最讽刺的是，这个世界上最先进的 AI 编码工具，可能正是靠自己，把自己的知识产权'写没了'。"

## 写在最后

Claude Code 代码实际上已经在网上公开 13 个月了。过去 13 个月里，这套代码被反复扒出、镜像、逆向、整理，直到这一次才真正引爆舆论。

**代码一旦流出去，就很难再收回来了。**

---

**关注我，了解更多科技内幕** 🚀

**原文链接**: https://www.toutiao.com/w/