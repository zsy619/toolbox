import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Coefficients, TabOption } from '../types';
import { analyzeFunction, getGaokaoQuestions } from '../services/geminiService';

interface InfoPanelProps {
    coeffs: Coefficients;
    isInvalid?: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ coeffs, isInvalid }) => {
    const [activeTab, setActiveTab] = useState<TabOption>(TabOption.KNOWLEDGE);
    const [aiResponse, setAiResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    
    // State for extra questions
    const [questionsContent, setQuestionsContent] = useState<string>("");
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);

    const handleAnalyze = async () => {
        if (isInvalid) return;

        setIsLoading(true);
        setQuestionsContent(""); // Reset questions
        setShowQuestions(false);
        setActiveTab(TabOption.AI_TUTOR);
        
        const result = await analyzeFunction(coeffs);
        setAiResponse(result);
        
        setIsLoading(false);
        setHasAnalyzed(true);
    };

    const handleGetQuestions = async () => {
        if (isInvalid) return;

        setIsLoadingQuestions(true);
        const result = await getGaokaoQuestions(coeffs);
        setQuestionsContent(result);
        setIsLoadingQuestions(false);
        setShowQuestions(true);
    };

    const coreKnowledge = [
        {
            title: "1. 图像与性质",
            content: "**a > 0** 时开口向上，有最小值；**a < 0** 时开口向下，有最大值。\n|a| 越大，开口越小。"
        },
        {
            title: "2. 对称轴与顶点",
            content: "对称轴公式：**x = -b / 2a**\n顶点坐标：**(-b/2a, (4ac-b²)/4a)**"
        },
        {
            title: "3. 判别式 Δ = b² - 4ac",
            content: "Δ > 0 : 两个不同实根（与x轴两个交点）\nΔ = 0 : 两个相等实根（与x轴相切）\nΔ < 0 : 无实根（与x轴无交点）"
        },
        {
            title: "4. 高考常考题型",
            content: "1. **区间最值**：判断对称轴是否在给定区间内。\n2. **根的分布**：利用韦达定理 x₁+x₂=-b/a, x₁x₂=c/a。\n3. **恒成立问题**：转化为最值问题求解。"
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab(TabOption.KNOWLEDGE)}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        activeTab === TabOption.KNOWLEDGE 
                        ? 'text-primary border-b-2 border-primary bg-blue-50/50' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    核心考点
                </button>
                <button
                    onClick={() => setActiveTab(TabOption.AI_TUTOR)}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        activeTab === TabOption.AI_TUTOR 
                        ? 'text-secondary border-b-2 border-secondary bg-green-50/50' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    AI 深度分析
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 scroll-smooth">
                {activeTab === TabOption.KNOWLEDGE && (
                    <div className="space-y-6">
                        {coreKnowledge.map((item, idx) => (
                            <div key={idx} className="pb-4 border-b border-slate-100 last:border-0">
                                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    {item.title}
                                </h4>
                                <div className="prose prose-sm max-w-none text-slate-700 prose-strong:text-slate-900 prose-strong:font-bold">
                                    <ReactMarkdown>
                                        {item.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                         <div className="mt-4 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                            <strong>💡 学习建议：</strong>
                            <p className="mt-1 opacity-90">结合左侧图像，尝试调整 a, b, c 的值，观察上述性质的动态变化。特别是观察 a 对开口的影响以及 b 对对称轴的影响。</p>
                        </div>
                    </div>
                )}

                {activeTab === TabOption.AI_TUTOR && (
                    <div className="space-y-4">
                        {!hasAnalyzed && !isLoading && (
                            <div className="text-center py-10">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">AI 智能分析</h3>
                                <p className="text-slate-500 mb-6 text-sm">
                                    点击下方按钮，让 AI 基于当前设置的系数 ({coeffs.a}, {coeffs.b}, {coeffs.c}) 生成针对性的高考考点解析。
                                </p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                                <span className="text-sm text-slate-500">正在分析图像性质...</span>
                            </div>
                        )}

                        {hasAnalyzed && !isLoading && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">当前函数分析报告</h4>
                                    <div className="prose prose-sm max-w-none text-slate-700 
                                            prose-headings:text-slate-800 prose-headings:font-bold prose-h3:text-base
                                            prose-strong:text-slate-900 prose-strong:font-bold
                                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                            prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
                                    >
                                        <ReactMarkdown>
                                            {aiResponse}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {!showQuestions && (
                                    <div className="text-center pt-2">
                                        <button 
                                            onClick={handleGetQuestions}
                                            disabled={isLoadingQuestions || isInvalid}
                                            className={`text-sm font-bold underline decoration-2 transition-all 
                                                ${isInvalid 
                                                    ? 'text-slate-300 cursor-not-allowed decoration-slate-200' 
                                                    : 'text-secondary hover:text-emerald-700 decoration-secondary/30 hover:decoration-secondary'
                                                }`}
                                            title={isInvalid ? "请先修正参数错误 (a≠0)" : "查看变式题"}
                                        >
                                            {isLoadingQuestions ? "正在生成题目..." : "查看更多高考真题变式 ↓"}
                                        </button>
                                    </div>
                                )}

                                {isLoadingQuestions && (
                                    <div className="flex justify-center p-4">
                                        <div className="animate-pulse flex space-x-2">
                                            <div className="h-2 w-2 bg-secondary rounded-full"></div>
                                            <div className="h-2 w-2 bg-secondary rounded-full"></div>
                                            <div className="h-2 w-2 bg-secondary rounded-full"></div>
                                        </div>
                                    </div>
                                )}

                                {showQuestions && questionsContent && (
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 animate-slide-up mt-4">
                                        <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                            </svg>
                                            真题变式训练
                                        </h4>
                                        <div className="prose prose-sm max-w-none text-amber-900 
                                                prose-headings:text-amber-900 prose-headings:font-bold
                                                prose-strong:text-amber-950 prose-strong:font-bold
                                                prose-code:text-amber-700 prose-code:bg-amber-100/50 prose-code:px-1 prose-code:rounded"
                                        >
                                            <ReactMarkdown>
                                                {questionsContent}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white">
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || isInvalid}
                    title={isInvalid ? "请先修正参数错误 (a≠0)" : ""}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all 
                        ${(isLoading || isInvalid)
                            ? 'bg-slate-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98]'
                        }`}
                >
                    {isInvalid ? '参数错误 (a不能为0)' : (isLoading ? '生成中...' : '重新生成 AI 分析')}
                </button>
            </div>
        </div>
    );
};

export default InfoPanel;