# MD-This-Page 内容分析

> 来源：https://github.com/Ademking/MD-This-Page

## 项目概述

MD-This-Page 是一款浏览器扩展，可将任意网页一键转换为干净的 Markdown。它去除了 HTML 噪音（广告、导航栏、脚本），为 LLM 提供结构化的干净输入。

## 核心价值

### 为什么需要这个扩展？

1. **减少噪音，增加信号**
   - 移除广告、UI元素、样板内容
   - 只保留主要内容

2. **更好的结构理解**
   - 标题、列表、章节被保留
   - LLM 能自然理解 Markdown 结构

3. **Token 效率**
   - Markdown 比 HTML 更紧凑
   - 在有限上下文中塞入更多有用内容

4. **提升推理质量**
   - 清晰的层级格式让模型更容易总结、提取、准确回答

5. **可靠的解析**
   - 不像原始 HTML 那样有深层嵌套或不一致的 DOM 结构

## 功能特性

### 转换方式
- **右键菜单**：右击 → ".MD this page"
- **快捷键**：Alt+M 一键转换

### 智能提取
- 基于 Mozilla Readability 库
- 自动分离主体内容
- 忽略广告、导航栏、无用元素

### 自定义输出选项
- ✅/❌ 保留/移除图片
- ✅/❌ 保留/移除链接
- ✅/❌ 显示/隐藏元数据（标题、作者、日期）
- ✅/❌ 显示/隐藏源 URL
- ✅/❌ 生成文档结构/页面地图

### 导出选项
- 📋 复制到剪贴板
- 💾 下载为 .md 文件
- 🤖 复制为 Prompt（适合 AI 工作流）

### 预览界面
- 独立的预览 Tab
- 可查看和微调提取的 Markdown

## 技术架构

### 技术栈
- **框架**：Plasmo (浏览器扩展框架)
- **UI**：React + Tailwind CSS
- **提取**：@mozilla/readability
- **转换**：Turndown (HTML → Markdown)

### 安装方式
1. Chrome Web Store
2. Firefox Add-ons
3. GitHub Releases
4. 源码构建

### 源码构建
```bash
git clone https://github.com/Ademking/MD-This-Page.git
cd md-this-page
pnpm install
pnpm dev    # 开发模式
pnpm build  # 生产构建
```

## 使用场景

1. **AI 工作流准备**
   - 为 LLM 喂入干净的结构化内容
   - 提升 AI 回答质量

2. **文章收藏整理**
   - 一键保存网页正文
   - 去掉干扰内容

3. **技术文档提取**
   - 快速获取官方文档正文
   - 便于本地阅读

4. **研究资料收集**
   - 批量提取文章内容
   - 结构化保存

## 竞品对比

| 功能 | MD-This-Page | 其他方案 |
|------|-------------|----------|
| 一键转换 | ✅ | ✅ |
| 快捷键 | ✅ Alt+M | ❌ |
| 自定义选项 | ✅ 多种 | ❌ |
| Prompt 导出 | ✅ | ❌ |
| 浏览器支持 | Chrome + Firefox | 多平台 |

## 总结

MD-This-Page 核心理念：**把"网页"变成"LLM-ready 文档"**。

对于需要处理大量网页内容的 AI 开发者来说，这是一个必备工具。
