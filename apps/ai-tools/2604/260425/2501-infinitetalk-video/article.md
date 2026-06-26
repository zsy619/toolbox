---
title: "InfiniteTalk - 无限时长说话视频生成"
summary: "InfiniteTalk稀疏帧视频配音框架，支持无限时长生成，输入视频和音频即可生成口型准确的头部摆动、身体姿势和面部表情与音频一致的新视频。"
tags:
  - InfiniteTalk
  - AI视频
  - 视频配音
  - 数字人
  - Wan2.1
platform: all
source: https://github.com/MeiGen-AI/InfiniteTalk
---

# InfiniteTalk - 无限时长说话视频生成

## 项目概述

**InfiniteTalk** 是美沿 AI 团队开发的稀疏帧视频配音框架，支持无限时长生成。

> **一句话理解**：输入一段视频和一段音频，生成口型准确、头部摆动和表情都与音频节奏一致的新视频。

## 核心功能

### 1. 稀疏帧视频配音 (Sparse-frame Video Dubbing)

输入一段视频和一段音频，生成口型准确的新视频。

**与传统工具的区别**：
- 不仅同步口型
- 还让头部摆动、身体姿势和面部表情与音频节奏保持一致

### 2. 无限时长生成 (Infinite-Length Generation)

支持生成超长时长的视频，**打破了许多同类 AI 工具只能生成几秒钟短片的限制**。

### 3. 静态照片说话 (Image-to-Video)

只需一张人物照片和一段音频，即可生成该人物说话的动画视频。

### 4. 高稳定性

相比之前的模型（如 MultiTalk）：
- 更好地保持身份一致性
- 减少手部或身体的扭曲变形

## 技术亮点

- 基于 **Wan2.1 基础模型**开发
- 针对音频驱动任务进行了专门的权重优化
- 支持 **480P 和 720P** 分辨率
- 提供 **Gradio** 网页演示界面
- 提供 **ComfyUI** 工作流节点支持

## 适用场景

| 场景 | 说明 |
|------|------|
| 视频自媒体/搬运 | 将外语视频翻译后进行配音，同步口型，像母语播报 |
| 虚拟数字人 | 制作 AI 讲解员、虚拟主播，快速产出播报内容 |
| 影视后期 | 针对拍摄好的素材进行小范围的台词修改和口型订正 |

## 相关链接

- GitHub: https://github.com/MeiGen-AI/InfiniteTalk
- Hugging Face: https://huggingface.co/MeiGen-AI/infiniteTalk
- 论文: https://arxiv.org/abs/2508.14033