---
title: 让AI帮你选图表，98.2%准确率
author: 元曜科技
summary: 还在纠结用柱状图还是折线图？AntV Chart Visualization Skills 让AI自动选择最佳图表类型，174测试用例验证，98.2%准确率超越行业Baseline。
tags:
  - 数据可视化
  - AntV
  - AI工具
  - 图表生成
  - 开源
platform: wechat
date: 2026-04-22
---

# 让AI帮你选图表，98.2%准确率

> 「让数据说话——这是每个数据分析师的梦想。」

## 你是否也有这样的困扰？

每次做数据可视化都要纠结：
- 选柱状图还是折线图？
- 饼图和环形图哪个更合适？
- 散点图适合什么场景？

传统图表库总是在**灵活性和易用性**之间妥协。

## 解决方案：AntV Chart Visualization Skills

**AntV** 将数据可视化分为四大系列：

| 系列 | 说明 | 图表类型 |
|------|------|----------|
| 2系 | 统计图表 | 柱状、折线、饼图... |
| 6系 | 图分析 | 网络图、关系图 |
| 7系 | 地理分析 | 地图、热力图 |
| 8系 | 非结构化 | 词云、桑基图 |

## 6大AI技能

- **chart-visualization** — 26+图表类型智能生成
- **infographic-creator** — 50+信息图模板
- **antv-g6-graph** — G6图可视化代码
- **antv-g2-chart** — G2图表代码生成
- **antv-s2-expert** — 多维交叉分析表
- **icon-retrieval** — 图标SVG搜索

## 98.2% 准确率

通过**174个测试用例**验证：

| 模型 | G2准确率 | G6准确率 |
|------|----------|----------|
| qwen3-coder | 98.2% | 94.8% |
| Kimi-K2.5 | 97.7% | 96.9% |
| DeepSeek-V3.2 | 90.8% | 97.9% |
| Context7 Baseline | 80.5% | 79.2% |

**最高提升 17.7%**，让LLM达到生产级水平。

## 一行命令安装

```bash
npx skills add antvis/chart-visualization-skills
```

或 NPM 全局安装：
```bash
npm install -g @antv/chart-visualization-skills
```

---

GitHub搜索 **antvis/chart-visualization-skills**

MIT协议开源，免费商用。
