# 工具箱项目 Code Wiki

## 目录

1. [项目概述](#1-项目概述)
2. [项目架构](#2-项目架构)
3. [核心模块详解](#3-核心模块详解)
4. [关键脚本工具](#4-关键脚本工具)
5. [静态资源结构](#5-静态资源结构)
6. [技术栈与依赖](#6-技术栈与依赖)
7. [运行方式](#7-运行方式)
8. [开发规范](#8-开发规范)
9. [SEO与分享优化](#9-seo与分享优化)

---

## 1. 项目概述

### 1.1 项目简介

**工具箱项目**是一个综合性的在线工具集合网站，托管于 `https://tools.yy24365.com`，包含彩票工具、图像处理、实用工具、游戏集合、AI工具等多个类别的Web应用。

### 1.2 项目统计

| 指标 | 数值 |
|------|------|
| 总HTML文件数 | 124+ |
| 主要工具类别 | 11类 |
| 游戏数量 | 100+ |
| 文档数量 | 30+ |

### 1.3 技术特点

- **零后端依赖**: 纯前端静态站点，可部署在任何静态服务器
- **响应式设计**: 使用Tailwind CSS实现多端适配
- **SEO优化**: 完整的Meta标签、Open Graph、Twitter Card支持
- **微信分享优化**: 支持微信JSSDK配置和分享卡片自定义

---

## 2. 项目架构

### 2.1 目录结构

```
工具箱/
├── apps/                      # 应用程序模块集合
│   ├── academic_test_data/    # 学术测试数据页面
│   ├── ai-tools/              # AI工具集合（含视频创作工具）
│   ├── claude-code/           # Claude Code相关
│   ├── courses/               # 课程应用（React/Vite项目）
│   │   └── 一元二次函数/      # 数学课程应用
│   ├── games/                 # 游戏集合（100+款HTML5游戏）
│   ├── image-processing/       # 图像处理工具集
│   ├── layouts/               # 布局工具
│   ├── life/                  # 生活工具（解梦等）
│   ├── lottery/               # 彩票工具集
│   ├── multimedia/            # 多媒体工具（HLS、WebSocket流）
│   ├── reading/               # 阅读笔记集合
│   ├── real3d/                # 3D相关工具
│   ├── runs/                  # 运行记录
│   ├── spa/                   # 单页应用入口
│   ├── tests/                 # 测试页面
│   ├── trae/                  # Trae IDE相关
│   ├── utilities/             # 实用工具集
│   ├── wealth-truth-chen/     # 课程内容
│   ├── yitang/                # 内容网站
│   └── index.html             # apps导航页
│
├── assets/                    # 静态资源
│   ├── css/                   # 样式文件
│   │   ├── cropper.min.css    # 图片裁剪库
│   │   ├── design-system.css  # 设计系统
│   │   ├── fontawesome.min.css # 图标库
│   │   ├── highlight-dark.min.css # 代码高亮（深色）
│   │   ├── highlight.min.css  # 代码高亮
│   │   ├── layui.min.css      # UI框架
│   │   └── style.css          # 全局样式
│   ├── js/                    # JavaScript文件
│   │   ├── vendor/            # 第三方库
│   │   │   ├── chart.min.js   # 图表库
│   │   │   ├── cropper.min.js # 图片裁剪
│   │   │   ├── filesaver.min.js # 文件保存
│   │   │   ├── hls.min.js     # HLS视频流
│   │   │   ├── interact.min.js # 交互库
│   │   │   ├── jszip.min.js   # ZIP压缩
│   │   │   └── sortable.min.js # 拖拽排序
│   │   ├── layui.min.js       # UI框架
│   │   └── lucide.min.js      # 图标库
│   └── images/                # 图片资源
│
├── scripts/                    # 构建和维护脚本
│   ├── generate-index-pages.py # 索引页生成器
│   ├── generate-apps-index.py  # apps索引生成
│   ├── enhance-index-pages.py  # 索引页增强
│   ├── game_validator.py      # 游戏验证工具
│   ├── css_js_separator.py    # CSS/JS分离工具
│   ├── cleanup_backups.py     # 备份清理工具
│   └── normalize-js.sh        # JS规范化脚本
│
├── docs/                       # 项目文档
│   ├── guides/                 # 开发指南
│   ├── image-guides/           # 图像处理指南
│   ├── logs/                   # 开发日志
│   ├── page-docs/              # 页面文档
│   └── reports/                # 报告文档
│
├── config/                     # 配置文件
│   ├── BingSiteAuth.xml        # Bing站长验证
│   ├── robots.txt             # 爬虫规则
│   ├── sitemap.xml            # 网站地图
│   └── sogousiteverification.txt # 搜狗验证
│
├── index.html                  # 项目主入口
├── README.md                   # 项目说明
└── CODE_WIKI.md               # 本文档
```

### 2.2 模块分类

| 模块名称 | 功能描述 | 文件类型 | 数量 |
|----------|----------|----------|------|
| `utilities/` | 实用工具（计算器、生成器等） | HTML | 7 |
| `lottery/` | 彩票工具（双色球、大乐透等） | HTML | 9 |
| `image-processing/` | 图像处理（证件照、图片编辑） | HTML | 7 |
| `games/` | 游戏集合 | HTML/CSS/JS | 100+ |
| `ai-tools/` | AI工具集 | HTML/MD | 60+ |
| `multimedia/` | 多媒体工具 | HTML | 4 |
| `reading/` | 读书笔记 | HTML | 20+ |

---

## 3. 核心模块详解

### 3.1 实用工具模块 (`apps/utilities/`)

#### 模块职责
提供日常实用的在线工具，包括金额转换、随机数生成、UUID生成等。

#### 包含工具

| 文件名 | 功能描述 | 核心特性 |
|--------|----------|----------|
| `money.html` | 数字转大写金额 | 多语言实现代码展示 |
| `random_generator.html` | 随机字符生成 | 自定义字符集 |
| `uuid.html` | UUID生成器 | 批量生成 |
| `schedule.html` | 班次管理系统 | 任务项管理 |
| `no-sequence.html` | 连续数字生成 | 序列生成 |
| `compound_interest_calculator.html` | 复利计算器 | 金融计算 |

#### 关键技术点

```javascript
// money.html 中的核心转换函数
function toChineseAmount(n) {
  if (isNaN(n) || n > 999999999999.99) return "无效金额";
  
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  // ... 转换逻辑
}
```

#### 设计模式
- **卡片式布局**: 使用Grid布局展示工具列表
- **实时转换**: 启用事件监听实现即时反馈
- **代码高亮**: 使用highlight.js展示多语言实现

### 3.2 彩票工具模块 (`apps/lottery/`)

#### 模块职责
提供各类彩票号码生成和管理功能。

#### 包含工具

| 文件名 | 彩票类型 | 规则说明 |
|--------|----------|----------|
| `double_ball.html` | 双色球 | 红球33选6 + 蓝球16选1 |
| `dlt_smart.html` | 大乐透 | 前区35选5 + 后区12选2 |
| `3d_smart.html` | 3D彩票 | 三位数生成 |
| `pl3_smart.html` | 排列三 | 三位数组选/直选 |
| `pl5_smart.html` | 排列五 | 五位数生成 |
| `qlc_smart.html` | 七乐彩 | 30选7 |
| `happy8.html` | 快乐8 | 80选20 |

#### 核心功能
- **随机号码生成**: Fisher-Yates洗牌算法
- **历史记录**: LocalStorage持久化存储
- **主题切换**: 8种预设配色方案
- **批量生成**: 支持一次生成多组号码

```javascript
// 双色球号码生成核心逻辑
function generateDoubleBall() {
    // 红球：33选6，不重复
    const redBalls = shuffle([...Array(33).keys()].map(i => i + 1)).slice(0, 6);
    // 蓝球：16选1
    const blueBall = Math.floor(Math.random() * 16) + 1;
    return { red: redBalls.sort((a, b) => a - b), blue: blueBall };
}
```

### 3.3 图像处理模块 (`apps/image-processing/`)

#### 模块职责
提供证件照制作、图片编辑、图片合并等专业图像处理功能。

#### 包含工具

| 文件名 | 功能描述 | 核心技术 |
|--------|----------|----------|
| `idphoto.html` | 证件照采集系统 | Cropper.js裁剪、多尺寸支持 |
| `image_edit.html` | 图片编辑器 | Canvas操作 |
| `image_merge.html` | 图片合并工具 | 多图拼接 |
| `image_splitter.html` | 图片分割器 | 网格分割 |
| `photo_separation.html` | 照片抠图 | 背景分离 |

#### 关键技术点

```javascript
// idphoto.html - 证件照生成核心
const PHOTO_SIZES = {
    '1': { name: '一寸照', width: 295, height: 413 },    // 25mm×35mm
    '2': { name: '二寸照', width: 413, height: 579 },    // 35mm×49mm
    'id': { name: '身份证', width: 358, height: 441 },  // 26mm×32mm
    'passport': { name: '护照', width: 33, height: 48 }  // 33mm×48mm
};

// 初始化裁剪器
const cropper = new Cropper(image, {
    aspectRatio: 3 / 4,
    viewMode: 1,
    autoCropArea: 0.8,
    guides: true,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true
});
```

#### 工作流程
```
上传照片 → 裁剪调整 → 选择背景色 → 选择尺寸 → 生成并下载
```

### 3.4 游戏模块 (`apps/games/`)

#### 模块职责
集合100+款经典HTML5游戏，无需安装即可在浏览器中运行。

#### 游戏分类

| 类别 | 代表游戏 |
|------|----------|
| 棋牌类 | 中国象棋、五子棋、围棋、跳棋、麻将 |
| 街机类 | 俄罗斯方块、贪吃蛇、Flappy Bird、吃豆人 |
| 益智类 | 数独、2048、扫雷、华容道、拼图 |
| 体育类 | 乒乓球、羽毛球、篮球、台球、保龄球 |
| 塔防类 | 植物大战僵尸、防御塔、兵棋推演 |

#### 技术架构

每个游戏遵循统一的文件结构：
```
game-name/
├── index.html          # 游戏主页面
├── css/
│   └── style.css       # 游戏样式
└── js/
    └── game.js         # 游戏逻辑
```

#### 核心游戏引擎模式

```javascript
// 游戏基类模式
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.score = 0;
    }
    
    start() {
        this.isRunning = true;
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {}   // 游戏逻辑更新
    render() {}   // 画面渲染
    pause() { this.isRunning = false; }
    resume() { this.isRunning = true; }
}
```

#### 性能优化策略
- 使用`requestAnimationFrame`实现60fps流畅渲染
- Canvas离屏渲染优化
- 对象池复用
- 事件节流防抖

### 3.5 AI工具模块 (`apps/ai-tools/`)

#### 模块职责
整合AI相关工具和视频创作资源。

#### 内容结构

```
ai-tools/
├── 2603/              # 2026年3月内容
│   └── 31-*.html       # 日常记录
├── 2604/              # 2026年4月内容
│   ├── 0101-jetbrains-air-video/
│   ├── 0102-seedream-n8n/
│   └── ...            # 多个视频项目
├── video-creator/     # 视频创作工具
│   ├── scripts/
│   │   ├── apply-theme.js      # 主题应用
│   │   ├── generate-script.js  # 脚本生成
│   │   ├── quality-check.js    # 质量检查
│   │   └── video-workflow.js   # 工作流
│   ├── references/
│   │   ├── platform-guides/    # 平台指南
│   │   ├── theme-specs/        # 主题规格
│   │   └── workflow-examples/  # 工作流示例
│   ├── SKILL.md
│   └── QUICKSTART.md
└── *.html             # 独立工具页面
```

---

## 4. 关键脚本工具

### 4.1 索引页生成器 (`scripts/generate-index-pages.py`)

#### 功能说明
自动为所有子目录生成标准化的`index.html`导航页面。

#### 核心函数

| 函数名 | 职责 | 参数 |
|--------|------|------|
| `generate_index_html()` | 生成目录索引HTML | `dir_path: Path` |
| `generate_index_recursive()` | 递归处理目录树 | `dir_path, count` |
| `calculate_asset_depth()` | 计算资源引用深度 | `current_dir` |
| `is_excluded_dir()` | 检查目录是否排除 | `dir_name` |
| `get_file_size()` | 获取文件大小 | `file_path` |

#### 使用方法

```bash
cd /Volumes/E/JYW/创意项目/工具箱
python3 scripts/generate-index-pages.py
# 确认后自动生成所有索引页面
```

#### 配置项

```python
# 排除的目录
EXCLUDE_DIRS = {'.git', '.vscode', 'node_modules', '__pycache__', 'archive', '.idea'}

# 文件类型图标映射
FILE_ICONS = {
    'html': 'fa-file-code',
    'js': 'fa-file-code',
    'css': 'fa-file-code',
    'md': 'fa-file-alt',
    'png': 'fa-file-image',
    # ...
}
```

### 4.2 CSS/JS分离工具 (`scripts/css_js_separator.py`)

#### 功能说明
将HTML文件中的内联CSS和JavaScript代码提取为外部文件。

#### 核心函数

| 函数名 | 职责 |
|--------|------|
| `extract_css_from_html()` | 提取CSS代码块 |
| `extract_js_from_html()` | 提取JavaScript代码块 |
| `remove_inline_css()` | 移除内联CSS |
| `remove_inline_js()` | 移除内联JS |
| `add_external_links()` | 添加外部引用 |
| `process_game()` | 处理单个游戏目录 |

#### 使用方法

```bash
python3 scripts/css_js_separator.py apps/games/
```

#### 输出结构

```
处理前:
game/index.html  (包含内联CSS和JS)

处理后:
game/
├── index.html      (引用外部文件)
├── css/
│   └── style.css   (提取的CSS)
└── js/
    └── game.js     (提取的JS)
```

### 4.3 游戏验证工具 (`scripts/game_validator.py`)

#### 功能说明
验证已处理游戏的文件结构和完整性。

#### 检查项目

- [x] `index.html`文件存在性
- [x] 备份文件`.backup`存在性
- [x] 内联CSS/JS清理状态
- [x] 外部文件引用正确性
- [x] CSS/JS文件大小有效性

#### 使用方法

```bash
python3 scripts/game_validator.py apps/games/
```

#### 输出示例

```
🔍 开始验证游戏文件结构
📁 游戏目录: apps/games/
📊 验证 47 个游戏
============================================================
✅ snake-game: CSS(15KB) JS(20KB)
⚠️  chess: 仍有内联CSS未分离
❌ chess: CSS文件引用但文件不存在
============================================================
📈 验证完成!
✅ 正常: 45
⚠️  警告: 1
❌ 错误: 1
```

### 4.4 其他脚本工具

| 脚本名 | 功能描述 |
|--------|----------|
| `enhance-index-pages.py` | 增强索引页面功能 |
| `generate-apps-index.py` | 生成apps目录索引 |
| `cleanup_backups.py` | 清理过期备份文件 |
| `normalize-js.sh` | JavaScript代码规范化 |

---

## 5. 静态资源结构

### 5.1 CSS资源 (`assets/css/`)

| 文件名 | 版本/来源 | 用途 |
|--------|-----------|------|
| `style.css` | 自定义 | 全局样式系统 |
| `design-system.css` | 自定义 | 设计令牌定义 |
| `layui.min.css` | 2.6+ | LayUI框架样式 |
| `fontawesome.min.css` | 6.4.0 | FontAwesome图标 |
| `highlight.min.css` | - | 代码语法高亮 |
| `highlight-dark.min.css` | - | 代码高亮（深色主题） |
| `cropper.min.css` | - | 图片裁剪组件 |

### 5.2 JavaScript资源 (`assets/js/vendor/`)

| 文件名 | 库名 | 用途 |
|--------|------|------|
| `layui.min.js` | LayUI | UI组件框架 |
| `lucide.min.js` | Lucide | SVG图标库 |
| `chart.min.js` | Chart.js | 图表绑定 |
| `cropper.min.js` | Cropper.js | 图片裁剪 |
| `hls.min.js` | HLS.js | 视频流播放 |
| `highlight.min.js` | Highlight.js | 代码高亮 |
| `filesaver.min.js` | FileSaver.js | 文件下载 |
| `jszip.min.js` | JSZip | ZIP压缩 |
| `sortable.min.js` | Sortable.js | 拖拽排序 |
| `interact.min.js` | Interact.js | 交互手势 |

### 5.3 设计系统变量 (`assets/css/design-system.css`)

```css
:root {
    /* 主色调 */
    --primary: #2196F3;
    --primary-light: #E3F2FD;
    --primary-dark: #1976D2;
    
    /* 功能色 */
    --success: #4CAF50;
    --warning: #FF9800;
    --danger: #F44336;
    --info: #00BCD4;
    
    /* 阴影系统 */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.05);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.08);
    
    /* 圆角 */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    
    /* 过渡 */
    --transition-fast: 0.15s;
    --transition-normal: 0.3s;
}
```

---

## 6. 技术栈与依赖

### 6.1 前端框架

| 框架 | 版本 | 用途 |
|------|------|------|
| LayUI | 2.6+ | UI组件框架（已逐步弃用） |
| Tailwind CSS | CDN | 原子化CSS框架（主要使用） |

### 6.2 第三方库

#### CDN引入方式

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="../../assets/css/fontawesome.min.css">

<!-- LayUI (部分页面) -->
<link rel="stylesheet" href="../../assets/css/layui.min.css">
<script src="../../assets/js/layui.min.js"></script>
```

### 6.3 React项目依赖 (`apps/courses/一元二次函数/`)

```json
{
  "dependencies": {
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "@google/genai": "^1.31.0",
    "react-markdown": "^10.1.0",
    "recharts": "^3.5.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### 6.4 开发工具依赖

| 工具 | 版本 | 用途 |
|------|------|------|
| Python | 3.7+ | 构建脚本 |
| Node.js | 16+ | React项目构建 |
| Vite | 6.2+ | React开发服务器 |

---

## 7. 运行方式

### 7.1 本地开发服务器

#### Python方式（推荐）

```bash
cd /Volumes/E/JYW/创意项目/工具箱
python3 -m http.server 8000
# 访问 http://localhost:8000
```

#### Node.js方式

```bash
npx serve .
# 或使用 http-server
npm install -g http-server
http-server -p 8080
```

### 7.2 React项目运行

```bash
cd apps/courses/一元二次函数

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 7.3 构建脚本使用

```bash
# 生成所有索引页
python3 scripts/generate-index-pages.py

# 分离游戏CSS/JS
python3 scripts/css_js_separator.py apps/games/

# 验证游戏文件
python3 scripts/game_validator.py apps/games/

# 清理备份文件
python3 scripts/cleanup_backups.py
```

### 7.4 生产部署

由于项目是纯静态站点，可部署到以下平台：

| 平台 | 部署方式 |
|------|----------|
| GitHub Pages | push后自动部署 |
| Vercel | 连接Git仓库 |
| Netlify | 拖拽或Git集成 |
| 阿里云OSS | 上传文件或SDK |
| 腾讯云COS | 上传文件或工具 |

---

## 8. 开发规范

### 8.1 HTML文件规范

#### 必需Meta标签

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="author" content="工具箱">
    <title>页面标题 - 工具箱</title>
    <meta name="description" content="页面描述（150字符内）">
    <meta name="keywords" content="关键词1,关键词2">
    
    <!-- SEO优化 -->
    <link rel="canonical" href="https://tools.yy24365.com/page.html">
    <link rel="sitemap" type="application/xml" href="/sitemap.xml">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="分享标题">
    <meta property="og:description" content="分享描述">
    <meta property="og:image" content="https://example.com/og-image.png">
    
    <!-- 微信分享 -->
    <meta name="wechat-share-title" content="分享标题">
    <meta name="wechat-share-desc" content="分享描述">
    <meta name="wechat-share-img" content="分享图片">
</head>
```

#### 微信分享占位符

```html
<!-- 必须放在body开始处 -->
<div style="display:none; visibility:hidden;">
    <img src="https://tools.yy24365.com/assets/images/og.png" 
         alt="wechat-share-icon" width="400" height="400">
</div>
```

### 8.2 样式规范

#### Tailwind CSS使用

```html
<!-- 基础用法 -->
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold">标题</h1>
</div>

<!-- 响应式设计 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 卡片内容 -->
</div>

<!-- 悬停效果 -->
<button class="bg-blue-500 hover:bg-blue-600 transition-all">
    按钮
</button>
```

#### 自定义样式

```css
/* 在style.css中定义 */
/* 使用CSS变量保持一致性 */
.card {
    background: var(--white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    transition: var(--transition-normal);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}
```

### 8.3 JavaScript规范

#### 模块化组织

```javascript
// 使用IIFE避免全局污染
(function() {
    'use strict';
    
    // 初始化函数
    function init() {
        bindEvents();
        loadData();
    }
    
    // 事件绑定
    function bindEvents() {
        document.getElementById('btn')
            .addEventListener('click', handleClick);
    }
    
    // 处理函数
    function handleClick(e) {
        console.log('Button clicked');
    }
    
    // DOM加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);
})();
```

#### 图片处理规范

```javascript
// 文件上传处理
function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const image = new Image();
        image.onload = function() {
            processImage(image);
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Canvas处理
function processImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    // 处理逻辑...
    return canvas.toDataURL('image/jpeg', 0.9);
}
```

### 8.4 游戏开发规范

#### 文件结构

```
game-name/
├── index.html    # 主页面
├── css/
│   └── style.css # 游戏样式
└── js/
    └── game.js   # 游戏逻辑
```

#### 游戏循环

```javascript
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.FPS = 60;
        this.frameTime = 1000 / this.FPS;
    }
    
    start() {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }
    
    loop(currentTime) {
        const delta = currentTime - this.lastTime;
        
        if (delta >= this.frameTime) {
            this.update(delta);
            this.render();
            this.lastTime = currentTime - (delta % this.frameTime);
        }
        
        requestAnimationFrame(this.loop.bind(this));
    }
    
    update(delta) { /* 更新逻辑 */ }
    render() { /* 渲染逻辑 */ }
}
```

---

## 9. SEO与分享优化

### 9.1 结构化数据

```html
<!-- WebApplication结构化数据 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "工具名称",
  "description": "工具描述",
  "url": "https://tools.yy24365.com/tool.html",
  "applicationCategory": "ToolApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  }
}
</script>

<!-- BreadcrumbList结构化数据 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "首页", "item": "https://tools.yy24365.com"},
    {"@type": "ListItem", "position": 2, "name": "工具分类", "item": "https://tools.yy24365.com/apps/"}
  ]
}
</script>
```

### 9.2 Sitemap配置

项目使用统一的`sitemap.xml`包含所有页面，格式示例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://tools.yy24365.com/</loc>
        <lastmod>2025-01-20</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://tools.yy24365.com/apps/utilities/</loc>
        <lastmod>2025-01-20</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
```

### 9.3 robots.txt配置

```txt
User-agent: *
Allow: /
Disallow: /codex-install-video/src/

Sitemap: https://tools.yy24365.com/sitemap.xml
```

---

## 附录

### A. 快速参考

| 操作 | 命令 |
|------|------|
| 启动本地服务器 | `python3 -m http.server 8000` |
| 生成索引页 | `python3 scripts/generate-index-pages.py` |
| 分离CSS/JS | `python3 scripts/css_js_separator.py <dir>` |
| 验证游戏 | `python3 scripts/game_validator.py <dir>` |
| React开发 | `cd apps/courses/一元二次函数 && npm run dev` |

### B. 浏览器兼容性

| 浏览器 | 最低版本 | 支持特性 |
|--------|----------|----------|
| Chrome | 80+ | 全部 |
| Firefox | 75+ | 全部 |
| Safari | 13+ | 全部 |
| Edge | 80+ | 全部 |
| iOS Safari | 13+ | 响应式、Touch |
| Android Chrome | 80+ | 响应式 |

### C. 相关资源

- 项目域名: https://tools.yy24365.com
- Font Awesome: https://fontawesome.com
- Tailwind CSS: https://tailwindcss.com
- LayUI: https://layui.dev

---

*文档生成时间: 2025-01-20*
*最后更新: 请参考项目git提交历史*
