# CLAUDE.md - Andrej Karpathy Skills

> 🧠 Andrej Karpathy 启发 · 改进 Claude 代码行为的单个文件

## 📌 项目简介

**CLAUDE.md** 是一个受到 Andrej Karpathy 关于 LLM 编码陷阱观察启发的项目。通过在项目根目录放置一个 Markdown 配置文件，告诉 Claude 更多项目上下文，从而改善 Claude Code 的行为。

## 🎯 核心价值

| 特性 | 说明 |
|------|------|
| ⚠️ 解决假设错误 | LLM 代表用户做出错误假设？CLAUDE.md 帮你纠正 |
| 🔍 强制检查机制 | 让 Claude 不再盲目运行，而是先检查 |
| 📋 单文件配置 | 只需一个 Markdown 文件，简单高效 |
| 🤖 改善代码行为 | 让 Claude 更懂你的项目，更懂你的需求 |

## 🎬 视频演示

本项目配套视频演示了 CLAUDE.md 的核心概念和价值：

- **平台**: 微信视频号 / 小红书 / 抖音 / YouTube
- **时长**: 48 秒
- **分辨率**: 1080×1920 (竖屏)
- **帧率**: 60fps

## 📚 文档目录

```
docs/
├── README.md           # 本文档
├── video-script.md    # 视频脚本
├── copy.md           # 多平台营销文案
├── wechat.md         # 公众号文案
├── posting-guide.md   # 多平台发布指南
├── landing-page.html  # 宣传落地页
├── article-page.html  # 文章阅读页
└── assets/
    └── cover.png      # 封面图
```

## 🔗 相关链接

- **GitHub**: [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)
- **Stars**: 14,089 (+1,066 yesterday)
- **灵感来源**: Andrej Karpathy's observations on LLM coding pitfalls

## 📝 视频文案

详见 [copy.md](./copy.md)，包含：

- 小红书版本（吸引眼球的标题 + 正文 + 标签）
- 微信视频号版本（简洁有力的标题 + 描述）
- 公众号版本（完整正文格式）
- 抖音版本（短平快风格）

## 💡 Andrej Karpathy 指出的 LLM 编码陷阱

1. **假设错误**: 模型代表用户做出错误的假设，并直接运行
2. **不检查**: 不验证假设是否正确就执行
3. **不寻求澄清**: 遇到模糊情况不主动提问
4. **不暴露不一致**: 不主动指出代码中的矛盾
5. **不提出权衡**: 不提供多种解决方案供选择
6. **不推迟**: 在应该推迟到后续处理时直接尝试

## 👥 适用人群

- 关注 **AI Agent** 的团队
- 开发 **LLM 应用** 的工程师
- 研究**智能体工程化**的开发者
- 搭建**自动化助手**的团队
- 研发 **Copilot** 的产品团队
- 设计**模型编排流程**的架构师

## 🔧 工作原理

在项目根目录创建 `CLAUDE.md` 文件：

```markdown
# CLAUDE.md

这个项目是...

主要技术栈：
- ...

代码规范：
- ...

注意事项：
- ...
```

Claude 会自动读取这个文件，获得更多项目上下文，从而做出更准确的响应。

---

*本项目由 AI 辅助生成，用于展示 CLAUDE.md 视频创作流程*
