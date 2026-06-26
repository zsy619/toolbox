# GitHub 15000+ Stars！首个开源AI编程Harness来了！

**作者 | 元曜科技**

---

当你让 AI 修一个 bug，它可能跳过规划、忘记跑测试，PR 描述还可能乱写。

**每次运行结果都不一样！**

Archon 来了！

这是首个开源 AI 编程 Harness Builder，让 AI 编程变得**确定**、**可重复**、**可控制**。

## 类比一下

- **Dockerfile** → 改变了**基础设施**的部署方式
- **GitHub Actions** → 改变了 **CI/CD** 的流程
- **Archon** → 正在改变 **AI 编程工作流**

## 核心特性

**🔄 确定性工作流**
同样的流程，每次都一样。

**🌳 Git Worktree 隔离**
5个任务并行跑也不会冲突。

**⏱️ Fire and Forget**
丢给它任务，回来就是 PR 加 Review。

**🔧 YAML 流程编排**
17个预置工作流，开箱即用。

## 多平台支持

Web UI、命令行、Slack、Telegram——想怎么用就怎么用。

## 工作流示例

```yaml
nodes:
  - id: plan
    prompt: "Explore and create plan"
  - id: implement
    loop: until: ALL_TASKS_COMPLETE
  - id: run-tests
    bash: "bun run validate"
  - id: review
    prompt: "Review changes"
  - id: create-pr
    prompt: "Push and create PR"
```

## 快速开始

```bash
curl -fsSL https://archon.diy/install | bash
```

然后：

```bash
cd your-project
claude
# 输入: Use archon to fix issue #42
```

---

**赶紧去 GitHub 搜索 coleam00/Archon，Star 一下，开始你的 AI 编程进化！**

---

**往期推荐**

- [公众号标题技巧]()
- [视频号运营攻略]()
- [AI 编程工具盘点]()

**扫码关注「元曜科技」**

第一时间获取 AI 编程、科技工具干货！
