import { GoogleGenAI } from "@google/genai";
import { Coefficients } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to format polynomial nicely: x² - 2x + 1
// Handles 1 and -1 coefficients correctly (e.g., -x² instead of -1x²)
// Uses Unicode superscripts for better visual representation
const formatFunctionString = ({ a, b, c }: Coefficients): string => {
    let str = "";

    // A term (Quadratic)
    if (a === -1) str += "-x²";
    else if (a === 1) str += "x²";
    else str += `${a}x²`;

    // B term (Linear)
    if (b !== 0) {
        const sign = b > 0 ? " + " : " - ";
        const val = Math.abs(b);
        const bStr = val === 1 ? "x" : `${val}x`;
        str += `${sign}${bStr}`;
    }

    // C term (Constant)
    if (c !== 0) {
        const sign = c > 0 ? " + " : " - ";
        str += `${sign}${Math.abs(c)}`;
    }

    return `y = ${str}`;
};

export const analyzeFunction = async (coeffs: Coefficients): Promise<string> => {
    const { a, b, c } = coeffs;
    
    if (a === 0) {
        return "这不是二次函数（a=0）。请调整参数 a。";
    }

    if (!process.env.API_KEY) {
        return "请配置 API Key 以获取 AI 分析。";
    }

    // Pre-calculate math properties to ground the AI
    const delta = b * b - 4 * a * c;
    const axis = -b / (2 * a);
    const vertexY = (4 * a * c - b * b) / (4 * a);
    const funcStr = formatFunctionString(coeffs);
    
    let rootsDesc = "";
    if (delta > 0) rootsDesc = "有两个不相等的实数根";
    else if (delta === 0) rootsDesc = "有两个相等的实数根 (相切)";
    else rootsDesc = "无实数根 (图像与x轴无交点)";

    const monoDesc = a > 0 
        ? `在 (-∞, ${axis.toFixed(2)}] 上单调递减，在 [${axis.toFixed(2)}, +∞) 上单调递增`
        : `在 (-∞, ${axis.toFixed(2)}] 上单调递增，在 [${axis.toFixed(2)}, +∞) 上单调递减`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                你是一位资深高中数学名师。请基于以下**准确的**数学数据，为学生讲解当前二次函数图像的性质与考点。

                **当前函数数据 (Ground Truth):**
                - 解析式: ${funcStr}
                - 开口方向: ${a > 0 ? "向上" : "向下"} (因为 a=${a})
                - 对称轴: x = ${axis.toFixed(2)}
                - 顶点坐标: (${axis.toFixed(2)}, ${vertexY.toFixed(2)})
                - 判别式 Δ: ${delta.toFixed(2)} (${rootsDesc})
                - 单调性: ${monoDesc}

                **任务要求:**
                1. **性质分析**: 用通俗易懂的语言解释上述数据意味着什么。
                2. **高考考点链接**: 结合这个具体的图像形态，指出高考中常考的题型。
                3. **典型例题**: 出一道基于此函数参数风格的选择题，并给出简要解析。

                **格式与排版要求:**
                1. 使用 Markdown 格式。
                2. **数学符号美化**: 为了在网页上获得最佳显示效果，请尽量使用 Unicode 字符表示数学符号。
                   - 平方请使用 ² (如 x²)
                   - 判别式请使用 Δ
                   - 根号请使用 √
                   - 不等号请使用 ≥, ≤
                   - 正负号请使用 ±
                   - 无穷大请使用 ∞
                   - 分数尽量写成易读的单行形式，如 -b/2a
                3. 重点关键词请加粗。
            `,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        return response.text || "无法生成分析，请稍后再试。";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "AI 分析服务暂时不可用 (请检查网络或 API Key)。";
    }
};

export const getGaokaoQuestions = async (coeffs: Coefficients): Promise<string> => {
    const { a, b } = coeffs;
    if (a === 0) return "参数错误：a 不能为 0。";

    const funcStr = formatFunctionString(coeffs);
    const axis = -b / (2 * a);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                基于二次函数 ${funcStr} (对称轴 x=${axis.toFixed(2)}, 开口${a > 0 ? '向上' : '向下'})，
                请生成 **2道** 具有高考难度的变式训练题（例如涉及动区间最值、含参不等式恒成立、根的分布等）。
                
                要求：
                1. 题目要有一定的综合性，符合高考（或模拟题）风格。
                2. 每道题后紧跟详细的**解题思路**和**答案**。
                3. **排版要求**: 使用 Markdown。数学符号请优先使用 Unicode (如 x², Δ, ≥, ≤, √)，避免复杂的 LaTeX 代码块，以确保最佳阅读体验。
            `,
             config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text || "题目生成失败";
    } catch (error) {
        return "获取题目失败，请检查网络设置。";
    }
};

export const getGeneralKnowledge = async (topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `请简要讲解高中数学中关于“${topic}”的核心考点，列出3个关键点和1个易错点。使用Markdown格式，数学符号尽量使用Unicode (x², Δ 等)。`,
        });
        return response.text || "暂无内容";
    } catch (error) {
        return "获取知识点失败";
    }
};