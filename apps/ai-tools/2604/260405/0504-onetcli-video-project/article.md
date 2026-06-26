---
title: "发现国人开源好项目：OnetCli —— Rust + GPUI 打造的一站式开发工具"
url: "https://www.toutiao.com/article/7625071950620131840/"
requestedUrl: "https://m.toutiao.com/is/5CB27RAcr_k/"
author: "开源技术爱好者"
coverImage: "imgs/img-001-c0257a62b5d749e4a4298a6609feb9d5-tplv-tt-shrink-.jpg"
publishedAt: "2026-04-05T09:07:06+08:00"
summary: "今天逛 GitHub 发现一个挺不错的国产开源项目，分享给大家。"
adapter: "generic"
capturedAt: "2026-04-05T12:43:34.145Z"
conversionMethod: "legacy:readability"
fallbackReason: "Readability/Turndown produced higher-quality markdown than Defuddle"
kind: "generic/article"
language: "zh-cn"
---

# 发现国人开源好项目：OnetCli —— Rust + GPUI 打造的一站式开发工具

今天逛 GitHub 发现一个挺不错的国产开源项目，分享给大家。

![](imgs/img-002-0f9a6cc35e7049569843b797e20a671a-tplv-tt-origin-.jpg)

## 项目简介

**OnetCli** (One Net Client) 是一个跨平台桌面客户端，主打「数据库、SSH、终端与 AI 一站式管理」。简单说，就是把开发者日常要用的好几个工具整合到了一起，不用来回切换。

项目基于 Zed 编辑器同款的 **GPUI** 框架构建，GPU 加速渲染，原生性能体验。

> 一句话：一个工具搞定数据库连接、SSH、终端和 AI 助手。

项目地址：
https://github.com/feigeCode/onetcli

![](imgs/img-003-0d8cc478743e40cfa7ca7c5d0c1a6c3f-tplv-tt-origin-.jpg)

## 功能一览

**多数据库支持**

支持几乎所有主流数据库：

-   PostgreSQL
-   MySQL
-   SQLite
-   SQL Server
-   Oracle
-   ClickHouse
-   DuckDB

![](imgs/img-004-04e575b108074af4ab7bed8f91fce851-tplv-tt-origin-.jpg)

不需要装多个客户端，一个 OnetCli 就够了。

**NoSQL 支持**

-   **Redis**：专用视图，支持键浏览、值查看、集群连接
-   **MongoDB**：集合浏览、文档查看、查询支持

![](imgs/img-005-0e6dfd04c2664ffb890a3e28435849ba-tplv-tt-origin-.jpg)

**SSH & SFTP & 终端**

-   集成 SSH 终端
-   SFTP 文件管理器
-   串口连接支持
-   内置本地多标签终端

![](imgs/img-006-6ba57ef75cc54d10bea4947228df1c4c-tplv-tt-origin-.jpg)

![](imgs/img-007-701160ecb8144cdca2b573d4cc124fec-tplv-tt-origin-.jpg)

**AI 助手整合**

这是我觉得比较实用的一个功能：

-   自然语言直接生成 SQL
-   自动解释复杂查询
-   BI 风格数据分析
-   直接生成图表

基于流式 LLM 集成，在应用内直接和 AI 对话处理数据，不用来回复制粘贴。

![](imgs/img-008-9ab6b4b77c804518a4091ea02106ed1d-tplv-tt-origin-.jpg)

**其他贴心功能**

-   **云端同步**：加密存储连接和设置，跨设备同步（AES-GCM + Ed25519）
-   **主题切换**：亮色 / 暗色模式
-   **国际化**：原生支持英文、简体中文、繁体中文

## 技术栈

<table><colgroup><col><col></colgroup><tbody><tr><td><p data-track="38"><strong>层级</strong></p></td><td><p data-track="39"><strong>技术选型</strong></p></td></tr><tr><td><p data-track="40">UI 框架</p></td><td><p data-track="41">GPUI（来自 Zed 编辑器）</p></td></tr><tr><td><p data-track="42">数据库</p></td><td><p data-track="43">tokio-postgres, mysql_async, rusqlite 等</p></td></tr><tr><td><p data-track="44">SSH/SFTP</p></td><td><p data-track="45">russh, russh-sftp</p></td></tr><tr><td><p data-track="46">终端</p></td><td><p data-track="47">alacritty_terminal</p></td></tr><tr><td><p data-track="48">AI</p></td><td><p data-track="49">llm-connector 流式输出</p></td></tr><tr><td><p data-track="50">加密</p></td><td><p data-track="51">aes-gcm, sha2, ed25519</p></td></tr></tbody></table>

整个项目全栈 Rust，追求原生性能。

## 平台支持

<table><colgroup><col><col><col></colgroup><tbody><tr><td><p data-track="54"><strong>平台</strong></p></td><td><p data-track="55"><strong>架构</strong></p></td><td><p data-track="56"><strong>说明</strong></p></td></tr><tr><td><p data-track="57">macOS</p></td><td><p data-track="58">aarch64, x86_64</p></td><td><p data-track="59">Metal 渲染</p></td></tr><tr><td><p data-track="60">Linux</p></td><td><p data-track="61">x86_64</p></td><td><p data-track="62">Vulkan 渲染</p></td></tr><tr><td><p data-track="63">Windows</p></td><td><p data-track="64">x86_64</p></td><td><p data-track="65">支持</p></td></tr></tbody></table>

已发布 v0.2.2 版本，可以直接到 Releases 下载预编译包。

## 关于开源协议

项目主协议采用 Apache 2.0 开源，但附加了一个补充许可证，增加了几个限制：

-   禁止二次分发转售作为独立产品
-   禁止基于此代码创建竞争性产品
-   禁止托管在未经授权的分发平台

这种方式其实在开源项目里也不算罕见，作者保留了一定权利，方便后续商业运作，感兴趣的同学可以自行阅读 LICENSE 文件。

## 体验地址

-   GitHub：https://github.com/feigeCode/onetcli
-   下载：https://github.com/feigeCode/onetcli/releases/tag/v0.2.2

## 聊聊想法

现在开发者工具其实很多，Navicat、DataGrip、TablePlus 都各有优势，但 OnetCli 这种「一站式整合」思路还是挺吸引人的：把数据库、SSH、终端、AI 放在同一个工作区，减少来回切换，效率确实会高一些。

特别是 AI 直接整合进数据库客户端，自然语言转 SQL，对于不熟悉复杂查询的开发者来说，门槛降低了不少。

另外，基于 Rust + GPUI 这个技术选型也很有意思，Zed 编辑器已经证明了 GPUI 的性能，现在有开源项目用它做开发工具，值得关注后续发展。

你用过哪些整合型开发工具？对于这种一站式方案你怎么看？欢迎留言讨论。

* * *

**更多效率工具推荐：**

-   [国产开源新星！比 Navicat 更轻量的数据库神器](https://www.toutiao.com/article/7624085040691036699/?log_from=534c1777b8ae9_1775350986829)
-   [告别臃肿的DataGrip！这开源数据库工具启动快3倍，内存直接砍半](https://www.toutiao.com/article/7619611279359050259/?log_from=4e059ac466147_1775351059930)
-   [告别 Navicat / DataGrip！这个开源数据库工具，轻量到离谱](https://www.toutiao.com/article/7619611279359050259/?log_from=4e059ac466147_1775351059930)