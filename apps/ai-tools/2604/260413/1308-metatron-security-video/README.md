# METATRON - 本地 AI 渗透测试工具

## 项目简介

METATRON 是一款用本地 AI 模型串起整个渗透测试流程的开源工具。支持 nmap、whois、nikto 等侦察工具自动运行，本地 AI 分析漏洞，全程离线运行，不依赖任何云服务。

## 功能特性

- 🤖 AI 自动分析 - 输入目标，自动跑工具并分析漏洞
- 🔄 智能循环 - 信息不足时自动追加工具扫描
- 💾 本地存储 - 所有记录存在本地数据库
- 📊 报告导出 - 一键导出 PDF 和 HTML

## 适用场景

- 学习渗透测试
- 服务器安全体检
- 漏洞扫描与修复
- 安全研究

## 快速开始

```bash
# 克隆项目
git clone https://github.com/metatron

# 安装依赖
cd metatron

# 运行
python metatron.py --target <目标IP或域名>
```

## 相关资源

- GitHub: https://github.com/metatron
- 视频演示: docs/assets/metatron_final_with_subtitles.mp4
- 封面图: docs/assets/cover.png

## 视频内容

- 时长: 40秒
- 平台: 微信视频号 / 小红书 / 抖音
- 配音: zh-CN-YunjianNeural

---

*本项目使用 Remotion 框架制作*
