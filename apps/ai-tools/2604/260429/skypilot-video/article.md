# SkyPilot - 管理所有AI计算

## 项目信息
- **项目名称**: skypilot-video
- **来源**: https://github.com/skypilot-org/skypilot
- **主题**: SkyPilot - 在任何AI基础设施上运行、管理和扩展AI工作负载

## 核心内容摘要

SkyPilot是一个在任何AI基础设施上运行、管理和扩展AI工作负载的系统。让AI团队通过简单界面在任何基础设施上运行作业，基础设施团队获得统一控制平面来管理任何AI计算。

## 主要特性

**1. 统一多集群、多云和多硬件**
- 一个界面使用预留GPU、Kubernetes集群、Slurm集群或20+云
- 灵活的GPU、TPU、CPU配置，带智能故障转移
- 团队部署和资源共享

**2. 最大化GPU集群利用率**
- Autostop：自动清理空闲资源
- Binpacking：共享集群上的工作负载打包
- 智能调度器：自动在最可用基础设施上调度

**3. 轻松使用Kubernetes进行AI**
- Slurm般的易用性，云原生稳健性
- 本地开发体验：SSH进入pod、同步代码、连接IDE
- 加速AI/ML速度的集群增强

**4. 支持的基础设施**
Kubernetes, Slurm, AWS, GCP, Azure, OCI, CoreWeave, Nebius, Lambda Cloud, RunPod, Fluidstack, Cudo, Digital Ocean, Paperspace, Cloudflare, Samsung, IBM, Vast.ai, VMware vSphere, Seeweb, Prime Intellect, Shadeform, Verda Cloud, VastData, Crusoe

## 快速开始

```bash
# 安装
uv pip install "skypilot[kubernetes,aws,gcp,azure,oci,nebius,lambda,runpod]"

# 创建任务文件
cat > my_task.yaml << 'EOF'
resources:
  accelerators: A100:8
num_nodes: 1
run: |
  python main.py
EOF

# 启动
sky launch my_task.yaml
```

## 新闻

- [2026年3月] Scaling Karpathy's Autoresearch: 16 GPU并行运行
- [2026年3月] SkyPilot Agent Skills: AI Agent的GPU访问和作业管理
- [2026年1月] Shopify案例研究: Shopify在SkyPilot上运行所有AI训练工作负载

---

**标签**: #SkyPilot #AI #云计算 #GPU #Kubernetes #多云 #开源 #MLOps #深度学习
