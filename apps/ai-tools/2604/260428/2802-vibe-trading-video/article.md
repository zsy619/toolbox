# Vibe-Trading - AI 量化交易智能体

## 项目概览

- **项目名称**: Vibe-Trading (Your Personal Trading Agent)
- **GitHub**: https://github.com/HKUDS/Vibe-Trading
- **Stars**: 71 Skills / 29 Trading Teams / 27 Tools
- **主题**: AI 驱动的多智能体量化交易工作台

## 核心内容

这不仅仅是一个对话框，底层是一套多智能体协作网络。

### 多智能体协作网络
- **29 种 AI 交易团队配置**：预设投资、交易、风控等多种团队
- **71 种金融分析技能**：覆盖各大市场的 64 种金融分析技能
- **5 个数据源**：A股、港美股、加密货币、期货、外汇

### 内部辩论设计
面对具体行情，系统调度：
- 基本面分析师
- 技术派
- 风控总监

交叉评估，结合资金费率、清算热力图等指标，给出综合参考。

### 实用特性
- **技能库全面**：涵盖各大市场的 64 种金融分析技能
- **试错成本低**：用大白话就能驱动复杂的投研流程
- **工具链友好**：支持 MCP 协议，可直接接入 OpenClaw、Cursor 或 Claude Desktop

### 安装方式
```bash
pip install vibe-trading-ai
vibe-trading-mcp  # 启动 MCP 服务器
```