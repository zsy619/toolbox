# Maigret - 原始内容分析

## 项目概述
**Maigret** 是一个 OSINT（开源情报）工具，通过用户名在 3000+ 网站上收集个人信息档案。

**GitHub**: https://github.com/soxoj/maigret
**Stars**: 15,000+
**License**: MIT

## 核心功能

### 🎯 主要功能
1. **用户名搜索** - 在 3000+ 网站上同时搜索同一用户名
2. **递归扩散** - 发现新用户名自动继续搜索，构建关联网络
3. **信息提取** - 从个人资料页提取所有可用信息
4. **Tor/I2P 支持** - 支持暗网站点 (.onion)
5. **多格式报告** - HTML、PDF、JSON、CSV、XMind 脑图
6. **Web 界面** - 可视化图形界面浏览结果

### 🔧 技术特点
- **Python 3.10+** - 纯 Python 实现
- **无需 API 密钥** - 直接请求，不依赖第三方 API
- **自动更新数据库** - 每天自动从 GitHub 更新站点数据库
- **反封锁机制** - 检测并绕过封锁、审查和 CAPTCHA
- **Docker 支持** - 一键部署 CLI 或 Web 界面

## 使用方式

### 安装
```bash
pip install maigret
maigret YOUR_USERNAME
```

### 不安装？
- Telegram Bot: @maigret_search_bot
- Google Cloud Shell
- Replit / Colab / Binder

### 输出格式
- `--html` - HTML 报告
- `--pdf` - PDF 报告
- `--json` - JSON 导出
- `--csv` - CSV 导出
- `--graph` - D3 交互图表

## 使用场景
- 🔍 **溯源调查** - 追踪目标的网络足迹
- 🛡️ **蓝队防御** - 检测组织成员的暴露风险
- ⚔️ **红队对抗** - 收集目标公开信息
- 📱 **社媒分析** - 分析账号关联和分布

## 许可证
MIT License - 商业可用
