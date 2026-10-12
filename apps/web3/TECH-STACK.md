# STEP 01 · Web3 后端 12 周技术栈梳理

> 配套可视化：[_ycards/tech-stack.svg](./_ycards/tech-stack.svg)（已嵌入 [step-1-scope.html](./step-1-scope.html)）
> 配套页面：[step-1-scope.html](./step-1-scope.html)（范围声明 STEP 01）
> 来源：基于 [step-1-scope.html](./step-1-scope.html) 第 188-205 行 "纳入与排除" 卡片梳理
> 编写原则：只列页面提到的 + 隐含依赖；不臆测 12 周外的额外栈

## 1. ✅ 纳入范围（必须练到极致）

| # | 技术 | 类别 | 12 周学习深度 |
|---|---|---|---|
| 1 | **Go 语言** | 后端语言 | 主语言 · 12 周核心 |
| 1.1 | **并发** | 后端语言 |  |
| 1.2 | **RPC** | 后端语言 |  |
| 1.3 | **数据库** | 后端语言 |  |
| 1.4 | **Docker** | 后端语言 |  |
| 1.5 | **CI/CD** | 后端语言 |  |
| 1.6 | **可观测性** | 后端语言 |  |
| 1.7 | **消息队列** | 后端语言 |  |
| 2 | **ethclient** | 区块链协议 | go-ethereum 客户端 |
| 2.1 | **交易** | 区块链协议 |  |
| 2.2 | **事件** | 区块链协议 |  |
| 2.3 | **重组** | 区块链协议 |  |
| 2.4 | **RPC 节点** | 区块链协议 |  |
| 2.5 | **测试网** | 区块链协议 |  |
| 2.6 | **主网/侧链** | 区块链协议 |  |
| 2.7 | **索引服务** | 区块链协议 |  |
| 3 | **Solidity** | Solidity 工具链 | 读懂 · 不写复杂 |
| 3.1 | **Foundry** | Solidity 工具链 |  |
| 3.2 | **OpenZeppelin** | Solidity 工具链 |  |
| 3.3 | **ether.js** | Solidity 工具链 |  |
| 3.4 | **web3.py** | Solidity 工具链 |  |
| 3.5 | **前端 SDK** | Solidity 工具链 |  |
| 3.6 | **钱包连接** | Solidity 工具链 |  |
| 3.7 | **合约读写** | Solidity 工具链 |  |
| 4 | **热冷分离** | 后端安全 | hot / cold wallet 分层 |
| 4.1 | **幂等设计** | 后端安全 |  |
| 4.2 | **对账** | 后端安全 |  |
| 4.3 | **重放保护** | 后端安全 |  |
| 4.4 | **签名校验** | 后端安全 |  |
| 4.5 | **白帽审计** | 后端安全 |  |
| 4.6 | **应急响应** | 后端安全 |  |
| 4.7 | **事件监控** | 后端安全 |  |

## 2. ❌ 主动排除（4 类）

| 排除类别 | 具体技术 | 排除理由 |
|---|---|---|
| **前端** | React · Vue | 用现成面板不自建 |
| **非 EVM 链** | Solana · Substrate | 不做生态兼容 |
| **算法竞赛** | LeetCode 刷题 | 12 周目标不考这个 |
| **L2 源码** | OP · Arbitrum · zkSync | 只做接口层了解 |

## 3. 🔍 隐含栈（页面未明说但必用）

虽然 STEP 01 没直接出现，但范围声明里"充值/提现/资金安全/可用"**隐含依赖**这些栈：

| 隐含技术 | 来源 | 备注 |
|---|---|---|
| 钱包连接 | "充值/提现" | MetaMask / WalletConnect v2 |
| 客户端 SDK | "前端面板" | wagmi / viem / web3-react |
| RPC 节点服务 | "RPC" | Alchemy / Infura / QuickNode / 自建 |
| 索引服务 | "事件订阅" | The Graph（subgraph 查询） |
| 测试网络 | Sepolia（来自别的页面 meta） | Sepolia / Base Sepolia / Holesky |
| 主网/侧链 | meta 暗示 | Ethereum / Base / Polygon / Arbitrum / OP |
| Python 工具 | 与 Go 互操作 | web3.py（脚本测试、bot） |
| JS 工具 | 与 wagmi 配套 | ethers.js（前端 SDK） |
| 容器化 | 后端服务部署 | Docker |
| CI/CD | 12 周交付 | GitHub Actions |
| 可观测性 | 后端标配 | OpenTelemetry / Grafana |
| 消息队列 | 事件处理 | Kafka / Redis Streams |

## 4. 🛠️ 教程自身的配套工具栈

页面用到的元工具（不算学习内容，只算配套）：

- 复盘模板：localStorage + Markdown
- 教程站点：Tailwind Play CDN + highlight.js
- 浏览器：MetaMask 连接（demo）
- 部署：tools.yy24365.com

## 5. 💡 关键洞察

读 STEP 01 时容易忽略的 3 件事：

1. "Go 后端"≠ 通用 Go：教程要的是"EVM 后端 Go"，重心是 `go-ethereum` 的客户端调用，不是 Web 框架。
2. "合约读写"≠ 写合约：明确说"读懂 + 调通"，所以 Foundry 是用来测/部署/调用，不是开发复杂业务合约。
3. "资金安全"是横切关注点：贯穿所有 4 类（Go / EVM / 合约 / 数据库），不是独立阶段 —— 这就是为什么 STEP 04 有专门安全维度。

## 6. 📊 一图速览（文字版）

```
                          ┌─────────────────────────┐
                          │     Web3 后端 12 周       │
                          └──────────┬──────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
       ┌──────┴──────┐       ┌───────┴───────┐       ┌──────┴──────┐
       │  Go 后端核心  │       │   EVM 协议层   │       │  Solidity  │
       │  语言 / RPC   │       │   交易/事件    │       │  Foundry    │
       │  并发 / 数据库 │       │   重组/finality│       │  OpenZeppelin│
       └──────┬──────┘       └───────┬───────┘       └──────┬──────┘
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     │
                          ┌──────────┴──────────┐
                          │  资金安全 · 横切关注点 │
                          │  热冷 / 幂等 / 对账   │
                          │  重放保护 / 签名校验   │
                          │  白帽审计 / 应急响应   │
                          └─────────────────────┘

排除：React/Vue（前端）、Solana/Substrate（非 EVM）、
     算法竞赛、Layer2 源码
```

## 7. 💡 隐含栈 & 解读

- 💡 隐含依赖：钱包连接（MetaMask/WalletConnect）· 客户端 SDK（wagmi/viem/ethers.js）· RPC 服务（Alchemy/Infura/QuickNode）· 索引（The Graph）
- 📌 教程本身工具：Tailwind Play CDN · highlight.js · localStorage · MetaMask 连接 demo
- 🔗 解读：资金安全是横切关注点，贯穿 4 个主列；不是独立阶段。

## 8. 🔄 同步方式

本文档与 SVG 图是**双向同步**的：

- 改 DATA 字典 → 重跑 `python3 _tech_stack_svg.py` → 双产物（SVG + MD）一次性更新
- 双产物任何一处被人手修改 → `--check` 模式可检测不一致

最后一次同步时间：见 SVG 内底部小注「svg 由 _tech_stack_svg.py 生成」
