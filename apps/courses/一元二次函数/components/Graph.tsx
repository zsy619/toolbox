import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  Label
} from 'recharts';
import { Coefficients, GraphDataPoint, HighlightFeature } from '../types';

interface GraphProps {
  coeffs: Coefficients;
  highlightFeature?: HighlightFeature | null;
}

const Graph: React.FC<GraphProps> = ({ coeffs, highlightFeature }) => {
  const { a, b, c } = coeffs;
  const containerRef = useRef<HTMLDivElement>(null);

  // State for manual zoom/pan (X and Y axes)
  const [manualDomain, setManualDomain] = useState<[number, number] | null>(null);
  const [manualYDomain, setManualYDomain] = useState<[number, number] | null>(null);
  
  // Refs for interactions
  const dragRef = useRef<{ 
    startX: number; 
    startY: number;
    initialXDomain: [number, number];
    initialYDomain: [number, number];
  } | null>(null);

  const touchRef = useRef<{
    mode: 'ZOOM' | 'PAN';
    dist?: number;
    startX?: number;
    startY?: number;
    initialXDomain: [number, number];
    initialYDomain: [number, number];
  } | null>(null);

  // --- 1. Math Calculations (Vertex, Roots) ---
  const vertexX = Math.abs(a) > 1e-4 ? -b / (2 * a) : 0;
  const vertexY = Math.abs(a) > 1e-4 ? (4 * a * c - b * b) / (4 * a) : c;
  const discriminant = b * b - 4 * a * c;

  const roots: number[] = [];
  if (discriminant > 1e-6) {
      roots.push((-b - Math.sqrt(discriminant)) / (2 * a));
      roots.push((-b + Math.sqrt(discriminant)) / (2 * a));
  } else if (Math.abs(discriminant) <= 1e-6) {
      roots.push(-b / (2 * a));
  }

  // --- 2. Viewport Logic (Auto vs Manual) ---
  
  // A. Auto Logic
  // Determine the view center (tracking the vertex, but clamped)
  const autoCenter = Math.abs(vertexX) > 200 ? 0 : vertexX;
  
  // Calculate view width based on 'a'
  const safeA = Math.max(Math.abs(a), 0.05);
  const targetWidth = 24 / Math.sqrt(safeA);
  const MIN_AUTO_WIDTH = 10;
  const MAX_AUTO_WIDTH = 80;
  const autoViewWidth = Math.min(Math.max(targetWidth, MIN_AUTO_WIDTH), MAX_AUTO_WIDTH);
  const autoHalfWidth = autoViewWidth / 2;
  const autoDomain: [number, number] = [autoCenter - autoHalfWidth, autoCenter + autoHalfWidth];

  // B. Effective Domain
  const xDomain = manualDomain || autoDomain;
  const currentViewWidth = xDomain[1] - xDomain[0];
  const center = (xDomain[0] + xDomain[1]) / 2;

  // --- 3. Data Generation ---
  const data: GraphDataPoint[] = useMemo(() => {
    const points: GraphDataPoint[] = [];
    
    // Scale step size with currentViewWidth to maintain constant visual resolution
    const step = currentViewWidth / 150;
    const buffer = currentViewWidth * 0.1; // Extra width on sides to prevent cutoff artifacts
    
    const rawMin = xDomain[0] - buffer;
    const rawMax = xDomain[1] + buffer;
    
    // Align startX to the global grid
    const startX = Math.floor(rawMin / step) * step;
    const endX = Math.ceil(rawMax / step) * step;

    // Safety guard
    if ((endX - startX) / step < 2000) {
        for (let x = startX; x <= endX; x += step) {
            const cleanX = Math.round(x * 1000) / 1000;
            const y = a * Math.pow(cleanX, 2) + b * cleanX + c;
            
            if (Number.isFinite(y)) {
                points.push({ x: cleanX, y: y });
            }
        }
    }
    return points;
  }, [a, b, c, xDomain, currentViewWidth]);

  // --- 4. Y-Axis Domain ---
  const yValues = data.map(p => p.y);
  const minY = yValues.length > 0 ? Math.min(...yValues) : -10;
  const maxY = yValues.length > 0 ? Math.max(...yValues) : 10;
  const yBuffer = (maxY - minY) * 0.1 || 5;
  const autoYDomain: [number, number] = [minY - yBuffer, maxY + yBuffer];
  const yDomain = manualYDomain || autoYDomain;


  // --- 5. Interaction Handlers (Zoom & Pan) ---

  // Helper: Get plot dimensions for accurate drag calculations
  const getPlotDimensions = () => {
    if (!containerRef.current) return { width: 1, height: 1 };
    const rect = containerRef.current.getBoundingClientRect();
    // Approximate plotting area dimensions based on Recharts margins and axis sizes
    // margin={{ top: 20, right: 30, left: 20, bottom: 20 }} + YAxis width (45) + XAxis height (~30)
    const width = rect.width - 20 - 30 - 45; 
    const height = rect.height - 20 - 20 - 30;
    return { width, height };
  };

  // Helper: map screen pixel x to data value x
  const getGraphXFromEvent = (clientX: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Layout Constants matching Recharts props
    const CHART_MARGIN_LEFT = 20;
    const CHART_MARGIN_RIGHT = 30;
    const YAXIS_WIDTH = 45; 
    
    const plotLeft = rect.left + CHART_MARGIN_LEFT + YAXIS_WIDTH;
    const plotWidth = rect.width - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT - YAXIS_WIDTH;
    
    const relativeX = clientX - plotLeft;
    const ratio = relativeX / plotWidth;
    
    const domainRange = xDomain[1] - xDomain[0];
    return xDomain[0] + ratio * domainRange;
  };

  // Wheel Zoom (X-Axis)
  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        
        const cursorDataX = getGraphXFromEvent(e.clientX);
        const pivot = cursorDataX !== null ? cursorDataX : center;
        
        const ZOOM_SPEED = 0.001;
        const scale = 1 + e.deltaY * ZOOM_SPEED;
        const safeScale = Math.max(0.1, Math.min(scale, 10));

        const oldRange = xDomain[1] - xDomain[0];
        const newRange = oldRange * safeScale;

        if (newRange < 0.5 || newRange > 5000) return;

        const ratio = (pivot - xDomain[0]) / oldRange;
        const newMin = pivot - ratio * newRange;
        const newMax = newMin + newRange;

        setManualDomain([newMin, newMax]);
    };

    currentRef.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
        currentRef.removeEventListener('wheel', handleWheel);
    };
  }, [xDomain, center]);

  // Mouse Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button
      
      const currentXDomain = xDomain;
      const currentYDomain = yDomain;

      // Initialize manual mode if currently auto
      if (!manualDomain) setManualDomain(currentXDomain);
      if (!manualYDomain) setManualYDomain(currentYDomain);
      
      dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          initialXDomain: currentXDomain,
          initialYDomain: currentYDomain
      };
      
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      
      const { startX, startY, initialXDomain, initialYDomain } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const { width, height } = getPlotDimensions();
      
      if (width <= 0 || height <= 0) return;

      // X Shift: Drag Right (+dx) -> Move View Left (-shift)
      const xRange = initialXDomain[1] - initialXDomain[0];
      const shiftX = (dx / width) * xRange;
      setManualDomain([initialXDomain[0] - shiftX, initialXDomain[1] - shiftX]);

      // Y Shift: Drag Down (+dy) -> Move View Up (+shift) 
      // (Moving visual element down reveals what is "above" in the graph, i.e., higher Y values)
      const yRange = initialYDomain[1] - initialYDomain[0];
      const shiftY = (dy / height) * yRange;
      setManualYDomain([initialYDomain[0] + shiftY, initialYDomain[1] + shiftY]);
  };

  const handleMouseUp = () => {
      dragRef.current = null;
      if (containerRef.current) containerRef.current.style.cursor = (manualDomain || manualYDomain) ? 'grab' : 'crosshair';
  };
  
  const handleMouseLeave = () => {
      dragRef.current = null;
      if (containerRef.current) containerRef.current.style.cursor = (manualDomain || manualYDomain) ? 'grab' : 'crosshair';
  };

  // Touch Handlers (Pan & Pinch)
  const handleTouchStart = (e: React.TouchEvent) => {
      const currentXDomain = xDomain;
      const currentYDomain = yDomain;
      
      if (!manualDomain) setManualDomain(currentXDomain);
      if (!manualYDomain) setManualYDomain(currentYDomain);

      if (e.touches.length === 2) {
          // Pinch Zoom
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
          
          touchRef.current = {
              mode: 'ZOOM',
              dist,
              initialXDomain: currentXDomain,
              initialYDomain: currentYDomain
          };
      } else if (e.touches.length === 1) {
          // Pan
          touchRef.current = {
              mode: 'PAN',
              startX: e.touches[0].clientX,
              startY: e.touches[0].clientY,
              initialXDomain: currentXDomain,
              initialYDomain: currentYDomain
          };
      }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      e.preventDefault();

      if (touchRef.current.mode === 'ZOOM' && e.touches.length === 2) {
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
          
          const { dist: initialDist, initialXDomain, initialYDomain } = touchRef.current;
          if (!initialDist) return;

          const scale = initialDist / dist; 
          
          // Scale X
          const xRange = initialXDomain[1] - initialXDomain[0];
          const newXRange = xRange * scale;
          if (newXRange > 0.5 && newXRange < 5000) {
            const xMid = (initialXDomain[0] + initialXDomain[1]) / 2;
            setManualDomain([xMid - newXRange / 2, xMid + newXRange / 2]);
          }

          // Scale Y (also zoom Y during pinch for natural feel)
          const yRange = initialYDomain[1] - initialYDomain[0];
          const newYRange = yRange * scale;
          const yMid = (initialYDomain[0] + initialYDomain[1]) / 2;
          setManualYDomain([yMid - newYRange / 2, yMid + newYRange / 2]);
      } 
      else if (touchRef.current.mode === 'PAN' && e.touches.length === 1) {
          const t = e.touches[0];
          const { startX, startY, initialXDomain, initialYDomain } = touchRef.current;
          if (startX === undefined || startY === undefined) return;

          const dx = t.clientX - startX;
          const dy = t.clientY - startY;
          const { width, height } = getPlotDimensions();
          
          if (width <= 0 || height <= 0) return;

          // X Shift
          const xRange = initialXDomain[1] - initialXDomain[0];
          const shiftX = (dx / width) * xRange;
          setManualDomain([initialXDomain[0] - shiftX, initialXDomain[1] - shiftX]);

          // Y Shift
          const yRange = initialYDomain[1] - initialYDomain[0];
          const shiftY = (dy / height) * yRange;
          setManualYDomain([initialYDomain[0] + shiftY, initialYDomain[1] + shiftY]);
      }
  };

  const handleTouchEnd = () => {
      touchRef.current = null;
  };


  // --- 6. Formatting & Visuals ---
  const formatFunction = () => {
    let str = "";
    if (a === -1) str += "-x²";
    else if (a === 1) str += "x²";
    else str += `${parseFloat(a.toFixed(2))}x²`;
    if (b !== 0) {
        const sign = b > 0 ? " + " : " - ";
        const val = Math.abs(b);
        const bStr = val === 1 ? "x" : `${parseFloat(val.toFixed(2))}x`;
        str += `${sign}${bStr}`;
    }
    if (c !== 0) {
        const sign = c > 0 ? " + " : " - ";
        str += `${sign}${Math.abs(parseFloat(c.toFixed(2)))}`;
    }
    return `y = ${str}`;
  };

  const formatNum = (n: number) => parseFloat(n.toFixed(2));

  // Highlight logic
  const getHighlightStyle = (featureName: string) => {
    if (!highlightFeature) return { opacity: 1, width: 3, r: 6 };
    const isTarget = highlightFeature === featureName;
    
    if (featureName === 'LINE' && highlightFeature === 'SHAPE') return { opacity: 1, width: 5, r: 6 };
    if (featureName === 'VERTEX' && (highlightFeature === 'VERTEX' || highlightFeature === 'AXIS')) return { opacity: 1, width: 3, r: 8 };
    
    return isTarget 
      ? { opacity: 1, width: 3, r: 8 } 
      : { opacity: 0.3, width: 1, r: 4 };
  };

  const lineStyle = getHighlightStyle('LINE');
  const vertexStyle = getHighlightStyle('VERTEX');
  const rootStyle = getHighlightStyle('ROOTS');

  return (
    <div 
        ref={containerRef}
        className={`w-full h-full min-h-[400px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col relative touch-none select-none`}
        style={{ cursor: (manualDomain || manualYDomain) ? 'grab' : 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      <div className="mb-4 flex justify-between items-center z-10 pointer-events-none">
         <h3 className="text-lg font-bold text-slate-700 pointer-events-auto">函数图像</h3>
         <div className="flex items-center gap-2 pointer-events-auto">
             {(manualDomain || manualYDomain) && (
                 <button 
                    onClick={() => { setManualDomain(null); setManualYDomain(null); }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors flex items-center gap-1 shadow-sm border border-slate-200"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                     复位视图
                 </button>
             )}
             <div className="text-sm text-slate-500 font-mono font-bold bg-slate-100 px-3 py-1 rounded border border-slate-200">
                {formatFunction()}
             </div>
         </div>
      </div>
      
      <div className="flex-grow relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={xDomain}
            tickCount={currentViewWidth < 20 ? Math.ceil(currentViewWidth) + 1 : 10}
            stroke="#64748b"
            allowDataOverflow={true}
          />
          <YAxis 
            dataKey="y" 
            type="number" 
            domain={yDomain} 
            stroke="#64748b"
            allowDataOverflow={true}
            width={45}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            itemStyle={{ color: '#3b82f6' }}
            formatter={(value: number) => value.toFixed(2)}
            labelFormatter={(label: number) => `x = ${label}`}
          />
          
          <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />
          
          {/* Axis of Symmetry */}
          {Math.abs(vertexX) < 200 && (
             <ReferenceLine 
               x={vertexX} 
               stroke="#f59e0b" 
               strokeDasharray="5 5" 
               strokeOpacity={highlightFeature === 'AXIS' || highlightFeature === 'VERTEX' ? 1 : (highlightFeature ? 0.3 : 0.8)}
               strokeWidth={highlightFeature === 'AXIS' ? 3 : 1}
             />
          )}

          <Line
            type="monotone"
            dataKey="y"
            stroke="#3b82f6"
            strokeWidth={lineStyle.width}
            strokeOpacity={lineStyle.opacity}
            dot={false}
            isAnimationActive={false} 
            activeDot={{ r: 6 }}
          />

          {/* Roots Markers */}
          {roots.map((r, i) => (
             <ReferenceDot 
               key={`root-${i}`}
               x={r} 
               y={0} 
               r={rootStyle.r} 
               fill="#10b981" 
               fillOpacity={highlightFeature === 'ROOTS' ? 1 : (highlightFeature ? 0.3 : 1)}
               stroke="#fff" 
               strokeWidth={2}
               className="drop-shadow-sm"
             >
                 <Label 
                   value={`x=${formatNum(r)}`} 
                   position="bottom" 
                   offset={10} 
                   fill="#10b981" 
                   fontSize={12} 
                   fontWeight="bold"
                   fillOpacity={highlightFeature === 'ROOTS' ? 1 : (highlightFeature ? 0.3 : 1)}
                 />
             </ReferenceDot>
          ))}

          {/* Vertex Marker */}
          {Math.abs(vertexX) < 200 && (
            <ReferenceDot 
                x={vertexX} 
                y={vertexY} 
                r={vertexStyle.r} 
                fill="#f59e0b" 
                fillOpacity={vertexStyle.opacity}
                stroke="#fff" 
                strokeWidth={2}
                className="drop-shadow-sm"
            >
                <Label 
                   value={`顶点 (${formatNum(vertexX)}, ${formatNum(vertexY)})`} 
                   position="top" 
                   offset={10} 
                   fill="#f59e0b" 
                   fontSize={12} 
                   fontWeight="bold"
                   fillOpacity={vertexStyle.opacity}
                />
            </ReferenceDot>
          )}

        </LineChart>
      </ResponsiveContainer>
      
      {/* Zoom Hint Overlay (fades out) */}
      {!manualDomain && !manualYDomain && (
         <div className="absolute top-2 right-2 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded pointer-events-none opacity-50 z-10 border border-slate-100">
             支持 滚轮缩放 / 拖拽平移
         </div>
      )}
      </div>
      
      {/* Info Stats Row */}
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-center text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div>
              <span className="block font-bold text-slate-400 mb-1">顶点坐标</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm text-amber-600 font-bold">
                  ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
              </span>
          </div>
          <div>
               <span className="block font-bold text-slate-400 mb-1">判别式 Δ</span>
               <span className={`font-mono px-2 py-0.5 rounded shadow-sm ${discriminant >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                   {discriminant.toFixed(2)}
               </span>
          </div>
          <div>
               <span className="block font-bold text-slate-400 mb-1">根的情况</span>
               <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm text-emerald-600 font-bold">
                   {roots.length > 0 ? roots.map(r => r.toFixed(2)).join(', ') : '无实根'}
               </span>
          </div>
      </div>
    </div>
  );
};

export default Graph;