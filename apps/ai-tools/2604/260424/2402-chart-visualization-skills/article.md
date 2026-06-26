# AntV Chart Visualization Skills 内容分析

## 1. 项目概述

**AntV** 是蚂蚁集团于2017年开源的数据可视化品牌，将图形语法理论嵌入JavaScript语言，重新定义数据可视化。

### 核心理念

> Turning data into a visual language for better thinking.
> 将数据转化为视觉语言，实现更好的思考。

### 问题解决

传统图表库在**灵活性和易用性**之间存在权衡。AntV 将数据可视化技术分为四大系列：

| 系列 | 名称 | 说明 |
|------|------|------|
| 2系 | 统计图表 | 柱状图、折线图、饼图等 |
| 6系 | 图分析 | 网络图、关系图 |
| 7系 | 地理分析 | 地图、热力图 |
| 8系 | 非结构化数据 | 词云、桑基图 |

## 2. 六大核心技能

### 2.1 chart-visualization
- **功能**: 26+图表类型智能生成
- **特点**: 根据数据自动选择最佳图表类型
- **适用**: 时间序列、对比、关系、地理等可视化

### 2.2 infographic-creator
- **功能**: 50+信息图模板
- **特点**: 将数据、信息、知识转化为可视化语言
- **适用**: 列表、序列、层级、对比、关系、图表等

### 2.3 icon-retrieval
- **功能**: 图标SVG搜索
- **特点**: 关键词搜索，返回5个匹配图标
- **适用**: 信息图、Web开发、设计

### 2.4 narrative-text-visualization
- **功能**: T8语法文本可视化
- **特点**: 将非结构化数据转化为语义丰富的叙事报告
- **适用**: 数据分析报告、摘要、洞察文档

### 2.5 antv-s2-expert
- **功能**: S2多维交叉分析表
- **特点**: 透视表、表 sheets、高级分析组件
- **适用**: 业务分析、数据报表

### 2.6 antv-g6-graph
- **功能**: G6 v5图可视化代码生成
- **特点**: 10+布局算法、15+交互行为
- **适用**: 网络图、树图、流程图、思维导图

### 2.7 antv-g2-chart
- **功能**: G2 v5图表代码生成
- **特点**: 30+图表类型、Spec Mode最佳实践
- **适用**: 柱状图、折线图、散点图、热力图等

## 3. 技术亮点

### Harness Engineering

通过174个图表生成测试用例验证，显著优于Baseline方法：

| 模型 | G2准确率 | 提升 | G6准确率 | 提升 |
|------|----------|------|----------|------|
| qwen3-coder-480b | 98.2% | +17.7% | 94.8% | +15.6% |
| Kimi-K2.5 | 97.7% | +17.2% | 96.9% | +17.7% |
| GLM-5.1 | 93.6% | +13.1% | 92.8% | +13.6% |
| DeepSeek-V3.2 | 90.8% | +10.3% | 97.9% | +18.7% |
| Context7 Baseline | 80.5% | - | 79.2% | - |

**最高准确率98.2%**，让LLM达到生产级水平。

### 支持的库

- **G2 v5**: 30+图表类型
- **G6 v5**: 图可视化
- **S2**: 多维交叉分析表

## 4. 安装使用

### Claude Code
```bash
/plugin marketplace add antvis/chart-visualization-skills
```

### NPM
```bash
npm install -g @antv/chart-visualization-skills
```

### CLI
```bash
antv retrieve "bar chart" --library g2 --topk 10 --content
antv list --library g2 --category core
```

### API
```typescript
import { retrieve } from '@antv/chart-visualization-skills';
const skills = retrieve('bar chart', 'g2', 5);
```

## 5. 关键信息提取

### 标题
Chart Visualization Skills - 数据可视化的AI技能库

### 核心卖点
1. **26+图表类型** - 覆盖各类数据可视化场景
2. **98.2%准确率** - Harness Engineering验证
3. **多库支持** - G2、G6、S2
4. **开源MIT** - 免费商用

### 目标用户
- 数据分析师
- 前端开发者
- BI工程师
- 产品经理

### CTA
GitHub搜索 antvis/chart-visualization-skills
