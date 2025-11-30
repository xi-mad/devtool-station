import React, { useState } from 'react';
import { Maximize2, X, Copy, Check } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';

export const FullscreenColor: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { copy, isCopied } = useCopy();

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls on mouse inactivity
  React.useEffect(() => {
    if (!isFullscreen) return;

    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Initial timeout
    timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 cursor-none"
        style={{ backgroundColor: color }}
      >
        <div 
          className={`absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white/30"
          />
          <div className="text-white">
            <div className="text-2xl font-bold font-mono uppercase">{color}</div>
            <div className="text-sm opacity-80">Click to change color</div>
          </div>
          <button
            onClick={() => copy(color)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors cursor-pointer"
            title="Copy color"
          >
            {isCopied() ? <Check size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors cursor-pointer"
            title="Exit fullscreen"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)]">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
            <Maximize2 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Fullscreen Color Display</h3>
            <p className="text-xs text-slate-500">Choose a color and view it in fullscreen</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          {/* Color Preview */}
          <div 
            className="w-full aspect-video rounded-3xl shadow-2xl border-4 border-white transition-colors duration-300"
            style={{ backgroundColor: color }}
          />

          {/* Color Picker */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 space-y-6">
            <div className="flex items-center gap-6">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-slate-200 shadow-sm"
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-mono text-lg uppercase focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                  <button
                    onClick={() => copy(color)}
                    className="p-3 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-slate-200"
                  >
                    {isCopied() ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                  </button>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-sm"
                >
                  <Maximize2 size={20} />
                  Enter Fullscreen
                </button>
              </div>
            </div>

            {/* Quick Colors */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Quick Colors</label>
              <div className="grid grid-cols-8 gap-2">
                {[
                  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
                  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
                  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
                  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
                  '#f43f5e', '#000000', '#ffffff', '#6b7280'
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-full aspect-square rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-all hover:scale-110 shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
