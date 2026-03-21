import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

const StepCard: React.FC<{
  step: number;
  title: string;
  description: string;
  icon: string;
  frameRange: [number, number];
}> = ({ step, title, description, icon, frameRange }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [frameRange[0], frameRange[0] + 10, frameRange[1] - 10, frameRange[1]],
    [0, 1, 1, 0]
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        opacity,
        width: '80%',
        maxWidth: '800px',
      }}
    >
      <div
        style={{
          fontSize: '80px',
          marginBottom: '20px',
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          fontSize: '48px',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        步骤 {step}: {title}
      </h2>
      <p
        style={{
          fontSize: '24px',
          color: '#666',
          lineHeight: '1.5',
        }}
      >
        {description}
      </p>
    </div>
  );
};

export const CodexInstallVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f4f8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景动画 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at ${interpolate(frame, [0, durationInFrames], [50, 150])}% ${interpolate(frame, [0, durationInFrames], [50, 150])}%, #667eea 0%, #764ba2 100%)`,
          opacity: 0.1,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* 标题动画 */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '64px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 20, 30, durationInFrames - 20, durationInFrames], [0, 1, 1, 1, 0]),
        }}
      >
        如何安装 Codex
      </div>

      {/* 步骤卡片 */}
      <StepCard
        step={1}
        title="什么是 Codex"
        description="Codex 是一个强大的 AI 代码生成工具，可以帮助开发者更快地编写代码。它支持多种编程语言，能够理解自然语言描述并生成相应的代码。"
        icon="🤖"
        frameRange={[30, 60]}
      />

      <StepCard
        step={2}
        title="系统要求"
        description="Codex 需要 Node.js 16.0 或更高版本，以及 npm 或 yarn 包管理器。确保你的系统已安装这些依赖。"
        icon="💻"
        frameRange={[60, 90]}
      />

      <StepCard
        step={3}
        title="安装过程"
        description="1. 打开终端\n2. 运行命令: npm install -g codex-cli\n3. 等待安装完成\n4. 验证安装: codex --version"
        icon="📦"
        frameRange={[90, 130]}
      />

      <StepCard
        step={4}
        title="开始使用"
        description="安装完成后，你可以使用 codex 命令开始生成代码。例如：codex '创建一个 React 组件'"
        icon="🚀"
        frameRange={[130, 160]}
      />

      {/* 结束画面 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '48px',
          color: '#333',
          textAlign: 'center',
          opacity: interpolate(frame, [160, 170, 190, 200], [0, 1, 1, 0]),
        }}
      >
        <div style={{ marginBottom: '20px' }}>🎉 安装完成！</div>
        <div style={{ fontSize: '24px' }}>开始使用 Codex 提升你的开发效率吧！</div>
      </div>

      {/* 底部进度条 */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '10%',
          width: '80%',
          height: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '5px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(frame / durationInFrames) * 100}%`,
            height: '100%',
            backgroundColor: '#667eea',
          }}
        />
      </div>
    </div>
  );
};