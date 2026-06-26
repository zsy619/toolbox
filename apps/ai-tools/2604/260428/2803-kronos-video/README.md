# Kronos 金融基础大模型 - 视频项目

## 项目概览

| 项目 | 内容 |
|------|------|
| **项目名称** | kronos-video |
| **主题** | Kronos：金融市场的 AI 基础设施大模型 |
| **来源** | GitHub - shiyu-coder/Kronos |
| **链接** | https://github.com/shiyu-coder/Kronos |
| **GitHub Stars** | 1.16万+ |
| **Hugging Face** | https://huggingface.co/NeoQuasar/Kronos-small |

## 核心内容

**Kronos** 是首个专门为金融市场打造的开源基础大模型，由清华团队研发，入选2026 AAAI顶会。

### 核心数据
- **训练数据**：45家交易所120亿条数据
- **覆盖范围**：币安、纽交所、纳斯达克等45家交易所
- **模型规格**：4个版本，从400万到4.99亿参数
- **准确率**：比主流时序模型高93%，比顶尖非预训练模型高87%

### 模型规格
| 模型 | 参数量 | 上下文长度 |
|------|--------|-----------|
| Kronos-mini | 4.1M | 2048 |
| Kronos-small | 24.7M | 512 |
| Kronos-base | 102.3M | 512 |
| Kronos-large | 499.2M | 512 |

### 核心能力
- 价格预测
- 波动率预判
- 全资产零样本直接使用
- 支持加密货币、股票、期货等

### 价格优势
| 方案 | 费用 | 说明 |
|------|------|------|
| Kronos | **免费** | MIT协议，100%开源 |
| 对冲基金定制模型 | 几百万 | 需要专业团队 |
| 彭博终端 | 2.4万美元/年 | 专业金融终端 |

## 视频规格

| 项目 | 规格 |
|------|------|
| **分辨率** | 1080×1920（竖屏） |
| **帧率** | 60fps |
| **时长** | 约55秒 |
| **主题** | tech-modern（科技现代风） |
| **配色** | 深空黑背景 + 科技蓝/活力绿强调 |

## 文件清单

```
kronos-video/
├── docs/
│   ├── README.md              # 项目首页
│   ├── article.md             # 原始内容
│   ├── video-script.md        # 视频脚本
│   ├── copy.md                # 营销文案集
│   ├── wechat-copy.md         # 公众号文案
│   ├── posting-guide.md       # 发布指南
│   ├── landing-page.html      # 落地页
│   ├── article-page.html      # 文章阅读页
│   ├── wechat-page.html       # 公众号适配页
│   ├── session-log.md         # Session 日志
│   ├── report.json            # 执行报告
│   └── assets/
│       ├── cover.png          # 封面图
│       ├── generate_cover.py  # 封面生成脚本
│       └── gen_subtitles.py   # 字幕生成脚本
├── audio/
│   ├── neural_1_2x.m4a        # 配音音频
│   └── subtitles.ass          # 字幕文件
└── video-project/
    ├── src/
    ├── out/
    └── public/
```

## 场景规划（8个场景）

| 场景 | 时间 | 内容 |
|------|------|------|
| 1. 开场 | 0-3s | 主标题：Kronos |
| 2. 问题 | 3-8s | 金融市场预测的痛点 |
| 3. 方案 | 8-15s | Kronos 解决方案 |
| 4. 数据 | 15-22s | 45家交易所120亿条数据 |
| 5. 模型 | 22-30s | 4个版本规格 |
| 6. 性能 | 30-40s | 准确率对比数据 |
| 7. 价格 | 40-48s | 价格优势对比 |
| 8. 结尾 | 48-55s | 开源免费 + CTA |

## 技术栈

- **Remotion**：视频渲染（60fps竖屏）
- **edge-tts**：微软神经网络配音（zh-CN-YunjianNeural）
- **FFmpeg**：音频处理、字幕烧录
- **Python/PIL**：封面图生成

## 相关链接

- GitHub: https://github.com/shiyu-coder/Kronos
- Hugging Face: https://huggingface.co/NeoQuasar
- Live Demo: https://shiyu-coder.github.io/Kronos-demo/
- 论文: https://arxiv.org/abs/2508.02739

---
*生成时间: 2026-04-25*
*版本: v1.0.0*