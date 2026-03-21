import React, { useState, useMemo } from 'react';

interface KnowledgeItem {
  id: number;
  category: string;
  title: string;
  content: string;
  example?: string;
  tags: string[];
  isHighFreq: boolean; // High frequency in Gaokao
}

const DATASET: KnowledgeItem[] = [
  // --- 基础概念 (1-10) ---
  {
    id: 1,
    category: "基础概念",
    title: "定义与一般式",
    content: "形如 y = ax² + bx + c (a ≠ 0) 的函数。a决定开口，b决定对称轴，c决定y轴截距。",
    example: "若 y=(m-2)x² + 3x - 1 是二次函数，则 m ≠ 2。",
    tags: ["定义", "基础"],
    isHighFreq: false
  },
  {
    id: 2,
    category: "基础概念",
    title: "顶点式",
    content: "y = a(x-h)² + k。顶点坐标为 (h, k)，对称轴 x=h。",
    example: "y = 2(x-1)² + 3 的顶点是 (1, 3)。",
    tags: ["解析式", "顶点"],
    isHighFreq: true
  },
  {
    id: 3,
    category: "基础概念",
    title: "两根式 (交点式)",
    content: "y = a(x-x₁)(x-x₂)。x₁, x₂ 是抛物线与 x 轴的两个交点横坐标。",
    example: "已知抛物线经过 (1,0) 和 (3,0)，设 y=a(x-1)(x-3)。",
    tags: ["解析式", "根"],
    isHighFreq: true
  },
  {
    id: 4,
    category: "基础概念",
    title: "对称轴公式",
    content: "x = -b / 2a。是研究单调性、最值的核心依据。",
    tags: ["性质", "对称轴"],
    isHighFreq: true
  },
  {
    id: 5,
    category: "基础概念",
    title: "判别式 Δ",
    content: "Δ = b² - 4ac。Δ > 0 两个交点；Δ = 0 一个交点（切点）；Δ < 0 无交点。",
    tags: ["性质", "根"],
    isHighFreq: true
  },

  // --- 区间最值 (11-20) ---
  {
    id: 11,
    category: "区间最值",
    title: "定轴定区间",
    content: "直接判断对称轴是否在区间内。若在，顶点为最值；若不在，端点为最值。",
    example: "y=x²-2x在[0,3]上，对称轴x=1在区间内，min=f(1)。",
    tags: ["最值", "基础"],
    isHighFreq: false
  },
  {
    id: 12,
    category: "区间最值",
    title: "轴动区间定 (含参分类讨论)",
    content: "对称轴 x = -a 含参。需讨论：1. 轴在区间左侧；2. 轴在区间内；3. 轴在区间右侧。",
    example: "求 f(x)=x²-2ax+1 在 [-1, 1] 上的最小值。",
    tags: ["最值", "分类讨论"],
    isHighFreq: true
  },
  {
    id: 13,
    category: "区间最值",
    title: "轴定区间动 (滑动区间)",
    content: "区间 [t, t+1] 随 t 变化。比较区间中点与对称轴的位置关系。",
    example: "求 f(x)=x² 在区间 [t, t+1] 上的最大值。",
    tags: ["最值", "分类讨论"],
    isHighFreq: true
  },

  // --- 根的分布 (21-30) ---
  {
    id: 21,
    category: "根的分布",
    title: "两根均大于 k",
    content: "需满足：1. Δ ≥ 0; 2. 对称轴 > k; 3. f(k) > 0 (当a>0)。",
    tags: ["根分布", "不等式"],
    isHighFreq: true
  },
  {
    id: 22,
    category: "根的分布",
    title: "两根均小于 k",
    content: "需满足：1. Δ ≥ 0; 2. 对称轴 < k; 3. f(k) > 0 (当a>0)。",
    tags: ["根分布", "不等式"],
    isHighFreq: true
  },
  {
    id: 23,
    category: "根的分布",
    title: "两根在区间 (m, n) 内",
    content: "1. Δ ≥ 0; 2. m < 对称轴 < n; 3. f(m)>0, f(n)>0 (a>0)。",
    tags: ["根分布", "高频"],
    isHighFreq: true
  },
  {
    id: 24,
    category: "根的分布",
    title: "一根大于 k，一根小于 k",
    content: "只需满足 f(k) < 0 (当a>0)。无需判别式，因为此时必有 Δ > 0。",
    example: "若 x²+ax-2=0 一正根一负根，则 f(0)=-2 < 0 恒成立。",
    tags: ["根分布", "技巧"],
    isHighFreq: true
  },

  // --- 恒成立与存在性 (31-40) ---
  {
    id: 31,
    category: "恒成立问题",
    title: "f(x) ≥ 0 在 R 上恒成立",
    content: "a > 0 且 Δ ≤ 0。",
    example: "x²+ax+1 ≥ 0 恒成立 -> Δ = a²-4 ≤ 0 -> -2 ≤ a ≤ 2。",
    tags: ["恒成立", "判别式"],
    isHighFreq: true
  },
  {
    id: 32,
    category: "恒成立问题",
    title: "f(x) ≤ 0 在 R 上恒成立",
    content: "a < 0 且 Δ ≤ 0。",
    tags: ["恒成立"],
    isHighFreq: true
  },
  {
    id: 33,
    category: "恒成立问题",
    title: "区间恒成立 (分离参数法)",
    content: "若 f(x) > a 在区间 D 恒成立，则 a < f(x)min。",
    example: "x²-2x > a 在 [1,2] 恒成立 -> a < (x²-2x)min = -1。",
    tags: ["恒成立", "最值"],
    isHighFreq: true
  },
  {
    id: 34,
    category: "存在性问题",
    title: "存在 x 使 f(x) > a",
    content: "转化为 a < f(x)max。",
    tags: ["存在性", "最值"],
    isHighFreq: false
  },

  // --- 图像变换与综合 (41-50) ---
  {
    id: 41,
    category: "综合应用",
    title: "绝对值函数 y=|f(x)|",
    content: "将 x 轴下方的图像翻折到 x 轴上方。常考零点个数问题。",
    example: "讨论方程 |x²-1| = k 的根的个数。",
    tags: ["翻折", "绝对值"],
    isHighFreq: true
  },
  {
    id: 42,
    category: "综合应用",
    title: "复合函数单调性",
    content: "同增异减。y = f(g(x))，需分析内层 g(x) 和外层 f(u) 的单调性。",
    example: "求 y = log₂(x²-2x) 的单调增区间。",
    tags: ["复合函数", "单调性"],
    isHighFreq: true
  },
  {
    id: 43,
    category: "综合应用",
    title: "韦达定理应用",
    content: "x₁ + x₂ = -b/a, x₁x₂ = c/a。常用于弦长公式 |AB| = √[1+k²]·|x₁-x₂|。",
    example: "直线 y=x 与抛物线交于A,B，求|AB|。",
    tags: ["解析几何", "弦长"],
    isHighFreq: true
  },
  {
    id: 44,
    category: "综合应用",
    title: "二次不等式解法",
    content: "大于取两边，小于取中间 (a>0)。",
    tags: ["不等式", "基础"],
    isHighFreq: false
  },
  {
    id: 45,
    category: "综合应用",
    title: "幂指对复合",
    content: "二次函数常作为指数或对数的真数出现，定义域优先。",
    example: "函数 y = √(2x-x²) 的定义域为 [0, 2]。",
    tags: ["定义域", "复合"],
    isHighFreq: true
  }
];

const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const categories = ["全部", ...Array.from(new Set(DATASET.map(item => item.category)))];

  const filteredData = useMemo(() => {
    return DATASET.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "全部" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-3xl">📚</span> 
                    高考数学・一元二次函数知识库
                </h2>
                <p className="text-slate-500 mt-1">
                    收录 <span className="font-bold text-primary">{DATASET.length}+</span> 个核心考点，覆盖定义、图像、最值、根分布及恒成立问题
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <input 
                    type="text" 
                    placeholder="搜索知识点 (如: 对称轴, 恒成立)..." 
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none min-w-[240px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="p-6 bg-slate-50 min-h-[400px]">
        {filteredData.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
                <p className="text-xl">未找到相关知识点</p>
                <p className="text-sm mt-2">试试搜索 "最值" 或 "根"</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredData.map((item) => (
                    <div key={item.id} className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-primary/30 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                            {item.isHighFreq && (
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full border border-red-100">
                                    🔥 高频考点
                                </span>
                            )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                            {item.content}
                        </p>

                        {item.example && (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 mb-3">
                                <span className="font-bold text-slate-500 block mb-1">示例:</span>
                                <span className="font-mono">{item.example}</span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-slate-50">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
