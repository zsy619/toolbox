# apps/reading 设计规范（唯一规则）

> 本目录所有 HTML 文件的**唯一生成规则**。
> 自 v1.2.0（design-system）起强制生效。

---

## 1. 必须引用的资源（head 区域）

```html
<!-- 统一字体：本地 Noto Sans SC（禁止使用 googleapis） -->
<link href="assets/fonts/noto-sans-sc.css" rel="stylesheet">

<!-- 统一设计系统：design-system.css -->
<link href="assets/styles/design-system.css" rel="stylesheet">
```

## 2. 必须引入的脚本（body 结束前）

```html
<!-- 统一站点脚本 -->
<script src="assets/scripts/site.js"></script>
</body>
```

## 3. 禁止引用的资源

- ❌ `fonts.googleapis.com`（海外字体 CDN）
- ❌ `fonts.gstatic.com`（海外字体静态资源）
- ❌ 任何 Google Fonts 海外 CDN

## 4. 推荐引用（按需选择）

```html
<!-- Tailwind 国内 CDN（推荐） -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- 主题样式（B-F 分组） -->
<link href="assets/styles/themes/{主题名}.css" rel="stylesheet">
```

## 5. 主题分组（B-F）

| 分组 | 主题文件 | 适用场景 |
|------|----------|----------|
| B | `blue-green-purple.css` | 蓝绿紫渐变 |
| C | `blue-pink-purple.css` | 蓝粉紫 |
| D | `deep-blue.css` | 深蓝专业 |
| E | `neon.css` | 霓虹赛博 |
| F | `orange-red-purple.css` | 橙红紫 |

## 6. 基础 HTML 模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>页面标题</title>
  <meta name="description" content="页面描述">

  <!-- 统一字体 -->
  <link href="assets/fonts/noto-sans-sc.css" rel="stylesheet">
  <!-- 统一设计系统 -->
  <link href="assets/styles/design-system.css" rel="stylesheet">

  <!-- Tailwind（按需） -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- 主题（按需） -->
  <!-- <link href="assets/styles/themes/deep-blue.css" rel="stylesheet"> -->
</head>
<body>
  <!-- 页面内容 -->

  <!-- 统一站点脚本 -->
  <script src="assets/scripts/site.js"></script>
</body>
</html>
```

## 7. 多端适配要求

- ✅ `viewport-fit=cover`（刘海屏适配）
- ✅ 响应式断点：768px（平板）、480px（手机）
- ✅ 触摸目标 ≥ 44×44px
- ✅ 正文 ≥ 16px

## 8. 无障碍（A11y）要求

- ✅ 所有图片有 `alt` 属性
- ✅ 语义化标签：`<header>`、`<main>`、`<nav>`、`<footer>`、`<article>`
- ✅ 色彩对比度 ≥ WCAG AA（4.5:1）
- ✅ 键盘可导航（`focus-visible`）

## 9. SEO 优化要求

- ✅ `<title>` 唯一、不超过 60 字
- ✅ `<meta name="description">` 100-160 字
- ✅ `og:` / `twitter:` 卡片标签
- ✅ JSON-LD 结构化数据（Article/Book）
- ✅ Canonical URL
- ✅ Hreflang（可选）

## 10. 自我校验机制

每次新增或修改 HTML 后，**必须**运行：

```bash
python3 validate.py
```

校验通过标准：所有文件 `通过文件: 25/25`，无 `总问题数`。

## 11. 文件命名规范

- ✅ 中文文件名（如：`从超级个体到超级团队.html`）允许
- ✅ 英文文件名（如：`super-individual-team.html`）允许
- ✅ 中英混合：`founders-playbook.html`
- ❌ 避免空格、特殊字符

## 12. 目录结构

```
apps/reading/
├── assets/
│   ├── fonts/          # 本地字体
│   ├── scripts/        # 统一脚本
│   └── styles/
│       ├── design-system.css    # 核心设计系统
│       └── themes/    # 主题分组
├── *.html             # 内容页面
├── index.html         # 目录页
└── validate.py        # 自我校验脚本
```

---

## 版本历史

- **v1.2.0**（当前）：提取 super-individual-team.html 模板独有样式，强制统一资源引用
- **v1.1.0**：添加 CSS 变量回退值，移除重复类，添加 B-F 分组主题机制
- **v1.0.0**：初始版本

## 相关文档

- [01-html-optimize.md](file:///Users/zhushuyan/AISkills/prompts/01-html-optimize.md)：HTML 优化 7 阶段工作流
- [design-system.css](file:///Volumes/E/JYW/创意项目/工具箱/apps/reading/assets/styles/design-system.css)：设计系统源码
- [validate.py](file:///Volumes/E/JYW/创意项目/工具箱/apps/reading/validate.py)：自我校验脚本

---

**规则变更流程**：修改本 README 后，必须同步更新 `validate.py` 中的检查规则，确保规范与校验脚本保持一致。