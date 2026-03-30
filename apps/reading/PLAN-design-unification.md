# 阅读页面设计系统统一计划

## 问题陈述

当前 `apps/reading` 目录下的 20+ HTML 页面存在严重的设计不一致问题：

| 问题 | 详情 |
|------|------|
| **配色方案混乱** | 6 种不同的品牌渐变色方案 |
| **字体加载不一** | 部分页面加载 Noto Sans SC，部分使用系统字体 |
| **OG 图片混乱** | 部分使用 dev-tools-og.png（错误），部分使用 reading-og.png，部分 AI 生成 |
| **组件样式各异** | card-hover、text-gradient 等类名相似但实现略有不同 |

## 设计系统方案

### 目标：建立统一的 CSS 设计令牌

```
assets/
├── fonts/
│   └── noto-sans-sc.css        (已有)
└── styles/
    ├── design-system.css       (已建立 v1.1.0)
    └── themes/
        ├── deep-blue.css        (B组: meditations)
        ├── blue-pink-purple.css (C组: power-vs-force, yinianli)
        ├── blue-green-purple.css (D组: liangyu)
        ├── orange-red-purple.css (E组: dangxiadeliliang, openclaw-wechat)
        └── neon.css             (F组: ai-service-value-map)
```

### CSS 变量定义 (v1.1.0，带回退值)

```css
:root {
  /* 品牌主色 - 默认紫色系，可被主题CSS覆盖 */
  --brand-primary: #667eea;
  --brand-secondary: #764ba2;
  --brand-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 回退值: background: var(--brand-gradient, linear-gradient(...)); */

  /* 文字渐变 */
  --text-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* 进度条 */
  --progress-gradient: linear-gradient(90deg, #667eea, #764ba2);

  /* 辅助色 - 保持语义化命名 */
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
  --color-danger: #ef4444;
  --color-success: #10b981;

  /* 字体 */
  --font-sans: 'Noto Sans SC', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: 'Noto Serif SC', Georgia, serif;
}
```

### 统一组件类

| 组件 | 统一类名 | 样式 |
|------|----------|------|
| 文字渐变 | `.text-gradient` | 使用 `--text-gradient` + 回退值 |
| 品牌渐变背景 | `.bg-gradient-brand` | 使用 `--brand-gradient` + 回退值 |
| 卡片悬浮 | `.card-hover` | 统一定义，transition + shadow |
| 阅读进度条 | `.reading-progress` | 统一定义，fixed定位 |
| 渐入动画 | `.fade-in-up` | 统一定义 |
| 徽章 | `.category-badge` | 品牌渐变背景 |
| 等级徽章 | `.level-badge` | 使用 `--color-success` |

### 主题机制

通过 CSS 层叠覆盖机制，B-F 组页面引用对应主题 CSS 文件即可覆盖默认变量：

```html
<!-- 基础设计系统 -->
<link href="assets/styles/design-system.css" rel="stylesheet">
<!-- B组深蓝主题 -->
<link href="assets/styles/themes/deep-blue.css" rel="stylesheet">
```

## 实施范围

### 页面分组（按配色方案）

| 分组 | 页面 | 颜色 | 优先级 |
|------|------|------|--------|
| **A - 紫色系** | index, 7-habits, principles, perfect-consulting, competitive-strategy, five-love-languages, dan-koe, learning-beauty, marketing-management, amazon-reverse, 超越百岁, 心智重构 | `#667eea → #764ba2` | P1 |
| **B - 深蓝** | meditations | `#1e3a5f → #2c5282` | P2 |
| **C - 蓝粉紫** | power-vs-force, yinianli | `#3B82F6 → #8B5CF6 → #EC4899` | P2 |
| **D - 蓝绿紫** | liangyu | `#10B981 → #3B82F6 → #8B5CF6` | P2 |
| **E - 橙红紫** | dangxiadeliliang, openclaw-wechat | `#F59E0B → #EF4444 → #8B5CF6` | P2 |
| **F - 霓虹** | ai-service-value-map | `#6366f1 → #8b5cf6 → #06b6d4` | P3 |

## 迁移步骤

### Phase 1: 建立设计系统文件 ✅ 完成 (v1.1.0)
1. ✅ 创建 `assets/styles/design-system.css`
2. ✅ 定义所有 CSS 变量 + 回退值
3. ✅ 迁移共有组件样式
4. ✅ 修复全局字体选择器 (`*` → `body`)
5. ✅ 移除重复类 (`.bg-gradient-hero`, `.bg-gradient-custom`)
6. ✅ 创建 B-F 组主题文件

### Phase 2: 统一 A 组页面 ✅ 完成
- ✅ 所有 A 组文件已引用 design-system.css
- ✅ A 组页面使用统一紫色系品牌色
- ⚠️ 内联 `<style>` 块保留（包含页面临时样式，可选清理）

### Phase 3: 统一 B-F 组页面 ✅ 完成
- ✅ meditations.html → deep-blue.css
- ✅ power-vs-force.html, yinianli.html → blue-pink-purple.css
- ✅ liangyu.html → blue-green-purple.css
- ✅ dangxiadeliliang.html, openclaw-wechat.html → orange-red-purple.css
- ✅ ai-service-value-map.html → neon.css
- ⚠️ 内联 `<style>` 块保留（包含页面临界特定颜色，可选清理）

### 验证脚本
```bash
# 检查所有HTML文件是否引用了design-system.css
grep -l "design-system.css" *.html | wc -l
# 应该输出: 20+

# 检查B-F组页面是否引用了主题CSS
grep -l "themes/" meditations.html power-vs-force.html yinianli.html liangyu.html dangxiadeliliang.html openclaw-wechat.html ai-service-value-map.html
```

## 架构图

```
                    ┌─────────────────────────────────┐
                    │   assets/styles/design-system.css │
                    │   (CSS Variables + Base Styles)   │
                    │   v1.1.0 + 回退值                  │
                    └────────────────┬────────────────┘
                                     │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
    ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
    │  A 组页面    │          │  B-F 组页面  │          │   index.html │
    │  (紫色系)    │          │  (特殊配色)  │          │              │
    │  默认变量    │          │  + 主题CSS   │          │              │
    └──────────────┘          └──────────────┘          └──────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
             deep-blue.css    blue-pink-purple.css   neon.css
             (冥想)           (力量/意念)           (AI服务)
```

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 迁移过程中页面样式破坏 | 高 | ✅ CSS变量带回退值，失败时显示合理回退 |
| 特殊配色页面失去特色 | 中 | ✅ 主题CSS机制保留各组特色 |
| 大量文件需要手动验证 | 中 | ✅ 添加验证脚本检查链接正确性 |
| 部分迁移导致不一致 | 中 | ✅ 主题CSS最后加载，覆盖基础变量 |

## 非目标（NOT in scope）

- 修改页面内容结构
- 添加新功能或交互
- 创建 JavaScript 组件
- 修改其他 apps/ 目录下的页面
