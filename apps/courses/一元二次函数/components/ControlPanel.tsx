import React, { useEffect, useRef, useState } from 'react';
import { Coefficients } from '../types';

interface ControlPanelProps {
  coeffs: Coefficients;
  onChange: (newCoeffs: Coefficients) => void;
  error?: string | null;
}

// Define configuration outside component to access it in useEffect easily
const SLIDER_CONFIG = [
  { label: 'a (开口方向/大小)', key: 'a' as keyof Coefficients, min: -5, max: 5, step: 0.1 },
  { label: 'b (一次项系数)', key: 'b' as keyof Coefficients, min: -20, max: 20, step: 0.1 },
  { label: 'c (常数项/截距)', key: 'c' as keyof Coefficients, min: -20, max: 20, step: 0.1 },
];

const ControlPanel: React.FC<ControlPanelProps> = ({ coeffs, onChange, error }) => {
  const [animatingKey, setAnimatingKey] = useState<keyof Coefficients | null>(null);
  const animationRef = useRef<number | null>(null);
  const directionRef = useRef<number>(1);

  const handleChange = (key: keyof Coefficients, value: number) => {
    // Ensure precision to 2 decimal places to avoid floating point artifacts
    const roundedValue = Math.round(value * 100) / 100;
    
    // We allow 0 here to let the App handle validation and error display
    onChange({ ...coeffs, [key]: roundedValue });
  };

  // Helper to format number: max 2 decimals, no trailing zeros
  const formatValue = (val: number) => {
      // Round first to ensure clean display
      const rounded = Math.round(val * 100) / 100;
      return Number(rounded).toString();
  };

  // Animation logic
  useEffect(() => {
    if (animatingKey) {
      const config = SLIDER_CONFIG.find(c => c.key === animatingKey);
      if (!config) return;

      const range = config.max - config.min;
      // Calculate speed based on range so animation feels consistent (crosses range in ~3-4s)
      const speed = range / 200; 

      const animate = () => {
        let newValue = coeffs[animatingKey] + (speed * directionRef.current);
        
        // Round to avoid long decimals during animation
        newValue = Math.round(newValue * 100) / 100;

        // Skip 0 for 'a' during animation to keep the demo running smoothly without hitting error state
        if (animatingKey === 'a' && Math.abs(newValue) < 0.1) {
            newValue = directionRef.current > 0 ? 0.1 : -0.1;
        }

        // Clamp to limits
        if (newValue > config.max) newValue = config.max;
        if (newValue < config.min) newValue = config.min;

        const newCoeffs = { ...coeffs, [animatingKey]: newValue };
        onChange(newCoeffs);
        
        // Bounce logic with dynamic limits
        if (newValue >= config.max) directionRef.current = -1;
        if (newValue <= config.min) directionRef.current = 1;

        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatingKey, coeffs]); 

  const toggleAnimation = (key: keyof Coefficients) => {
    if (animatingKey === key) {
      setAnimatingKey(null);
    } else {
      setAnimatingKey(key);
      directionRef.current = 1;
    }
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border transition-colors ${error ? 'border-red-200' : 'border-slate-200'}`}>
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        参数控制
      </h3>
      
      <div className="space-y-6">
        {SLIDER_CONFIG.map((slider) => {
          const isErrorSource = slider.key === 'a' && error;
          
          return (
            <div key={slider.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor={`slider-${slider.key}`} className={`text-sm font-medium ${isErrorSource ? 'text-red-600' : 'text-slate-700'}`}>
                  {slider.label}
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded min-w-[60px] text-center ${
                      isErrorSource ? 'bg-red-50 text-red-600' : 'text-primary bg-blue-50'
                  }`}>
                    {slider.key} = {formatValue(coeffs[slider.key])}
                  </span>
                  <button 
                    onClick={() => toggleAnimation(slider.key)}
                    className={`p-1 rounded transition-colors ${animatingKey === slider.key ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    title={animatingKey === slider.key ? "停止演示" : "自动演示"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      {animatingKey === slider.key ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative flex items-center">
                  <span className="absolute left-0 text-xs text-slate-400 -bottom-5">{slider.min}</span>
                  <input
                      id={`slider-${slider.key}`}
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      value={coeffs[slider.key]}
                      onChange={(e) => handleChange(slider.key, parseFloat(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all ${
                          isErrorSource ? 'bg-red-200 accent-red-500' : 'bg-slate-200 accent-primary hover:accent-blue-600'
                      }`}
                  />
                  <span className="absolute right-0 text-xs text-slate-400 -bottom-5">{slider.max}</span>
              </div>
              
              {/* Error Message Display */}
              {isErrorSource && (
                  <div className="mt-2 text-xs text-red-600 font-bold flex items-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                  </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
        <p className="font-bold flex items-center gap-1 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            操作提示
        </p>
        <ul className="list-disc list-inside space-y-1 opacity-90">
            <li><b>a ≠ 0</b>：二次函数的二次项系数不能为0。</li>
            <li>拖动 <b>a</b> 观察开口方向与宽窄。</li>
            <li>拖动 <b>b</b> 观察对称轴的移动。</li>
            <li>拖动 <b>c</b> 观察图像上下平移。</li>
            <li>点击播放按钮可自动演示变化。</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;