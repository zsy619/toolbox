# DeerFlow 宣传视频 - Remotion 项目

这是一个使用 Remotion 创建的现代科技感宣传视频，展示字节跳动的开源 AI 工作流引擎 DeerFlow。

## 项目特点

- 🎬 **30秒专业视频**：完整的宣传视频结构
- 🚀 **现代科技感设计**：深色主题 + 霓虹色调
- ✨ **丰富的动画效果**：粒子、光效、数据可视化
- 🎵 **音频就绪**：预留音效和音乐轨道
- 📱 **响应式设计**：适配各种屏幕尺寸

## 视频结构

1. **开场 (0-5秒)**：震撼标题动画
2. **介绍 (5-15秒)**：DeerFlow 核心功能展示
3. **亮点 (15-25秒)**：技术特性和统计数据
4. **结尾 (25-30秒)**：行动号召和二维码

## 技术栈

- [Remotion](https://www.remotion.dev/) - React 视频创作框架
- TypeScript - 类型安全
- CSS-in-JS - 动态样式

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发预览

```bash
npm start
```

### 渲染视频

```bash
npm run build
```

## 自定义配置

### 修改视频时长
在 `src/DeerFlowVideo.tsx` 中调整 `totalFrames` 变量：
```typescript
const totalFrames = 30 * fps; // 30秒视频
```

### 修改颜色主题
在 `src/scenes/` 中的各个场景文件中调整颜色变量：
```typescript
const primaryColor = '#00ffcc';
const secondaryColor = '#0099ff';
const accentColor = '#cc00ff';
```

### 添加音频
1. 将音频文件放入 `public/` 目录
2. 在场景组件中使用 `<Audio>` 组件
3. 同步动画与音频时间线

## 场景组件

- `TitleScene.tsx` - 标题开场
- `IntroScene.tsx` - 项目介绍
- `FeaturesScene.tsx` - 功能展示
- `StatsScene.tsx` - 统计数据
- `EndScene.tsx` - 结尾号召

## 动画效果

### 内置动画
- 弹簧动画 (`spring`)
- 线性插值 (`interpolate`)
- 粒子系统
- 光效和阴影
- 数据可视化

### 自定义动画
每个场景都包含独立的动画逻辑，可以单独调整：
- 入场/出场动画
- 元素延迟
- 缓动函数
- 循环动画

## 部署和输出

### 视频格式
- 编码：H.264
- 分辨率：1920x1080 (可调整)
- 帧率：30fps
- 比特率：10Mbps

### 输出选项
```bash
# 渲染为 MP4
npm run build

# 渲染为 GIF
npx remotion render src/index.tsx deerflow-promo.gif

# 渲染为序列帧
npx remotion still src/index.tsx frame.png --frame=60
```

## 项目结构

```
deerflow-video/
├── src/
│   ├── scenes/          # 场景组件
│   │   ├── TitleScene.tsx
│   │   ├── IntroScene.tsx
│   │   ├── FeaturesScene.tsx
│   │   ├── StatsScene.tsx
│   │   └── EndScene.tsx
│   ├── DeerFlowVideo.tsx # 主视频组件
│   └── index.tsx        # 入口文件
├── public/              # 静态资源
├── package.json
├── tsconfig.json
├── remotion.config.ts   # Remotion 配置
└── README.md
```

## 扩展功能

### 添加新场景
1. 在 `src/scenes/` 中创建新组件
2. 在 `DeerFlowVideo.tsx` 中导入并添加到时间线
3. 调整场景切换时间点

### 国际化支持
1. 创建语言配置文件
2. 使用 Context 传递语言设置
3. 动态加载文本内容

### 动态数据
1. 连接到 API 获取实时数据
2. 使用 `useEffect` 获取数据
3. 在动画中显示动态值

## 性能优化

### 渲染优化
- 使用 `React.memo` 避免不必要的重渲染
- 优化粒子数量
- 使用 CSS 变换代替布局变化

### 内存管理
- 清理未使用的动画
- 避免内存泄漏
- 使用性能监控

## 许可证

MIT License - 自由使用和修改

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 相关链接

- [DeerFlow GitHub](https://github.com/bytecodealliance/deerflow)
- [Remotion 文档](https://www.remotion.dev/docs)
- [字节跳动开源](https://opensource.bytedance.com/)