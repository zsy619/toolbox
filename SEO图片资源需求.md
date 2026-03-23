# SEO 图片资源需求文档

## 📸 需要创建的 OG 图片（社交媒体分享图片）

### 标准尺寸
- **推荐尺寸**: 1200 x 630 像素
- **最小尺寸**: 600 x 315 像素
- **文件格式**: PNG、JPG 或 WebP
- **文件大小**: 建议小于 1MB

### 图片命名规范
使用 kebab-case（短横线命名法），便于SEO

---

## 🎯 彩票工具类（lottery）

### 必须创建
1. **lottery-tools.png** - 彩票工具首页
   - 尺寸: 1200x630px
   - 内容: 展示所有彩票工具的合集图片
   - 建议风格: 专业、现代、科技感

2. **lottery-3d.png** - 3D彩票选号工具
   - 尺寸: 1200x630px
   - 内容: 3D彩票相关的图片
   - 建议风格: 简洁大方

3. **lottery-dlt.png** - 大乐透选号工具
   - 尺寸: 1200x630px
   - 内容: 大乐透相关的图片
   - 建议风格: 专业彩票风格

4. **lottery-doubleball.png** - 双色球号码生成器
   - 尺寸: 1200x630px
   - 内容: 双色球相关的图片
   - 建议风格: 红色主题

5. **lottery-happy8.png** - 快乐8号码生成器
   - 尺寸: 1200x630px
   - 内容: 快乐8相关的图片
   - 建议风格: 活泼多彩

6. **lottery-pl3.png** - 排列3智能选号
   - 尺寸: 1200x630px
   - 内容: 排列3相关的图片
   - 建议风格: 简洁

7. **lottery-pl5.png** - 排列5智能选号
   - 尺寸: 1200x630px
   - 内容: 排列5相关的图片
   - 建议风格: 简洁

8. **lottery-qlc.png** - 七乐彩智能选号
   - 尺寸: 1200x630px
   - 内容: 七乐彩相关的图片
   - 建议风格: 喜庆

---

## 🏠 生活工具类（life）

### 必须创建
1. **life-og.png** - 生活工具首页
   - 尺寸: 1200x630px
   - 内容: 生活类工具展示
   - 建议风格: 温馨生活化

2. **dream-og.png** - 梦境解析工具
   - 尺寸: 1200x630px
   - 内容: 梦境、星空、月亮等元素
   - 建议风格: 神秘梦幻

3. **spring-festival-og.png** - 春节待客指南
   - 尺寸: 1200x630px
   - 内容: 春节、红包、灯笼等元素
   - 建议风格: 喜庆中国风

4. **shoulder-health-og.png** - 肩周炎与筋膜枪指南
   - 尺寸: 1200x630px
   - 内容: 健康、肩颈等元素
   - 建议风格: 专业健康

5. **dev-tools-og.png** - 转账明细管理（已有）
   - 尺寸: 1200x630px
   - 备注: 可复用或优化

---

## 🎨 通用占位图

如果暂时无法创建专用图片，可以使用以下方式：

### 1. 生成渐变占位图
创建简单的渐变图片，使用品牌色：
```
主色: #667eea (蓝紫色)
辅色: #764ba2 (深紫色)
```

### 2. 使用在线工具生成
- **Canva**: https://www.canva.com/
- **Figma**: https://www.figma.com/
- **Snappa**: https://snappa.com/

### 3. 代码生成渐变图
创建一个简单的 HTML 文件生成渐变图：

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; }
        .og-image {
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <div class="og-image">
        工具箱 - Lottery Tools
    </div>
</body>
</html>
```

---

## 📁 图片存放位置

建议将所有 OG 图片存放在：
```
/assets/images/
```

并在 HTML 中引用：
```html
<meta property="og:image" content="https://tools.yy24365.com/assets/images/lottery-3d.png">
```

---

## ✅ SEO 图片优化建议

### 1. 文件命名
- ✅ 使用描述性文件名
- ✅ 使用小写字母
- ✅ 使用短横线分隔
- ❌ 避免使用中文文件名

### 2. 图片压缩
- 使用 TinyPNG 压缩: https://tinypng.com/
- 使用 ImageOptim (Mac): https://imageoptim.com/
- 目标文件大小: < 200KB

### 3. Alt 标签
确保所有图片都有描述性的 alt 属性：
```html
<img src="lottery-3d.png"
     alt="3D彩票智能选号工具 - 免费在线随机生成3D彩票号码"
     width="1200"
     height="630">
```

### 4. 图片格式
- 优先使用 WebP 格式
- 次选 PNG 格式
- 避免使用 BMP 或 TIFF

---

## 🎯 优先级建议

### 高优先级（立即创建）
1. ✅ lottery-tools.png - 首页展示
2. ✅ lottery-3d.png
3. ✅ lottery-dlt.png
4. ✅ lottery-doubleball.png
5. ✅ life-og.png

### 中优先级（尽快创建）
6. lottery-happy8.png
7. lottery-pl3.png
8. lottery-pl5.png
9. lottery-qlc.png
10. dream-og.png

### 低优先级（可以稍后创建）
11. spring-festival-og.png
12. shoulder-health-og.png

---

## 📅 创建时间表建议

**第1周（高优先级）**
- 制作5张核心工具图片
- 压缩并优化图片
- 更新 HTML 中的 og:image 引用

**第2周（中优先级）**
- 制作剩余5张工具图片
- 制作生活工具类图片

**第3周（低优先级）**
- 完成剩余图片
- 全面测试分享效果
- 根据实际效果调整

---

## 🛠️ 推荐工具

### 在线设计工具
1. **Canva** - 最简单的在线设计工具
   - https://www.canva.com/
   - 提供大量模板
   - 支持团队协作

2. **Figma** - 专业设计工具
   - https://www.figma.com/
   - 适合团队协作
   - 强大的设计功能

3. **Adobe Express** - Adobe出品
   - https://www.adobe.com/express/
   - 快速创建社交图片
   - 免费使用

### 图片压缩工具
1. **TinyPNG** - 在线压缩
   - https://tinypng.com/
   - 支持PNG和JPG
   - 压缩率高

2. **Squoosh** - Google出品
   - https://squoosh.app/
   - 支持多种格式
   - 可调整压缩质量

3. **ImageOptim** - Mac专用
   - https://imageoptim.com/
   - 无损压缩
   - 支持批量处理

---

## 📝 注意事项

1. **版权问题**
   - 使用原创图片或免费图片
   - 避免使用有版权的素材
   - 推荐使用 CC0 授权图片

2. **品牌一致性**
   - 保持视觉风格统一
   - 使用统一的配色方案
   - 添加网站 Logo

3. **测试验证**
   - 使用 Facebook Sharing Debugger 测试
     https://developers.facebook.com/tools/debug/
   - 使用 Twitter Card Validator 验证
     https://cards-dev.twitter.com/validator
   - 使用百度分享测试工具

4. **性能优化**
   - 图片文件越小越好
   - 使用 CDN 加速
   - 添加图片缓存

---

## 🎉 完成检查清单

- [ ] 创建所有必需的 OG 图片
- [ ] 压缩所有图片（< 200KB）
- [ ] 更新 HTML 中的 og:image 引用
- [ ] 测试所有社交平台分享效果
- [ ] 验证图片在移动端的显示
- [ ] 优化图片加载速度
