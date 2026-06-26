# Chandra OCR 2 项目详解

## 项目简介

Chandra OCR 2 是 Datalab 推出的 SOTA 文档智能识别模型，可将图片和 PDF 转换为结构化的 Markdown、HTML 或 JSON，同时保留完整的布局信息。

## 核心功能

### 1. SOTA 性能
在外部 olmocr benchmark 中排名第一，多语言 OCR benchmark 显著提升。

### 2. 多格式输出
支持转换为 Markdown、HTML 或 JSON，保留详细的布局信息。

### 3. 90+ 语言支持
强大的多语言 OCR 能力，覆盖全球主要语言。

### 4. 手写识别
优秀的手写内容识别能力，精准还原手写文档。

### 5. 复杂文档处理
- 表格识别准确
- 数学公式提取
- 复杂布局解析
- 表单重建（含复选框）
- 图片和图表提取，自动添加标题

### 6. 双推理模式
- **本地模式**: 使用 HuggingFace推理
- **远程模式**: 使用 vLLM 服务器（推荐，更轻量）

## 快速开始

```bash
# 安装
pip install chandra-ocr

# 使用 vLLM（推荐）
chandra_vllm
chandra input.pdf ./output

# 使用 HuggingFace
pip install chandra-ocr[hf]
chandra input.pdf ./output --method hf

# 交互式 Streamlit 应用
pip install chandra-ocr[app]
chandra_app
```

## 性能基准

- 外部 olmocr benchmark 第一名
- 90+ 语言多语言 benchmark
- 表格、 数学、布局、文本准确率全面提升

## 适用场景

- 📄 PDF 文档数字化
- 📝 手写笔记转换
- 📊 表格数据提取
- 🔢 数学公式识别
- 🌐 多语言文档处理
- 🏢 企业文档自动化
