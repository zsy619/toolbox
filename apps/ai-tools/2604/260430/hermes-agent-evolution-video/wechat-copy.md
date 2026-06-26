# Hermes Agent Self-Evolution 公众号文案

## 公众号标题
AI Agent 自我进化！$2-10让AI自己优化自己

## 摘要（≤44字）
GEPA + DSPy 让 AI Agent 自动进化技能和提示词，无需GPU，$2-10/次，ICLR 2026 Oral。

## 正文

### 开头（引出问题）

AI Agent 的能力越来越强，但优化它们的方式一直很原始——人工调参，成本高，周期长。

现在，有了一个新思路：**让 AI 自己优化自己。**

### 引出方案

这是 NousResearch 开源的 Hermes Agent Self-Evolution，用 GEPA + DSPy 实现 AI Agent 的自动进化。

它的核心创新是：读懂"为什么"失败，而不只是知道失败了。

### 核心原理

GEPA 引擎的工作流程：

1. 读取当前技能/提示词/工具
2. 生成评估数据集
3. GEPA 优化器读取执行轨迹
4. 生成候选变体
5. 评估并通过约束门控
6. 最优变体提交 PR

### 关键数据

- **No GPU** — 纯 API 调用
- **$2-10/次** — 极低优化成本
- **ICLR 2026 Oral** — 学术认证

### 五阶段进化

目前 Phase 1 已实现（技能文件优化），后续支持工具描述、系统提示词、代码实现、持续改进循环。

### Guardrails

所有变体必须通过：测试、大小限制、语义保真、人工审核。

### 结尾

GitHub: github.com/NousResearch/hermes-agent-self-evolution
