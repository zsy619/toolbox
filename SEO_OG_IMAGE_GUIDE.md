# OG图片生成指南

本文档提供为工具箱网站生成专用OG图片的详细指南。

## 📌 OG图片重要性

- **社交媒体分享**：微信、Twitter、Facebook等平台分享时显示的图片
- **搜索引擎优化**：提升网站在搜索结果中的展示效果
- **品牌一致性**：统一的视觉风格提升用户体验

## 📐 推荐尺寸

### 标准OG图片尺寸
- **Facebook/Twitter/LinkedIn**: 1200 × 630px (推荐)
- **微信分享**: 500 × 500px (正方形)
- **Favicon**: 32 × 32px, 16 × 16px

### 最小尺寸要求
- 最小 200 × 200px
- 最大 4096 × 4096px
- 文件大小 < 8MB

## 🎨 推荐工具

### 在线工具
1. **Canva** - canva.com (推荐)
2. **Figma** - figma.com
3. **Adobe Express** - express.adobe.com
4. **图怪兽** - 91sj.net

### AI生成工具
1. **Midjourney** - midjourney.com
2. **DALL-E** - openai.com/dall-e
3. **Stable Diffusion** - stablediffusionweb.com
4. **即梦AI** - jimeng.jikeai.com

## 📋 需要生成的图片列表

### 分类目录页 (每个分类1张)
| 分类 | 文件名 | 描述 |
|------|--------|------|
| 游戏 | games-og.png | 包含各种游戏图标 |
| AI工具 | ai-tools-og.png | AI/科技风格 |
| 实用工具 | utilities-og.png | 工具箱风格 |
| 图片处理 | image-processing-og.png | 图片/设计风格 |
| 布局工具 | layouts-og.png | Grid/布局展示 |
| 彩票工具 | lottery-og.png | 彩票/数据分析 |
| 生活工具 | life-og.png | 生活/家居风格 |
| 阅读学习 | reading-og.png | 书籍/学习风格 |
| 多媒体 | multimedia-og.png | 视频/音频风格 |
| 3D工具 | real3d-og.png | 3D/技术风格 |

### 重要工具页面 (每个工具1张)
```
需要生成专用OG图片的重要工具:
- apps/utilities/uuid.html → uuid-generator-og.png
- apps/utilities/random_generator.html → random-generator-og.png
- apps/utilities/compound_interest_calculator.html → calculator-og.png
- apps/image-processing/idphoto.html → idphoto-og.png
- apps/image-processing/image_merge.html → image-merge-og.png
- apps/layouts/四图一中布局.html → layout-og.png
- apps/layouts/八图布局.html → grid-8-og.png
- apps/ai-tools/ai_dream.html → ai-dream-og.png
- apps/ai-tools/ai_course.html → ai-course-og.png
```

## 🎯 设计建议

### 风格指南
1. **配色方案**：使用紫罗兰(#667eea)到深紫色(#764ba2)的渐变作为主色调
2. **字体**：使用无衬线字体，如 Inter、Noto Sans SC
3. **元素**：包含网站Logo、工具图标、文字标题

### 推荐布局
```
┌─────────────────────────────────────┐
│                                     │
│   [Logo]  工具名称                   │
│                                     │
│   简短描述文字...                    │
│                                     │
│   [图标1] [图标2] [图标3]            │
│                                     │
└─────────────────────────────────────┘
```

### 必含元素
- 网站Logo或名称
- 页面标题
- 简短描述（可选）
- 分类图标（可选）

## 🔧 使用方法

### 1. 保存位置
所有OG图片应保存到:
```
/Volumes/E/JYW/创意项目/工具箱/assets/images/
```

### 2. 引用方式
在HTML中使用:
```html
<meta property="og:image" content="https://tools.yy24365.com/assets/images/xxx-og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

### 3. 验证工具
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **Google**: https://search.google.com/search-console

## 📅 批量生成建议

### 方法一：使用Canva批量创建
1. 创建一个主模板（1200×630px）
2. 使用Canva的"批量创建"功能
3. 导入CSV数据（包含文件名、标题、描述）
4. 导出所有变体

### 方法二：使用AI工具生成
1. 准备提示词模板
2. 使用Midjourney/DALL-E生成基础图片
3. 使用Canva添加文字
4. 批量导出

### 方法三：使用脚本生成
```bash
# 安装依赖
npm install -g @aspect-build/pnpm

# 使用sharp等工具批量处理
```

## ✅ 检查清单

在生成完所有OG图片后，请确认：

- [ ] 所有分类目录都有对应的OG图片
- [ ] 主要工具页面有专用OG图片
- [ ] 图片尺寸符合要求（1200×630px）
- [ ] 文件大小 < 8MB
- [ ] 所有HTML文件已更新图片路径
- [ ] 已使用验证工具测试

## 📞 技术支持

如需帮助，请参考：
- [Google搜索中心](https://developers.google.com/search/docs/advanced/crawling/sitemap-indexes)
- [Facebook开发者文档](https://developers.facebook.com/docs/sharing/webmasters/)
- [Twitter开发者文档](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
