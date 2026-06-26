# Dify 项目详解

## 项目简介

**Dify** 是一个开源的 LLM 应用开发平台。它的直观界面结合了 AI 工作流、RAG 管道、Agent 能力、模型管理、可观测性等功能，让你能够快速从原型开发到生产部署。

## 核心特性

### 1. 工作流 (Workflow)
在可视化画布上构建和测试强大的 AI 工作流。

### 2. 模型支持
无缝集成来自数十个推理提供商和自托管解决方案的数百个专有/开源 LLM，包括 GPT、Mistral、Llama3 和任何 OpenAI API 兼容模型。

### 3. Prompt IDE
直观的界面用于制作提示词、比较模型性能，并为基于聊天的应用添加文本转语音等功能。

### 4. RAG 管道
全面的 RAG 能力，涵盖从文档摄入到检索的一切，开箱即用支持从 PDF、PPT 和其他常见文档格式中提取文本。

### 5. Agent 能力
可以基于 LLM Function Calling 或 ReAct 定义 Agent，并为 Agent 添加预构建或自定义工具。Dify 为 AI Agent 提供 50+ 内置工具，如 Google Search、DALL·E、Stable Diffusion 和 WolframAlpha。

### 6. LLMOps
监控和分析应用日志和性能随时间的变化。可以根据生产数据和注释持续改进提示词、数据集和模型。

### 7. 后端即服务
所有 Dify 产品都配有相应的 API，可以轻松将 Dify 集成到自己的业务逻辑中。

## 技术栈

- Docker / Kubernetes 部署
- 支持数十种模型提供商
- RAG 文档处理
- API 优先架构

## 使用方式

### Docker 快速启动
```bash
cd docker
cp .env.example .env
docker compose up -d
```

访问 http://localhost/install 开始初始化。

## 变现思路

**目标客户**：传统电商、线下门店

**服务内容**：
- 导入商家话术和商品库
- 搭建专属客服机器人
- 提供"搭建费 + 月维护费"

## 作者信息

- 公司: LangGenius
- 许可证: MIT / 商业许可
- 官网: https://dify.ai
- GitHub: https://github.com/langgenius/dify
