# TRELLIS.2 - 微软 3D 生成大模型

## 项目信息
- **项目名称**: trellis-2-video
- **来源**: https://github.com/microsoft/TRELLIS.2
- **主题**: 微软TRELLIS.2大型3D生成模型，4B参数，O-Voxel稀疏体素结构，图像转3D

## 核心内容摘要

TRELLIS.2 是微软发布的最新SOTA大型3D生成模型，拥有40亿参数，专为高保真图像转3D生成设计。

### 主要特性

**1. 高质量、高分辨率、高效率**
- 40亿参数模型，使用原生DiT生成高分辨率完全纹理化3D资产
- Sparse 3D VAE 16×空间下采样编码到紧凑潜在空间
- 512³: ~3秒 (2s+1s)
- 1024³: ~17秒 (10s+7s)
- 1536³: ~60秒 (35s+25s)

**2. 任意拓扑处理**
O-Voxel表示打破了等值面的限制，稳健处理复杂结构无损耗转换：
- ✅ 开放曲面（服装、树叶）
- ✅ 非流形几何
- ✅ 内部封闭结构

**3. 丰富纹理建模**
超越基础颜色，建模任意表面属性包括：
- Base Color（基础颜色）
- Roughness（粗糙度）
- Metallic（金属度）
- Opacity（透明度）
支持逼真渲染和透明度支持

**4. 极简处理**
数据处理简化实现即时转换，完全无需渲染和优化：
- <10秒（单CPU）：纹理网格 → O-Voxel
- <100毫秒（CUDA）：O-Voxel → 纹理网格

### 技术架构

**O-Voxel（有序体素）**
一种新型"无场"稀疏体素结构，用于重建和生成具有复杂拓扑、清晰特征和完整PBR材质的任意3D资产。

**Sparse 3D VAE**
16×空间下采样，将3D资产编码到紧凑潜在空间。

**Pretrained Model**
TRELLIS.2-4B 可在 Hugging Face 获取：
https://huggingface.co/microsoft/TRELLIS.2-4B

### 使用方式

```python
from trellis2.pipelines import Trellis2ImageTo3DPipeline

pipeline = Trellis2ImageTo3DPipeline.from_pretrained("microsoft/TRELLIS.2-4B")
pipeline.cuda()
mesh = pipeline.run(image)[0]
```

### 路线图
- [x] 论文发布
- [x] 发布图像转3D推理代码
- [x] 发布预训练模型 (4B)
- [x] Hugging Face Spaces演示
- [x] 发布形状条件纹理生成推理代码
- [x] 发布训练代码

---

**标签**: #3D生成 #AI #微软 #开源 #TRELLIS #O-Voxel #PBR #计算机图形学 #深度学习 #HuggingFace
