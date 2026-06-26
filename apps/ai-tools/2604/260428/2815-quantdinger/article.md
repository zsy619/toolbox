# QuantDinger 项目详解

## 项目简介

QuantDinger 是一款**自部署、本地优先的 AI 量化交易平台**，从研究到实盘全链路打通，覆盖加密货币、美股、外汇、预测市场。

## 核心功能

### 1. AI 市场分析
- 支持 OpenRouter/OpenAI/Gemini/DeepSeek 等多种 LLM 提供商
- 一键跨市场研究
- 分析历史记录存储，可复现、可对比

### 2. Python 策略开发
- 直接用 Python 写指标和策略
- AI 自然语言生成策略代码
- Indicator IDE 可视化图表

### 3. 回测与迭代
- 完整保存回测记录、交易明细、权益曲线
- 支持指标驱动和策略记录的回测
- 回测快照持久化，可复现

### 4. 实盘交易
- 统一执行层连接加密交易所
- Quick Trade 流程快速从分析到执行
- 支持自动/半自动策略工作流

### 5. 多市场覆盖
- 🪙 加密货币（现货+合约）
- 📈 美股（IBKR）
- 💱 外汇（MT5）
- 🔮 预测市场（Polymarket）

## 技术架构

- **部署**: Docker Compose，一键部署
- **数据库**: PostgreSQL（生产级）
- **缓存**: Redis
- **前端**: Prebuilt，开箱即用
- **Python**: 3.10+

## 适用人群

- 不想放弃数据控制权的量化交易者
- 希望用 AI 辅助研究的 Python 开发者
- 需要私有部署的中小团队
- 想做商业化交易产品的运营商

## 快速开始

```bash
git clone https://github.com/brokermr810/QuantDinger.git
cd QuantDinger
cp backend_api_python/env.example backend_api_python/.env
./scripts/generate-secret-key.sh
docker-compose up -d --build
```

访问 http://localhost:8888
登录: quantdinger / 123456

## 开源信息

- 许可证: Apache 2.0
- 版本: 3.0.3
- GitHub: https://github.com/brokermr810/QuantDinger
