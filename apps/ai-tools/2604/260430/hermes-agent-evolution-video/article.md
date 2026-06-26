# Hermes Agent Self-Evolution 原始内容

## 项目信息
- **GitHub**: https://github.com/NousResearch/hermes-agent-self-evolution
- **开发商**: NousResearch
- **认证**: ICLR 2026 Oral, MIT许可

## 核心定位

Hermes Agent Self-Evolution 使用 DSPy + GEPA（Genetic-Pareto Prompt Evolution）自动进化和优化 Hermes Agent 的技能、工具描述、系统提示词和代码——通过反思性进化搜索产生可量化的更好版本。

**核心亮点**：无需GPU训练，全部通过API调用完成——突变文本、评估结果、选择最优变体。每次优化运行约$2-10。

## 工作原理

```
读取当前技能/提示词/工具
        ↓
生成评估数据集
        ↓
   GEPA优化器 ← 执行轨迹
        ↓
候选变体 → 评估
        ↓
约束门控（测试、大小限制、基准）
        ↓
最优变体 → PR提交到hermes-agent
```

**关键创新**：GEPA 读取执行轨迹，理解"为什么"失败（而不只是"失败"了），然后提出针对性改进。

## 优化阶段

| 阶段 | 目标 | 引擎 | 状态 |
|------|------|------|------|
| Phase 1 | 技能文件（SKILL.md） | DSPy + GEPA | ✅ 已实现 |
| Phase 2 | 工具描述 | DSPy + GEPA | 🔲 计划中 |
| Phase 3 | 系统提示词段落 | DSPy + GEPA | 🔲 计划中 |
| Phase 4 | 工具实现代码 | Darwinian Evolver | 🔲 计划中 |
| Phase 5 | 持续改进循环 | 自动化流水线 | 🔲 计划中 |

## 引擎

| 引擎 | 功能 | 许可 |
|------|------|------|
| DSPy + GEPA | 反思性提示进化——读执行轨迹，提针对性突变 | MIT |
| Darwinian Evolver | Git-based 代码进化 | AGPL v3 |

## Guardrails（保障机制）

每个进化变体必须通过：
1. **完整测试套件** — pytest 100%通过
2. **大小限制** — 技能≤15KB，工具描述≤500字符
3. **缓存兼容性** — 对话中途不能变更
4. **语义保真** — 不能偏离原始目的
5. **PR审核** — 所有变更经过人工审核，从不直接提交
