# OpenGame 项目分析

## 项目基本信息

| 参数 | 值 |
|------|------|
| 项目名称 | OpenGame |
| 类型 | 开源 Agentic 游戏开发框架 |
| 来源 | CUHK MMLab |
| 论文 | arXiv:2604.18394 |

## 核心内容（用户指定）

一句话 prompt，直接生成"能玩"的完整网页游戏工程——不是零散代码片段，而是自带游戏引擎、实时循环、跨文件状态管理的一整套项目结构。

## 核心创新

### Game Skill（技能系统）
- **Template Skill**：从经验中构建项目骨架模板库
- **Debug Skill**：维护已验证的修复协议，系统性修复集成错误

### GameCoder-27B（核心模型）
三阶段训练管道：
1. 持续预训练
2. 监督微调
3. 基于执行基础的强化学习

### OpenGame-Bench（评估基准）
评估维度：
- Build Health（构建健康度）
- Visual Usability（视觉可用性）
- Intent Alignment（意图对齐）

通过无头浏览器执行和 VLM 评判进行评分。

## 游戏示例

| 游戏 | 类型 | 描述 |
|------|------|------|
| Marvel Avengers | 平台动作 | 选择超级英雄闯关 |
| Harry Potter | 卡牌对战 | 答题释放魔法 |
| K.O.F | 格斗答题 | 双人抢答物理题 |
| Hajimi Defense | 塔防 | 猫猫炮塔保卫金枪鱼 |
| StarWars | 射击RPG | 曼达洛人营救古古 |
| Squid Game | 反应生存 | 红绿灯红灯停绿灯行 |

## 技术栈

- **游戏引擎**：Phaser（HTML5游戏框架）
- **Agent 运行时**：Qwen-Code
- **模型**：GameCoder-27B

## 数据

- 150个多样化游戏 prompt
- 新 SOTA