---
title: "OpenCode Day31：Skills 写得好，AI 干活没烦恼 - 今日头条"
url: "https://www.toutiao.com/article/7629527294830445099/"
requestedUrl: "https://www.toutiao.com/article/7629527294830445099/"
author: "编程充电站"
coverImage: "https://p3-sign.toutiaoimg.com/tos-cn-i-ezhpy3drpa/ec83e4e0b6bc489599014d09499f08ad~tplv-tt-shrink-asy2-web:640:0:5aS05p2hQOe8lueoi-WFheeUteermQ==:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1777007397&x-signature=XtYhP%2Ft9ZDv7JEqWHPxQ5ilrHrE%3D"
publishedAt: "2026-04-17T09:11:30+08:00"
summary: "Skills 不是写完就完事，是要让 AI 真正能&quot;照着做&quot; 你有没有遇到过这种情况？ 花半小时写了一套 Skills，AI 第一次用还行，后面越用越乱，输出的代码风格不统一，有时候还忽略关键步骤。 这不是 Skills"
adapter: "generic"
capturedAt: "2026-04-17T05:10:05.196Z"
conversionMethod: "defuddle"
kind: "generic/article"
language: "zh-cn"
---

# OpenCode Day31：Skills 写得好，AI 干活没烦恼 - 今日头条

![](https://p3-sign.toutiaoimg.com/tos-cn-i-ezhpy3drpa/ec83e4e0b6bc489599014d09499f08ad~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1777007397&x-signature=l8ZGCqlaQl8aJ6wB7jojXPR9UWc%3D)

> Skills 不是写完就完事，是要让 AI 真正能"照着做"

你有没有遇到过这种情况？

花半小时写了一套 Skills，AI 第一次用还行，后面越用越乱，输出的代码风格不统一，有时候还忽略关键步骤。

这不是 Skills 不行，而是 Skills 设计有问题。今天这篇文章，聊聊我这两个月摸索出来的 Skills 设计原则，全是真实踩坑经验。

看完这篇，你的 Skills 应该能让 AI 稳定输出，少返工。

**一、为什么你的 Skills 不管用？**

先说结论：大部分 Skills 问题，不是写得太少，而是写得太模糊。

我 review 过十几个读者的 Skills，常见问题就这 3 个：

| **问题** | **表现** | **后果** |
| --- | --- | --- |
| 目标不清晰 | "写高质量的代码" | AI 不知道什么叫"高质量" |
| 步骤不完整 | "先分析需求，再写代码" | 漏掉边界条件、错误处理 |
| 约束不具体 | "用 Python 写" | 没说版本、风格、依赖限制 |

说实话，我第一个 Skills 版本也这样，AI 用起来时好时坏，我还以为是模型问题。

后来我发现：Skills 的本质，是把你的思考过程显性化。AI 不是看不懂，是你没说清楚。

**二、好 Skills 的 4 个标准**

这两个月，我重构了 3 遍 Skills，总结出 4 个判断标准：

**1\. 目标可验证**

❌ 错误写法：

Code

```
goal: 写高质量的代码
```

✅ 正确写法：

Code

```yaml
goal: |
生成的代码必须满足：
- 通过所有单元测试
- 函数长度不超过 50 行
- 包含完整的错误处理
- 符合 PEP8 规范
```

关键：用"必须满足"代替"尽量"，用具体数字代替形容词。

**2\. 步骤可执行**

❌ 错误写法：

Code

```
steps:
- 理解需求
- 写代码
- 测试
```

✅ 正确写法：

Code

```yaml
steps:- 复述用户需求，确认理解一致- 列出实现方案（至少 2 个），说明优缺点- 选择方案后，先写接口定义- 实现核心逻辑，每步加注释- 编写单元测试，覆盖边界条件- 自检：是否满足目标中的 4 条标准
```

关键：每一步都有明确的产出物，AI 知道"做完没"。

**3\. 约束可落地**

❌ 错误写法：

Code

```
constraints:
- 用 Python
- 代码要简洁
```

✅ 正确写法：

Code

```bash
constraints:
- Python 3.11+
- 禁止使用全局变量
- 优先使用标准库，第三方库需说明理由
- 函数必须有类型注解
- 禁止使用 eval 和 exec
```

关键：约束要具体到"能判断对错"的程度。

**4\. 示例可参考**

❌ 不写示例，全靠 AI 猜

✅ 正确写法：

Code

```python
examples:- good: |def calculate_total(items: list[dict]) -> float:if not items:return 0.0return sum(item['price'] * item['quantity'] for item in items)bad: |def calc(items):total = 0for i in items:total += i['p'] * i['q']return total
```

关键：示例要说明"为什么好"和"为什么不好"。

**三、我的 Skills 模板（可直接复用）**

下面是我当前在用的 Skills 模板，你可以直接抄作业：

Code

```
name: backend_api_developerversion: 2.1description: 后端 API 开发专家role: |你是一名资深后端工程师，擅长设计 RESTful API你的代码特点：接口清晰、错误处理完整、文档齐全goal: |生成的 API 代码必须满足：- 所有接口有完整的输入验证- 错误响应格式统一（code, message, data）- 数据库操作有事务保护- 关键操作有日志记录- 通过所有单元测试（覆盖率>80%）steps:- 复述需求，确认接口定义（方法、路径、参数、响应）- 设计数据模型（表结构、字段类型、索引）- 编写接口实现（按顺序：验证→逻辑→持久化→响应）- 编写单元测试（正常流程 + 边界条件 + 异常场景）- 自检：是否满足目标中的 5 条标准constraints:- Python 3.11+，FastAPI 框架- 使用 Pydantic v2 做数据验证- 数据库用 SQLAlchemy 2.0+- 禁止在接口中直接拼接 SQL- 敏感操作（删除、修改）必须有确认机制- 所有异常必须记录日志（含请求参数）output:- 先输出接口设计文档（Markdown 表格）- 再输出完整代码（带注释）- 最后输出测试用例说明- 如有不确定的地方，主动提问
```

使用说明：

- 根据你的技术栈修改 constraints
- 根据你的业务修改 goal 中的 5 条标准
- examples 部分换成你项目的真实代码

**四、踩坑记录（血泪教训）**

这部分是我真实踩过的坑，建议你对照检查：

**坑 1：Skills 写太长，AI 记不住**

问题：我第一个版本写了 500 多行，AI 经常忽略中间的内容

解决：拆分成多个 Skills，按场景调用

**坑 2：Skills 不更新，越用越乱**

问题：项目迭代了，Skills 还在用旧版本

解决：给 Skills 加版本号，每次项目大更新时 review

**坑 3：只写"要做什么"，没写"不要做什么"**

问题：AI 还是会踩我已经知道的坑

解决：在 constraints 里明确写"禁止 XX"

**坑 4：没有自检环节**

问题：AI 输出完就结束，质量问题靠我发现

解决：在 steps 最后加一步"自检：是否满足目标"

**五、总结与建议**

**什么人需要写 Skills？**

| **场景** | **推荐度** | **说明** |
| --- | --- | --- |
| 重复性工作多 | ⭐⭐⭐⭐⭐ | 一次编写，多次复用 |
| 团队协作 | ⭐⭐⭐⭐⭐ | 统一代码风格 |
| 个人项目 | ⭐⭐⭐ | 看工作量，小项目可能不值得 |
| 探索性项目 | ⭐⭐ | **需求变化快，Skills 维护成本高** |

**我的建议**

1. 从一个小场景开始：别一上来就写"全栈开发 Skills"，先写"API开发"或"测试生成"
2. 边用边改：第一版肯定不完美，用 3 次改 1 次
3. 保存历史版本：改之前备份，方便回滚
4. 分享交流：看看别人的 Skills，互相学习

**写在最后**

Skills 不是写完就完事，是要让 AI 真正能"照着做"。

你写过 Skills 吗？遇到过什么问题？评论区聊聊。

**精选文章回顾**

- 炸裂！Hermes Agent 被指架构“复制”中国团队EvoMap！
- Hermes正在用“自进化”颠覆AI Agent生态！这份Hermes实战笔记帮你省下3小时踩坑时间
- 我用Coze做了一条36秒数字人口播视频，现在拆解它的自动流程和底层逻辑
- OpenCode OMO 深度解析——它不是插件，是一套 AI 开发团队的调度系统
- 为什么你的OpenCode越改越烂？SWE-CI给出了答案
	OpenCode铁三角选型指南，你真的需要全装吗？
	OpenCode铁三角：OpenSpec + Superpowers + OMO，从“随意编码”到“规范开发”的完整指南

Opencode Day20：干货必看！我用这套组合拳零手写代码上线小程序（附全流程）

Opencode Day19：有了Superpowers，我的OpenCode终于不“乱写”了

Opencode Day18：MiniMax出Skills了：前端、后端、安卓、iOS，一套技能全搞定