# NeuTTS - 原始内容分析

## 项目概述
**NeuTTS** 是由 Neuphonic 开发的高质量开源本地 TTS 模型。基于 LLM backbone，支持即时语音克隆，可在手机、笔记本、树莓派等设备上本地运行。

**GitHub**: https://github.com/neuphonic/neutts
**Stars**: 开源项目
**许可**: Apache 2.0 / NeuTTS Open License

## 核心功能

### 🎯 主要功能
1. **即时语音克隆** - 仅需 3 秒音频即可创建自定义音色
2. **本地运行** - GGUF 格式量化，设备端部署
3. **多语言支持** - 英语、西班牙语、德语、法语
4. **实时生成** - 中端设备上实时合成
5. **内置水印** - Perth 感知水印，可追溯

### 🔧 技术特点
- **NeuTTS-Air**: ~360M 参数，最佳音质
- **NeuTTS-Nano**: ~120M 参数，最快速度
- **NeuCodec**: 50Hz 神经音频编解码器
- **Context Window**: 2048 tokens (~30秒音频)
- **格式**: GGUF 量化，ONNX 可选

## 性能基准

| 设备 | NeuTTS-Air | NeuTTS-Nano |
|------|------------|-------------|
| Galaxy A25 5G | 20 tokens/s | 45 tokens/s |
| AMD Ryzen 9 | 119 tokens/s | 221 tokens/s |
| iMac M4 | 111 tokens/s | 195 tokens/s |
| RTX 4090 | 16194 tokens/s | 19268 tokens/s |

## 安装使用

### 安装
```bash
pip install neutts
```

### 基本使用
```python
from neutts import NeuTTS

tts = NeuTTS(
    backbone_repo="neuphonic/neutts-nano",
    backbone_device="cpu",
    codec_repo="neuphonic/neucodec",
    codec_device="cpu"
)

wav = tts.infer(input_text, ref_codes, ref_text)
```

## 使用场景
- 🎙️ **语音助手** - 本地运行的 AI 助手
- 🧸 **儿童玩具** - 安全合规的语音交互
- 📱 **嵌入式应用** - 移动端语音功能
- 🔒 **隐私敏感** - 数据不上传的语音合成

## 许可证
- NeuTTS-Air: Apache 2.0
- NeuTTS-Nano: NeuTTS Open License 1.0
