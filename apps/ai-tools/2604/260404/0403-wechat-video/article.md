---
title: "一行命令，干掉 Mac 上那些付费清理软件 | Mole"
url: "https://mp.weixin.qq.com/s/uboD_ODEDpcauhgXuXsKDA"
requestedUrl: "https://mp.weixin.qq.com/s/uboD_ODEDpcauhgXuXsKDA"
author: "澄海同学"
coverImage: "https://mmbiz.qpic.cn/mmbiz_jpg/vrkP71yia43tNIRSaap8AcXWhxaHrwXdYTQDfUVrjTRaLTaoticohya8JjwlhPcSEE2R8UgmXrSGN9OcfxjV6qbjM312PFGsgnlnMfb2o51UQ/0?wx_fmt=jpeg"
siteName: "微信公众平台"
adapter: "generic"
capturedAt: "2026-04-04T06:37:43.599Z"
conversionMethod: "defuddle"
kind: "generic/article"
---

# 一行命令，干掉 Mac 上那些付费清理软件 | Mole

原创 澄海同学 *2026年4月2日 11:56*

## 现状

| 收费软件 | 价格 | 状态 |
| --- | --- | --- |
| CleanMyMac | ¥199 / 年 | 🗑️ 替换 |
| DaisyDisk | ¥68 | 🗑️ 替换 |
| iStat Menus | ¥86 | 🗑️ 替换 |
| AppCleaner | 免费但有局限 | 🗑️ 替换 |
| **Mole** | **¥0 永久免费** | ✅ 推荐 |

你的 Mac 是不是又卡了？

打开"关于本机"一看，256GB 的硬盘只剩 20GB。你打开 App Store，搜索"清理"，映入眼帘的是 CleanMyMac 的年费订阅—— **¥199/年** 。

再看看 DaisyDisk 的磁盘分析，iStat Menus 的系统监控，AppCleaner 的应用卸载……一套下来，你的 Mac 还没清理干净，钱包先瘦了。

**今天介绍一个开源工具，一个顶四个，而且完全免费。**

---

## Mole 是什么

Mole 是一个 macOS 命令行工具，GitHub 上已经拿下 **45000+ Star** 。

它把系统清理、应用卸载、磁盘分析、性能监控这些散落在各个付费软件里的能力，统一收进了一个命令 `mo` 里。

一行安装：

```
brew install mole
```

没有 Homebrew 也行：

```
curl -fsSL https://raw.githubusercontent.com/tw93/mole/main/install.sh | bash
```

装完就能用。没有注册，没有弹窗，没有"试用期还剩 3 天"。

---

## 它能干什么

![what](https://mmbiz.qpic.cn/sz_mmbiz_png/vrkP71yia43sOwVmDkYqSxkcW6R4HbekDMibtXwTSc8IxicrLtyOS7omWw6USMWxiazWhTD29tT03hRVTUUF2ndWvEicGRGrnp4bbOxXJZ4lpYWU/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

what

### 🧹 清理垃圾 — mo clean

缓存、日志、浏览器数据，一键扫完。README 的示例里，一次清理释放了 **95.5GB** 。对，你没看错。

---

![clean](https://mmbiz.qpic.cn/sz_mmbiz_png/vrkP71yia43t9loicKk45loGNa1mnwOHOf9O37dHr5YFyMK2NeKuNS3hicwKxiaEBYnH1kdK2Kt0gbfrlbm0hxlQQuAG8icPMA6mReCASC8p9X8c/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1)

clean

### 🗑️ 卸载应用 — mo uninstall

不是把.app 拖进废纸篓那种假卸载。Mole 会在 **12+ 个位置** 搜索 **52+ 种关联文件类型** ，连残留配置都给你刨干净。

---

![uninstall](https://mmbiz.qpic.cn/sz_mmbiz_png/vrkP71yia43uxHkzhDOYHyRxJicKPgGmyhrC2P9GjIVwfic1HQSBVdzYSYLlEkMXCB989F3uNTz9QbZc6aSzTqKYtjTH3bPuIdtLXcia2BRxRgg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2)

uninstall

### 📊 磁盘分析 — mo analyze

直观展示磁盘空间占用，支持 `--json` 输出，方便脚本集成。你的硬盘到底被谁吃了，一目了然。

---

analyze

### 📈 系统状态 — mo status

CPU、内存、磁盘、温度、I/O 负载，实时监控并计算健康评分。谁说命令行不能好看？

---

![status](https://mmbiz.qpic.cn/sz_mmbiz_png/vrkP71yia43soPcibYJsAo6I21ibEDs1Gdl0sd7MldlnibZ7JDSoeCr91GVaEfOY0qFUcdFrJoo6TtqrOHH7kIricEo89L40LrtMu2xN7c71N9yc/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3)

status

### 🧑💻 构建产物清理 — mo purge

开发者福音。 `node_modules` 、 `build` 、 `target` 这些吃硬盘的大户，一扫而光。源码毫发无损。

---

![purge](https://mmbiz.qpic.cn/mmbiz_png/vrkP71yia43t0n3dhCxPWwTjk7BCHG3r0alYvODN281f2cevblr93pfDyT6Dpv3NzDjkxLe3or6cN0sUDr4zhSL1qBqH9DAb6DlRFbcx0Pek/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=4)

purge

### 🔧 系统优化 — mo optimize

刷新系统数据库和服务，让 Mac 重新丝滑。

![optimize](https://mmbiz.qpic.cn/sz_mmbiz_png/vrkP71yia43t2D5Tiaq0XvYVo2yxCFT1XKJ95wQlLvZOndhn9iaUY7fWMxGrAmaXpzLBnjkJsBKspbDN7nbfOQjawxx3sUpCwg3HCmpGujAYFo/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=5)

optimize

### 📦 安装包清理 — mo installer

找到并清除旧的安装包文件，释放被遗忘的空间。

---

## 为什么推荐它

```
Before Mole                    After Mole
──────────                     ───────────

┌────────────────┐             ┌────────────────┐
│ ██████████████ │ 95% Used    │ ████████░░░░░░ │ 58% Used
│ ██████████████ │             │ ████████░░░░░░ │
│ ██████████████ │             │ ░░░░░░░░░░░░░░ │
│ ██████████████ │             │ ░░░░░░░░░░░░░░ │
│ █████████░░░░░ │             │ ░░░░░░░░░░░░░░ │
└────────────────┘             └────────────────┘
 12 GB Free                     195 GB Free

😰 "又要买 iCloud…"            😎 "再战三年。"
```

**安全第一。** 这是我最看重的一点。Mole 内置路径校验和保护目录机制，所有破坏性操作都支持 `--dry-run` 预览。操作日志记录在 `~/Library/Logs/mole/operations.log` ，出了问题可以溯源。这不是那种"一键清理然后系统崩了"的玩具。

**够轻。** 纯命令行，没有花里胡哨的 GUI，不常驻后台，不偷偷吃内存。用完即走。

**够全。** CleanMyMac + AppCleaner + DaisyDisk + iStat Menus，四合一。

**够开放。** MIT 协议，代码全部开源。支持 Vim 键位导航，支持 Raycast/Alfred 快捷启动，支持 Shell 补全，甚至支持 Touch ID 鉴权 sudo 操作。

---

## 适合谁用

- ✅ 受够付费订阅的 Mac 用户
- ✅ 日常使用终端的开发者
- ✅ 硬盘告急需要快速释放空间的人
- ✅ 想要轻量监控但不想装 iStat 的用户
- ✅ 信仰开源、拒绝黑盒的技术人

---

## 写在最后

Mole 的作者是 **Tw93** （同时也是 Pake 的作者），在开源社区一直以"用简单的方式解决真实问题"著称。

一个 `brew install mole` ，可能就省下了你每年几百块的软件订阅费。

> **GitHub 地址** ：https://github.com/tw93/mole
>
> ⭐ 45,000+ Star | 📄 MIT License | 🍎 macOS 专属

---

**你的 Mac，值得一次真正的深度清洁。**