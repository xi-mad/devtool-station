import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';

// Helpers
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const componentToHex = (c: number) => {
  const hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Mix two colors. weight is 0..1 (percentage of color2)
const mixColors = (color1: {r:number, g:number, b:number}, color2: {r:number, g:number, b:number}, weight: number) => {
    const w = weight;
    const w1 = 1 - w;
    return {
        r: Math.round(color1.r * w1 + color2.r * w),
        g: Math.round(color1.g * w1 + color2.g * w),
        b: Math.round(color1.b * w1 + color2.b * w)
    };
}

const generateTailwindPalette = (baseHex: string) => {
    const rgb = hexToRgb(baseHex);
    if (!rgb) return {};

    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };

    // Mixing weights approximated to match typical Tailwind scales
    // Mixing with white for lower steps, black for higher steps
    return {
        50:  rgbToHex(mixColors(rgb, white, 0.95).r, mixColors(rgb, white, 0.95).g, mixColors(rgb, white, 0.95).b),
        100: rgbToHex(mixColors(rgb, white, 0.9).r, mixColors(rgb, white, 0.9).g, mixColors(rgb, white, 0.9).b),
        200: rgbToHex(mixColors(rgb, white, 0.75).r, mixColors(rgb, white, 0.75).g, mixColors(rgb, white, 0.75).b),
        300: rgbToHex(mixColors(rgb, white, 0.5).r, mixColors(rgb, white, 0.5).g, mixColors(rgb, white, 0.5).b),
        400: rgbToHex(mixColors(rgb, white, 0.25).r, mixColors(rgb, white, 0.25).g, mixColors(rgb, white, 0.25).b),
        500: baseHex,
        600: rgbToHex(mixColors(rgb, black, 0.1).r, mixColors(rgb, black, 0.1).g, mixColors(rgb, black, 0.1).b),
        700: rgbToHex(mixColors(rgb, black, 0.3).r, mixColors(rgb, black, 0.3).g, mixColors(rgb, black, 0.3).b),
        800: rgbToHex(mixColors(rgb, black, 0.5).r, mixColors(rgb, black, 0.5).g, mixColors(rgb, black, 0.5).b),
        900: rgbToHex(mixColors(rgb, black, 0.75).r, mixColors(rgb, black, 0.75).g, mixColors(rgb, black, 0.75).b),
        950: rgbToHex(mixColors(rgb, black, 0.9).r, mixColors(rgb, black, 0.9).g, mixColors(rgb, black, 0.9).b),
    };
}

const TAILWIND_COLORS = {
  'Slate': ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'],
  'Blue': ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  'Indigo': ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
  'Emerald': ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  'Rose': ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'],
};

export const ColorTool: React.FC = () => {
  const { t } = useTranslation();
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const { copy, isCopied } = useCopy();

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    const rgbVal = hexToRgb(val);
    if (rgbVal) setRgb(rgbVal);
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', val: string) => {
    const num = parseInt(val) || 0;
    const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, num)) };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const generatedPalette = useMemo(() => generateTailwindPalette(hex), [hex]);



  return (
    <div className="space-y-8 transition-colors">
      {/* Picker & Converter */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 transition-colors">
        <div className="flex flex-col gap-4">
          <div 
            className="w-full h-32 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800 transition-colors duration-200"
            style={{ backgroundColor: hex }}
          />
          <div className="flex gap-2">
            <input 
                type="color" 
                value={hex}
                onChange={handleHexChange}
                className="w-full h-10 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800 transition-colors"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">HEX</label>
            <div className="flex gap-2">
                <input 
                type="text" 
                value={hex}
                onChange={handleHexChange}
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg font-mono uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
                />
                <button 
                    onClick={() => copy(hex, hex)}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                >
                    {isCopied(hex) ? <Check size={20} className="text-green-600"/> : <Copy size={20} />}
                </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(['r', 'g', 'b'] as const).map(c => (
              <div key={c}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 uppercase transition-colors">{c}</label>
                <input 
                  type="number"
                  value={rgb[c]}
                  onChange={(e) => handleRgbChange(c, e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">CSS</label>
             <div 
                className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg font-mono text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 select-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex justify-between items-center"
                onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
             >
                {`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                {isCopied(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`) ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="opacity-50" />}
             </div>
          </div>
        </div>
      </div>

      {/* Generated Palette */}
      <div className="space-y-4 transition-colors">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{t('color-tool.generated_palette')}</h3>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="grid grid-cols-5 sm:grid-cols-11 gap-2">
                {Object.entries(generatedPalette).map(([weight, color]) => (
                    <div key={weight} className="flex flex-col gap-1 group cursor-pointer" onClick={() => copy(color, color)}>
                        <div 
                            className="w-full aspect-square rounded-md shadow-sm border border-black/5 relative overflow-hidden transition-transform group-hover:scale-105"
                            style={{ backgroundColor: color }}
                        >
                            {isCopied(color) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                                    <Check size={16} />
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{weight}</div>
                            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase hidden sm:block">{(color as string).replace('#', '')}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Common Palettes */}
      <div className="space-y-4 transition-colors">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{t('color-tool.common_palettes')}</h3>
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(TAILWIND_COLORS).map(([name, colors]) => (
             <div key={name} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">{name}</h4>
                <div className="grid grid-cols-10 gap-1 sm:gap-2">
                  {colors.map((c, i) => (
                    <button
                      key={c}
                      onClick={() => {
                        setHex(c);
                        const r = hexToRgb(c);
                        if(r) setRgb(r);
                      }}
                      className="group relative w-full aspect-square rounded-md shadow-sm border border-black/5 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-brand-500 focus:z-10"
                      style={{ backgroundColor: c }}
                      title={c}
                    >
                      <span className="sr-only">{c}</span>
                    </button>
                  ))}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
