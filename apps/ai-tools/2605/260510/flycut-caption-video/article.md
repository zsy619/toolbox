# FlyCut Caption - 原始内容分析

## 项目概述
**FlyCut Caption** 是一款 AI 驱动的视频字幕编辑工具，专注于智能字幕生成、编辑和视频剪辑。

**官网**: https://flycut.dev
**GitHub**: https://github.com/x007xyz/flycut-caption (1.1.0)

## 核心功能

### 🎯 主要功能
1. **智能语音识别** - 基于 Whisper 模型的高精度语音转文字，支持多语言
2. **可视化字幕编辑** - 直观的字幕片段选择和删除界面
3. **实时视频预览** - 与字幕同步的视频播放器，支持区间播放
4. **多格式导出** - SRT、JSON 字幕格式和视频文件导出
5. **字幕样式定制** - 字幕字体、颜色、位置等样式自定义
6. **国际化支持** - 组件化设计，支持中文、英文、日语等语言包

### 🔧 技术特点
- **现代技术栈**: React 19 + TypeScript + Vite + Tailwind CSS
- **本地 AI 处理**: 使用 Hugging Face Transformers.js 在浏览器中运行 AI 模型
- **Web Workers**: ASR 处理在后台线程运行，不阻塞主界面
- **响应式设计**: 适配不同屏幕尺寸
- **组件化架构**: 模块化设计，易于维护和扩展

## 支持的格式
- **视频**: MP4, WebM, AVI, MOV
- **音频**: MP3, WAV, OGG

## 使用流程
1. 上传视频文件
2. 选择识别语言，AI 自动生成带时间戳的字幕
3. 编辑字幕 - 选择删除片段、批量操作、实时预览
4. 视频预览 - 自动跳过已删除片段
5. 字幕样式定制 - 字体、颜色、位置、背景
6. 导出结果 - SRT/JSON 字幕或带字幕的视频

## 视频处理功能
- 保持非删除片段
- 烧录字幕到视频
- 支持不同质量设置
- 多种格式输出

## 键盘快捷键
- `Space`: 播放/暂停
- `←/→`: 快退/快进 5 秒
- `Shift + ←/→`: 快退/快进 10 秒
- `↑/↓`: 调整音量
- `M`: 静音/取消静音
- `F`: 全屏

## API 参考

### FlyCutCaptionProps
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| config | FlyCutCaptionConfig | defaultConfig | 组件配置 |
| locale | FlyCutCaptionLocale | undefined | 自定义语言包 |
| onReady | () => void | - | 组件就绪时调用 |
| onFileSelected | (file: File) => void | - | 选择文件时调用 |
| onSubtitleGenerated | (subtitles: SubtitleChunk[]) => void | - | 生成字幕时调用 |
| onVideoProcessed | (blob: Blob, filename: string) => void | - | 视频处理完成时调用 |
| onError | (error: Error) => void | - | 发生错误时调用 |

## 技术架构
```
src/
├── components/     # UI 组件
├── hooks/         # 自定义 Hooks
├── services/      # 业务服务层
├── stores/        # 状态管理 (Zustand)
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
├── workers/       # Web Workers (ASR 处理)
└── locales/       # 国际化文件
```

## 安装使用
```bash
npm install @flycut/caption-react
import '@flycut/caption-react/styles'
```

## 许可证
MIT License
