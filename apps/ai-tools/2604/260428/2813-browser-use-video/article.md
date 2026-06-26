# Browser Use 文章内容

## 来源
- **平台**: GitHub
- **作者**: browser-use
- **链接**: https://github.com/browser-use/browser-use
- **Star**: 50,000+（热门AI项目）
- **协议**: MIT

## 标题
Browser Use - 让 AI Agent 自动操作浏览器

## 核心内容

### 是什么
Browser Use 是一个让网站对 AI Agent 可访问的开源项目。你只要给它一句话，它就能像真人一样自动操作浏览器。

### 核心功能

1. **自然语言驱动**
   - 给一句话，它就能自动操作浏览器
   - 支持 ChatGPT、Claude、Gemini 等主流 LLM
   - 自定义工具扩展

2. **浏览器自动化**
   - 自动点击、输入、截图
   - 维持浏览器状态和认证会话
   - CLI 快速迭代

3. **云端服务**
   - 隐身浏览器，反指纹检测
   - 代理轮换
   - 解决 CAPTCHAs
   - 1000+ 集成（Gmail、Slack、Notion 等）

4. **Claude Code 集成**
   - 安装 skill 后可直接在 Claude Code 中使用
   - AI 辅助浏览器自动化

### 变现思路

**自动化获客**：

1. **精准客户提取**
   - 去小红书/推特搜索特定话题帖子
   - 把博主 ID 提取到表格
   - 拿到精准客户名单

2. **留学行业**
   - 搜索"想去英国留学"的帖子
   - 提取博主信息
   - 卖给留学中介或自己做业务

3. **招聘、金融等**
   - 任何需要精准客户数据的行业
   - 自动化采集 + 结构化输出

### 使用方法

```bash
# 安装
uv init && uv add browser-use && uv sync
uvx browser-use install

# 快速开始
browser-use open https://example.com
browser-use click 5
browser-use type "Hello"
```

### 适用场景

1. **留学/移民获客**：搜索精准用户，卖给中介
2. **社交媒体采集**：小红书/推特用户数据
3. **竞品监控**：自动化监控竞争对手动态
4. **批量注册**：自动化账号注册

## 标签
#AI #BrowserAutomation #自动化获客 #爬虫 #AI获客 #留学 #ClaudeCode