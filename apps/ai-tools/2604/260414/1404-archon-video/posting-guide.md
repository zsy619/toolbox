# Archon - 多平台发布指南

## 📋 发布前检查清单

- [x] 视频渲染完成 (1080×1920, 60fps, 41.8秒)
- [x] 封面图生成 (docs/assets/cover.png)
- [x] 多平台文案准备 (copy.md)
- [x] 字幕文件生成 (subtitles.srt)

---

## 🐭 微信视频号

### 发布规范
- **分辨率**: 1080×1920 (竖屏)
- **时长**: 15秒-60秒（最佳30秒）
- **文件大小**: < 100MB
- **格式**: MP4 (H.264 + AAC)

### 发布步骤
1. 打开微信视频号官网
2. 点击「发表视频」
3. 选择文件 `archon-video/video-project/out/archon-wechat.mp4`
4. 填写标题: `开源首个AI编程Harness！让AI coding变得确定可重复`
5. 填写描述: `Archon - 首个开源AI编程Harness Builder。像Dockerfile改变基础设施、GitHub Actions改变CI/CD一样，Archon正在改变AI编程。`
6. 添加话题: #AI编程 #GitHub #开源 #Claude Code #程序员工具
7. 选择封面（可使用 docs/assets/cover.png）
8. 点击发布

### 发布文案
```
标题：开源首个AI编程Harness！让AI coding变得确定可重复

描述：
Archon - 首个开源AI编程Harness Builder。
像Dockerfile改变基础设施、GitHub Actions改变CI/CD一样，
Archon正在改变AI编程。

话题：#AI编程 #GitHub #开源 #Claude Code #程序员工具
```

---

## 📕 小红书

### 发布规范
- **分辨率**: 1080×1920 (竖屏) 或 1440×1920 (3:4)
- **时长**: 15秒-5分钟
- **文件大小**: < 300MB
- **格式**: MP4

### 发布步骤
1. 打开小红书 App 或网页版
2. 点击「+」发布笔记
3. 选择视频或直接上传
4. 选择文件 `archon-video/video-project/out/archon-xiaohongshu.mp4`
5. 编辑标题和正文

### 发布文案
```
标题：⚡ GitHub 15000+ Stars！首个开源AI编程Harness！

正文：
Archon - 首个开源AI编程Harness Builder！

当你让AI"修这个bug"，它可能跳过规划、忘记跑测试、
PR描述还可能乱写。每次运行结果都不一样。

Archon就是来解决这个问题的！

核心特性：
🔄 确定性工作流 - 同样的流程，每次都一样
🌳 Git Worktree 隔离 - 5个任务并行跑不冲突
⏱️ Fire and Forget - 丢给它任务，回来就是PR
🔧 YAML 流程编排 - 17个预置工作流，开箱即用

类比一下：
Dockerfile → 基础设施
GitHub Actions → CI/CD
Archon → AI编程工作流

标签：
#AI编程 #GitHub开源 #Claude Code #程序员工具 #编程效率 #AI助手 #工作流自动化 #开发神器
```

---

## 🎵 抖音 / 快手

### 发布规范
- **分辨率**: 1080×1920 (竖屏)
- **时长**: 15秒-3分钟
- **文件大小**: < 200MB
- **格式**: MP4

### 发布步骤
1. 打开抖音 App
2. 点击底部「+」拍摄按钮
3. 选择「上传」本地视频
4. 选择文件 `archon-video/video-project/out/archon-wechat.mp4`
5. 编辑标题和话题

### 发布文案
```
标题：GitHub 15000+ Stars！首个开源AI编程Harness！让coding确定可重复 🚀

描述：
Archon - 首个开源AI编程Harness Builder。
确定性工作流、Git Worktree隔离、Fire and Forget...
17个预置工作流，多平台适配。程序员必备！

话题：#AI编程 #GitHub开源 #Claude Code #程序员工具 #编程效率 #AI助手 #工作流自动化
```

---

## ▶️ YouTube

### 发布规范
- **分辨率**: 1080×1920 (竖屏) 或 1920×1080 (横屏)
- **时长**: 无限制（推荐8-15分钟）
- **格式**: MP4 (H.264)
- **码率**: 推荐 8-12 Mbps

### 发布步骤
1. 打开 YouTube Studio
2. 点击「创建」→「上传视频」
3. 选择文件 `archon-video/video-project/out/archon-youtube.mp4`
4. 填写标题: `GitHub 15000+ Stars! 首个开源 AI 编程 Harness! | Archon 教程`
5. 填写描述:

```markdown
GitHub: https://github.com/coleam00/Archon
官网: https://archon.diy/

Archon - 首个开源 AI 编程 Harness Builder！

当你去 AI "修一个 bug"，它可能跳过规划、忘记跑测试、
PR 描述还可能乱写。每次运行结果都不一样。

Archon 就是来解决这个问题的！

⏱️ 内容大纲：
00:00 - 问题引入：AI 编程的不确定性
00:09 - Archon 解决方案
00:15 - 核心类比：Dockerfile / Actions / Archon
00:21 - 核心特性详解
00:27 - 多平台支持
00:33 - 工作流示例
00:39 - 效果对比
00:45 - 结尾

#AI编程 #GitHub开源 #Claude Code #程序员工具
```

6. 添加标签: AI编程, GitHub, 开源, Claude Code, Archon, 编程效率
7. 选择封面（可使用 docs/assets/cover.png）
8. 设置为「面向儿童」否
9. 点击发布

---

## 📝 公众号

### 发布规范
- **格式**: 图文消息或视频消息
- **封面图**: 900×383 像素
- **视频**: 可嵌入微信视频号

### 发布文案
详见 `wechat-page.html` 公众号适配页

---

## 📊 发布时间建议

| 平台 | 最佳发布时间 | 备注 |
|------|-------------|------|
| 微信视频号 | 12:00-13:00, 20:00-22:00 | 通勤时间 + 晚间 |
| 小红书 | 18:00-22:00 | 晚间浏览高峰 |
| 抖音 | 12:00-14:00, 18:00-20:00 | 午休 + 通勤 |
| YouTube | 15:00-18:00, 20:00-23:00 | 晚间推荐更高 |
| 公众号 | 20:00-22:00 | 晚间阅读高峰 |

---

## 📈 发布后追踪

- [ ] 记录各平台链接
- [ ] 监控观看量 / 点赞数
- [ ] 收集评论反馈
- [ ] 48小时后复盘数据
