# Audiblez 项目详解

## 项目简介

**Audiblez** 是一个开源的电子书转有声书工具，可以将 `.epub` 格式的电子书转换为 `.m4b` 有声书，使用 **Kokoro-82M** 高质量语音合成模型。

## 核心特性

### 1. Kokoro-82M TTS 模型
- 仅 **82M 参数**，却能产生非常自然的语音
- Apache 许可证开源
- 训练数据少于 100 小时

### 2. 多语言支持（9种语言）
- 🇺🇸🇬🇧 英语（20+ voices）
- 🇪🇸 西班牙语
- 🇫🇷 法语
- 🇮🇳 印地语
- 🇮🇹 意大利语
- 🇯🇵 日语
- 🇧🇷 葡萄牙语
- 🇨🇳 中文（6 voices: zm_yunjian, zm_yunxi, zm_yunxia, zm_yunyang, zf_xiaobei, zf_xiaoni, zf_xiaoxiao, zf_xiaoyi）

### 3. 高性能
- **GPU (T4)**: ~5分钟完成《动物农场》（160,000字符），约600字符/秒
- **M2 MacBook Pro (CPU)**: ~1小时，约60字符/秒

### 4. 输出格式
- 支持输出 `.wav` 分章节文件
- 支持输出 `.m4b` 有声书（需ffmpeg）
- 可调节语速 0.5x - 2.0x

### 5. v4 新功能
- 🖥️ 图形界面（GUI）
- ⚡ CUDA GPU 加速
- 📚 更多语言支持
- 🎯 交互式章节选择

## 技术栈

- Python 3.10-3.12
- Kokoro TTS (kokoro==0.9.4)
- EbookLib (epub解析)
- spaCy (文本处理)
- FFmpeg (音频处理)
- wxPython (GUI)

## 使用方式

### 命令行
```bash
audiblez book.epub -v af_sky
```

### GUI
```bash
audiblez-ui
```

### GPU加速
```bash
audiblez book.epub -v af_sky --cuda
```

## 作者信息

- 作者: Claudio Santini
- 许可证: MIT
- 网站: https://claudio.uk
