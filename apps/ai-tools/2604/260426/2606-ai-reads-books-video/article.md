# AI-reads-books-page-by-page

## 项目概览

- **项目名称**: AI reads books: Page-by-Page PDF Knowledge Extractor & Summarizer
- **GitHub**: https://github.com/echohive42/AI-reads-books-page-by-page
- **主题**: AI 逐页分析 PDF 书籍，提取知识点并生成渐进式摘要

## 核心功能

### 主要特性

1. **📚 自动化 PDF 书籍分析**
   - 智能逐页分析 PDF 内容
   - 系统性提取知识点

2. **🤖 AI 驱动的内容理解**
   - 使用 OpenAI API 进行内容理解
   - 生成渐进式摘要

3. **📊 间隔式进度摘要**
   - 可配置的分析间隔
   - 生成间隔摘要和最终摘要

4. **💾 持久化知识库存储**
   - JSON 格式存储知识库
   - 支持断点续传

5. **📝 Markdown 格式化输出**
   - 生成格式化的摘要文件
   - 便于阅读和分享

6. **🎨 彩色终端输出**
   - 更好的视觉体验

7. **🔄 断点续传能力**
   - 支持从已有知识库恢复

8. **⚙️ 高度可配置**
   - 分析间隔可调
   - 测试模式可选

9. **🚫 智能内容过滤**
   - 自动跳过目录、索引页等

10. **📂 组织的目录结构**
    - 清晰的输出组织方式

## 技术架构

### 配置参数

| 参数 | 说明 |
|------|------|
| PDF_NAME | PDF 文件名 |
| BASE_DIR | 基础目录 |
| KNOWLEDGE_DIR | 知识库存储目录 |
| SUMMARIES_DIR | 摘要存储目录 |
| ANALYSIS_INTERVAL | 分析间隔页数 |
| MODEL | 页面处理模型 |
| ANALYSIS_MODEL | 分析模型 |
| TEST_PAGES | 测试页数 |

### 输出结构

```
book_analysis/
├── knowledge_bases/  # JSON 知识库文件
├── summaries/       # Markdown 摘要文件
└── pdfs/           # PDF 文件副本
```

## 使用方法

### 1. 安装

```bash
git clone <repository-url>
cd <repository-name>
pip install -r requirements.txt
```

### 2. 配置

- 将 PDF 文件放入项目根目录
- 修改 `read_books.py` 中的 `PDF_NAME` 常量

### 3. 运行

```bash
python read_books.py
```

## 工作流程

1. **设置**: 创建必要目录，确保 PDF 在正确位置
2. **加载知识库**: 从 JSON 文件加载已有知识库
3. **处理页面**: 逐页处理 PDF，提取知识点
4. **生成摘要**: 根据 ANALYSIS_INTERVAL 生成间隔摘要
5. **保存结果**: 保存知识库和摘要到文件

## 适用场景

- 学术研究者快速把握书籍要点
- 学习者制作学习笔记
- 内容创作者提取书籍精华
- 企业培训资料整理

## Star 数

> 由于无法获取实时 star 数，请访问 GitHub 页面查看
