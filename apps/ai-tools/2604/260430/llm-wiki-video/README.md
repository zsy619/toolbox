# LLM Wiki 视频项目

## 项目概览

- **项目名称**: llm-wiki-video
- **来源**: https://github.com/nashsu/llm_wiki
- **GitHub星标**: 2800+
- **主题**: 增量构建结构化Wiki，替代传统RAG
- **主题风格**: tech-modern（科技现代风）
- **平台**: 微信视频号 / 小红书 / 抖音

## 规格参数

| 参数 | 值 |
|------|------|
| 分辨率 | 1080×1920（9:16竖屏） |
| 帧率 | 60fps |
| 视频时长 | 约50秒 |
| 音频语速 | 1.2x |
| 字幕 | ASS格式，72px，黄色，底部居中 |
| 字体 | PingFang SC |

## 核心卖点

1. **四信号知识图谱** — 直接链接×3.0、来源重叠×4.0、Adamic-Adar×1.5、类型亲和×1.0
2. **Louvain社区检测** — 自动发现知识簇，找到你没意识到的知识盲区
3. **Chrome网页剪藏** — 一键纳入知识库
4. **Obsidian兼容** — 三栏布局，颜值在线
5. **两步思维链摄入** — 先分析再生成，质量比传统RAG高得多
6. **深度研究** — LLM智能生成搜索主题，自动填补知识空白

## 文件清单

### 文档（docs/）
- [x] README.md（项目首页）
- [x] article.md（原始内容）
- [x] video-script.md（分镜脚本）
- [x] copy.md（营销文案集）
- [x] wechat-copy.md（公众号文案）
- [x] posting-guide.md（发布指南）
- [x] landing-page.html（落地页）
- [x] article-page.html（文章页）
- [x] wechat-page.html（微信适配页）
- [x] session-log.md（会话日志）
- [x] report.json（执行报告）

### 资源（docs/assets/）
- [ ] cover.png（竖屏封面 1080×1920）
- [ ] cover-xhs.png（小红书封面 1440×2560）
- [ ] cover-wechat.png（微信封面 900×383）

### 音频（audio/）
- [ ] neural_1_2x.m4a（配音）
- [ ] subtitles.ass（字幕）

### 视频（video-project/out/）
- [ ] final-with-subs.mp4（最终视频）

## 工作流程

1. Step 0: 创建文档 ✅
2. Step 1: 获取内容
3. Step 2: 分析内容
4. Step 3: 构建项目
5. Step 4: 生成文案
6. Step 5: 构建HTML
7. Step 6: 生成视觉
8. Step 7: 生成音频
9. Step 8: 生成字幕
10. Step 9: 质量检查
11. Step 10: 生成视频
12. Step 11: 生成报告
