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
    └── design-system.css       (新建)
```

### CSS 变量定义

```css
:root {
  /* 品牌主色 - 统一使用紫色系 */
  --brand-primary: #667eea;
  --brand-secondary: #764ba2;
  --brand-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

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
  --font-sans: 'Noto Sans SC', system-ui, -apple-system, sans-serif;
  --font-serif: 'Noto Serif SC', serif;
}
```

### 统一组件类

| 组件 | 统一类名 | 样式 |
|------|----------|------|
| 文字渐变 | `.text-gradient` | 使用 `--text-gradient` |
| 品牌渐变背景 | `.bg-gradient-brand` | 使用 `--brand-gradient` |
| 卡片悬浮 | `.card-hover` | 统一定义 |
| 阅读进度条 | `.reading-progress` | 统一定义 |
| 渐入动画 | `.fade-in-up` | 统一定义 |

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

### Phase 1: 建立设计系统文件
1. 创建 `assets/styles/design-system.css`
2. 定义所有 CSS 变量
3. 迁移共有组件样式

### Phase 2: 统一 A 组页面（优先级最高）
- 更新 `<link>` 引用 design-system.css
- 替换内联样式中的硬编码颜色
- 验证页面渲染一致

### Phase 3: 统一 B-F 组页面
- 根据分组逐批迁移
- 特殊配色作为主题变量保留

## 架构图

```
                    ┌─────────────────────────────────┐
                    │   assets/styles/design-system.css │
                    │   (CSS Variables + Base Styles)   │
                    └────────────────┬────────────────┘
                                     │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
    ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
    │  A 组页面    │          │  B-F 组页面  │          │   index.html │
    │  (紫色系)    │          │  (特殊配色)  │          │              │
    └──────────────┘          └──────────────┘          └──────────────┘
```

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 迁移过程中页面样式破坏 | 高 | 每次只修改一个文件，充分测试 |
| 特殊配色页面（如 meditations）失去特色 | 中 | 通过 CSS 变量保留主题灵活性 |
| 大量文件需要手动验证 | 中 | 使用自动化截图工具对比 |

## 非目标（NOT in scope）

- 修改页面内容结构
- 添加新功能或交互
- 创建 JavaScript 组件
- 修改其他 apps/ 目录下的页面
