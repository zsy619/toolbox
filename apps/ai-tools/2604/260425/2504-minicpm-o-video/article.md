---
title: "MiniCPM-o - 端侧多模态大模型新标杆"
summary: "MiniCPM-o 是从 MiniCPM-V 升级而来的端侧多模态大模型系列，支持图像、视频、文本及音频输入，9B参数的MiniCPM-o 4.5在视觉、语音及全双工多模态实时流式交互方面接近 Gemini 2.5 Flash。"
tags:
  - MiniCPM-o
  - 多模态大模型
  - 端侧AI
  - 全双工交互
  - 声音克隆
platform: all
source: https://github.com/OpenBMB/MiniCPM-o
---

# MiniCPM-o - 端侧多模态大模型新标杆

## 项目概述

**MiniCPM-o** 是从 MiniCPM-V 升级而来的最新一代端侧多模态大模型（MLLM）系列。

> **一句话理解**：支持图像、视频、文本及音频输入，端到端提供高质量文本与语音输出的端侧多模态大模型。

## 核心摘要（必含）

### MiniCPM-o 4.5：🔥🔥🔥 最新最强模型

- **9B 参数**，在视觉、语音及全双工多模态实时流式交互方面**接近 Gemini 2.5 Flash**
- **边看、边听、边说**：全双工多模态实时对话，输出流（语音和文本）与实时输入流（视频和音频）互不阻塞
- **声音克隆**：支持更自然、更具表现力且更稳定的中英双语实时交互
- 增强的视觉能力：出色的 OCR 能力、低幻觉率、多语言支持
- llama.cpp-omni 推理框架 + WebRTC Demo，Mac 等端侧设备本地运行

### MiniCPM-V 4.0：⭐️⭐️⭐️ 高效模型

- **4B 参数**，在 OpenCompass 图像理解榜单中**超越 GPT-4.1-mini-20250414**
- 轻量级参数规模，是**手机端侧部署的理想选择**

## 技术亮点

| 技术 | 说明 |
|------|------|
| 端到端 Omni-modal 架构 | SigLip2 + Whisper-medium + CosyVoice2 + Qwen3-8B |
| 全双工实时流 | 9B 参数，接近 Gemini 2.5 Flash |
| 语音能力 | 中英双语，语音克隆 |
| OCR 能力 | 状态-of-the-art 性能 |
| 多语言支持 | 30+ 语言 |

## 相关链接

- GitHub: https://github.com/OpenBMB/MiniCPM-o
- Hugging Face: https://huggingface.co/openbmb/MiniCPM-o-4_5
- 24389 Stars · 开源项目