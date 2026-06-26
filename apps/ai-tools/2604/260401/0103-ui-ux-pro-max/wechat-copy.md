---
title: "程序员审美"救星！让Claude Code写出专业设计的前端"
summary: AI写前端，功能没问题，但界面总是不忍直视？配色灰蒙蒙、排版随手摆、字体永远是默认sans-serif...装了这个Skill，AI秒变专业设计师。
author: AI助手
date: 2026-04-01
---

# "程序员审美"救星！让Claude Code写出专业设计的前端

## 开头

用AI写前端代码，功能实现没问题，但出来的界面……

配色要么灰蒙蒙一片，要么AI最爱的紫粉渐变；排版像是把组件往页面上随手一摆；字体永远是默认的sans-serif。

不是AI写不了前端，是它缺一套专业的设计直觉。

## 引出问题

AI知道怎么写CSS，但不知道什么场景该用什么风格。

这个问题怎么解？

## 解决方案

最近用到有个叫 UI UX Pro Max 的项目，做的事情很直接：

给AI编程助手装一套设计系统的"知识库"。

装完之后说一句"帮我做个SaaS的落地页"，它会先根据产品类型自动推理应该用什么设计风格、配什么颜色、选什么字体、页面怎么排，然后再动手写代码。

## 它到底做了什么

传统流程是自己去Dribbble找参考、去Coolors配色、去Google Fonts选字体，然后告诉AI"按这个来"。

UI UX Pro Max把这些设计决策全自动化了，内置了一套推理引擎：

- **161条行业推理规则** - 从SaaS、金融科技、医疗健康到电商、餐饮、游戏，每个行业该用什么设计模式、该避免什么坑

- **67种UI风格** - Glassmorphism、Brutalism、Neumorphism、Bento Grid、Cyberpunk、AI-Native UI……不是让你自己选，是它根据产品类型自动匹配

- **161套配色方案** - 跟161个行业分类一一对应

- **57组字体搭配** - 标题字体+正文字体的组合，带Google Fonts链接

- **99条UX规范** - 可访问性、反模式检查、响应式断点

- **25种图表类型推荐** - 做Dashboard的时候用

## 实际跑起来是什么效果

在Claude Code里说：帮我做一个美容SPA的落地页

它不会直接开始写代码，而是先跑5路并行搜索：产品类型匹配→风格推荐→配色选择→落地页模式→字体搭配。

输出一份完整的设计系统方案：

- 页面模式： Hero-Centric + Social Proof（情感驱动+信任元素）

- UI风格： Soft UI Evolution（柔和阴影、有机形状、高级感）

- 配色： 柔粉 #E8B4B8 + 鼠尾草绿 #A8D5BA + 金色CTA #D4AF37

- 字体： Cormorant Garamond（标题）+ Montserrat（正文）

- 要避免的： 霓虹色、生硬动画、深色模式、AI紫粉渐变

然后才开始写代码，而且写出来的代码已经带上了正确的颜色、字体、间距和交互效果。

## 安装方式

支持主流AI编程工具：

Claude Code（推荐，支持最完整）：
```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

其他工具用CLI：
```
npm install -g uipro-cli
uipro init --ai cursor      # Cursor
uipro init --ai windsurf    # Windsurf
uipro init --ai codex       # Codex CLI
uipro init --ai copilot     # GitHub Copilot
uipro init --ai gemini       # Gemini CLI
uipro init --ai all         # 全部安装
```

## 反模式检查是个亮点

每个行业的推理规则里都有一项"Anti-Patterns"，专门列了该行业不该做什么。

比如银行类产品不该用"AI紫粉渐变"，儿童教育类不该用深色模式，企业级SaaS不该用夸张的动画。

这个很实用，AI写前端最容易犯的错误不是功能写不出来，而是审美踩雷。

配色太花、动画太浮夸、风格跟产品调性不搭，这些问题有了反模式规则之后能避免大半。

## 支持13种技术栈

不只是Web，移动端也覆盖了：

- Web： HTML + Tailwind（默认）、React、Next.js、Vue、Nuxt.js、Svelte、Astro、shadcn/ui

- iOS： SwiftUI

- Android： Jetpack Compose

- 跨平台： React Native、Flutter

在prompt里提一句用什么技术栈就行，它会给出对应的代码规范，不提的话默认用HTML + Tailwind。

## 写在最后

AI写代码的能力已经很强了，但"好看"这件事一直是短板。

根本原因是AI缺少设计领域的结构化知识，它知道怎么写CSS，但不知道什么场景该用什么风格。

UI UX Pro Max的做法是把设计师脑子里的经验变成规则，塞进AI的上下文里。161个行业、67种风格、161套配色，听起来是堆数据，但这些数据组合起来就是一个能自动出方案的设计系统。

下次用AI写前端的时候，先装上这个试试。至少配色不会再是AI最爱的紫粉渐变了。

## 原文链接
https://x.com/sitinme/status/2039156523751117146
