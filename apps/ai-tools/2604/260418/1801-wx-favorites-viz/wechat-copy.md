# 公众号文案 - 微信收藏可视化

## 基本信息
- **标题**: 对 Claude Code 说一句，微信收藏自动变可视化报告
- **摘要**: 微信收藏了 1000+ 篇文章却从来不看？一个 Claude Code Skill 把它们全分析了一遍
- **标签**: 微信 / Claude Code / 数据可视化 / Python

---

## 正文

微信收藏夹吃灰了吗？

我收藏了 1000 多篇文章，从来没再看过第二眼。

今天分享一个 Claude Code Skill，叫"微信收藏可视化"，能让 Claude Code 自动把微信收藏变成交互式可视化报告。

### 一句话搞定

在 Claude Code 里输入：

> 微信收藏可视化

Claude 就会自动执行完整管线：密钥提取 → 数据库解密 → 数据解析 → 报告生成。全程不需要手动操作。

### 技术管线

整个流程分三步：

**第一步：frida 提取加密密钥**

微信 Mac 4.x 版的收藏数据存在 `favorite.db` 里，是 SQLCipher 4 加密的。密钥不存储在文件里，而是通过 `CCKeyDerivationPBKDF` 函数在运行时派生。

解决方案：用 frida hook 微信进程，捕获所有 PBKDF2 密钥派生调用。输出文件：`/tmp/wechat_frida_keys.log`

**第二步：AES-256-CBC 解密数据库**

拿到密钥后，用 PyCryptodome 解密。参数：AES-256-CBC、HMAC-SHA512、PBKDF2 256000 轮、page_size=4096。

解密后的数据库路径在 `~/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/<wxid>/db_storage/favorite/favorite.db`

**第三步：ECharts 生成交互报告**

用 Python 解析数据库（3.x 是 `FavItems` + `FavDataItem`，4.x 改为 `fav_db_item` 单表），生成单文件 HTML，内联 ECharts 5.x CDN 和 echarts-wordcloud 2.x。

### 报告功能

报告包含：

- 统计卡片：总数、跨越天数、日均、来源数
- 月度趋势折线 + 面积图
- 内容类型甜甜圈图
- 来源 Top 15 水平柱状图
- 星期 × 小时活跃热力图
- 标题 + 描述提取的词云
- 微信收藏标签云
- 可筛选可搜索可分页的收藏浏览区
- 点击查看详情、原文链接、来源、标签

### 踩坑记录

实现过程踩了 8 个坑，迭代 6 轮才跑通。关键坑：

- 微信 4.x 表结构变化（3.x 用 `FavItems`，4.x 改为 `fav_db_item`）
- 收藏密钥只在打开收藏页面时才加载，frida 运行期间必须手动打开
- SIP 阻止签名微信 App Store 版，需要复制到 ~/Desktop 再签名

### 开源地址

项目已开源在 GitHub：`zhuyansen/wx-favorites-report`

有技术背景的可以研究下实现细节，特别是 frida hook 和 SQLCipher 解密的部分。

---

*有收获的话，点个赞再走～*
