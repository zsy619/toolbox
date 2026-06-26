# 主题系统

每本书可按分类选用预设主题，挂在 `<head>` 中 `design-system.css` 之后即可生效。

## 可用主题

| 主题文件 | 分类 | 配色 | 寓意 |
|---|---|---|---|
| `philosophy-indigo.css` | 哲学·思辨 | `#818CF8 → #6366F1 → #4F46E5` | 沉静深邃的智性 |
| `science-teal.css` | 科学·系统 | `#14B8A6 → #06B6D4 → #0EA5E9` | 理性探索的清澈 |
| `literature-rose.css` | 文学·小说 | `#F472B6 → #FB7185 → #E11D48` | 文字的温度与柔情 |
| `growth-amber.css` | 自我成长·效率 | `#FB923C → #F59E0B → #FBBF24` | 黎明初照的温暖 |
| `wealth-gold.css` | 财富·投资 | `#FDE047 → #FACC15 → #EAB308` | 价值沉淀的厚重 |
| `history-bronze.css` | 历史·文明 | `#C4B5FD → #A78BFA → #8B5CF6` | 时光打磨的铜器 |
| `leadership-vault.css` | 领导力·管理 | `#818CF8 → #4F46E5 → #312E81` | 决断与权威的沉静 |
| `orange-red-purple.css` | 商业·营销 | `#F59E0B → #EF4444 → #8B5CF6` | 商业热情的三维 |
| `blue-green-orange.css` | 战略·品牌 | `#0EA5E9 → #10B981 → #F59E0B` | 战略·市场·品牌 |
| `blue-green-purple.css` | 综合 | `#10B981 → #3B82F6 → #8B5CF6` | 通识均衡 |
| `blue-pink-purple.css` | 综合 | `#3B82F6 → #8B5CF6 → #EC4899` | 冷暖平衡 |
| `deep-blue.css` | 严肃 | `#1e3a5f → #2c5282` | 经典沉稳 |
| `neon.css` | 现代·科技 | `#6366f1 → #8b5cf6 → #06b6d4` | 赛博未来感 |

## 使用方法

在 HTML `<head>` 中（`design-system.css` 之后）添加：

```html
<link rel="stylesheet" href="assets/styles/themes/{theme-name}.css">
```

主题会覆盖以下 CSS 变量：
- `--brand-primary` — 主色
- `--brand-secondary` — 副色
- `--brand-accent` — 强调色
- `--brand-gradient` — 主渐变
- `--text-gradient` — 文字渐变
- `--progress-gradient` — 进度条渐变
- `--brand-shadow` — 主阴影

## 选用建议

| 分类 | 推荐主题 |
|---|---|
| 哲学 / 思辨 | `philosophy-indigo` |
| 科学 / 思维 | `science-teal` |
| 文学 / 小说 | `literature-rose` |
| 自我成长 / 效率 | `growth-amber` |
| 财富 / 投资 | `wealth-gold` |
| 历史 / 文明 | `history-bronze` |
| 领导力 / 管理 | `leadership-vault` |
| 商业 / 营销 | `orange-red-purple` |
