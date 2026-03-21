## Qwen3-Coder

Qwen3-Coder 有多个版本，其中 Qwen3-Coder-480B-A35B-Instruct 是一个有 480B 参数、35B 激活参数的 MoE 模型，原生支持 256K token 的上下文并可通过 YaRN 扩展到 1M token，拥有卓越的代码和 Agent 能力。据悉，该模型支持 358 种编程语言，在 Agentic Coding、Agentic Browser-Use 和 Agentic Tool-Use 上取得了开源模型的 SOTA 效果，可以与 Claude Sonnet4 媲美。

项目官网：<https://qwenlm.github.io/blog/qwen3-coder/>
GitHub仓库：<https://github.com/QwenLM/Qwen3-Coder>
HuggingFace模型库：<https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct>

### Qwen3-Coder的主要功能
- 代码生成与优化：根据用户输入的自然语言描述生成高质量的代码。支持多种编程语言，包括但不限于 Python、JavaScript、Java 等，能生成复杂的代码逻辑，如函数、类、模块等。
- 代理式编程（Agentic Coding）：自主规划和执行多步骤任务，例如在开发过程中自动调用工具、执行代码测试等。支持与外部工具（如浏览器、API 等）交互，完成复杂的任务。
- 长时序交互（Long-Horizon Interaction）：在真实世界的软件工程任务中，Qwen3-Coder 用多轮交互解决问题，例如在 SWE-Bench 等任务中表现出色。
- 上下文扩展：原生支持 256K token 的上下文长度，基于 YaRN 技术扩展到 1M token，适用仓库级和动态数据（如 Pull Request）的处理。
- 多工具集成：支持与多种工具（如 Qwen Code、Claude Code、Cline 等）集成。

### Qwen3-Coder的技术原理
- 混合专家模型（Mixture-of-Experts, MoE）：Qwen3-Coder 是 480B 参数的混合专家模型，激活 35B 参数。支持模型在处理大规模数据时保持高效的计算性能，同时具备强大的表达能力。
- 大规模预训练（Pre-Training）：用 7.5T 的数据进行预训练，代码数据占比 70%。基于大规模数据训练，模型学习到丰富的编程模式和语言结构。支持 256K token 的上下文长度，基于 YaRN 技术扩展到 1M token，优化对仓库级和动态数据的处理能力。
- 合成数据扩展：基于 Qwen2.5-Coder 对低质数据进行清洗和重写，显著提升整体数据质量，进一步优化模型的训练效果。
- 强化学习（Reinforcement Learning, RL）：在后训练阶段，基于大规模强化学习，通过自动扩展测试样例，构造高质量的训练实例，显著提升代码执行成功率。引入长时序强化学习（Long-Horizon RL），鼓励模型用多轮交互解决问题，提升在真实软件工程任务中的表现。

### Qwen3-Coder的应用场景
- 代码生成与自动化开发：快速生成代码原型，支持多语言，节省开发时间，提升效率。
- 代理式编程（Agentic Coding）：自主规划和执行多步骤任务，与外部工具交互，完成复杂任务。
- 软件工程任务：辅助代码审查、优化、测试生成和文档编写，提升代码质量和开发流程效率。
- 教育与学习：为初学者提供代码示例和教学支持，助力快速掌握编程知识和技能。
- 企业开发：快速开发内部工具、自动化脚本，提升团队效率，加速项目启动。

通过 npm 管理器安装 Qwen Code：

```bash
npm i -g @qwen-code/qwen-code
```

另一种方式是从源码安装：

```bash
git clone https://github.com/QwenLM/qwen-code.git 
cd qwen-code && npm install && npm install -g
```

Qwen Code 支持 OpenAI SDK 调用 LLM，你可以导出以下环境变量，或者简单地将其放在 .envfile 中。

```bash
export OPENAI_API_KEY="sk-43e7b89bdaeb4ec794e9ba2eb5e4de68"
export OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
export OPENAI_MODEL="qwen3-coder-plus"
```


## 在 Claude Code 使用 Qwen3‑Coder 的方法

### 方案 1：使用 dashscope 提供的代理  API

只需要将 Anthropic 的 base url 替换成 dashscope 上提供的 endpoint 即可。

```bash
export ANTHROPIC_BASE_URL=https://dashscope.aliyuncs.com/api/v2/apps/claude-code-proxy
export ANTHROPIC_AUTH_TOKEN=sk-43e7b89bdaeb4ec794e9ba2eb5e4de68
```

至此，可以直接输入 claude 开始使用 Qwen3-Coder & Claude Code

### 方案 2：使用 claude-code-config 自定义路由

laude-code-router 是一个第三方的路由工具，用于为 Claude Code 灵活地切换不同的后端 API。dashscope 平台提供了一个简单的扩展包 claude-code-config，可为 claude-code-router 生成包含 dashscope 支持的默认配置。

```bash
npm install -g @musistudio/claude-code-router
npm install -g @dashscope-js/claude-code-config
```

生成配置文件和插件目录：

```bash
ccr-dashscope
```

该命令会自动生成 ccr 所需的配置文件和插件目录。你也可以手动调整~/.claude-code-router/config.json 和 ~/.claude-code-router/plugins/ 中的配置。最后，通过 ccr 开始使用 Claude Code：

```bash
ccr code
```

至此，你即可通过 ccr 使用 Claude Code 畅享 Qwen3‑Coder 的强大编码能力。祝开发顺利！

## Cline

配置 Qwen3-Coder-480B-A35B-instruct 以使用 cline：
‒ 进入 cline 的配置设置
‒ 选择“OpenAI Compatible”模式
‒ 在 OpenAI Compatible API tokens处，输入从 Dashscope 获取的密钥
‒ 勾选“使用自定义基础 URL”，并输入：<https://dashscope.aliyuncs.com/compatible-mode/v1>
‒ 输入模型名称：qwen3-coder-plus

