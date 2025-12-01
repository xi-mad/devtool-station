import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Download, Copy, Check, Trash2, Settings } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';

export const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const { copy, isCopied } = useCopy();
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      // Fill background
      if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
      {/* Configuration Panel */}
      <div className="w-full lg:w-80 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50/50">
           <Settings className="text-slate-400" size={20} />
           <h3 className="font-semibold text-slate-900">Configuration</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
             <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL..."
                className="w-full h-32 p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none"
             />
             <div className="flex justify-end mt-2">
                <button 
                    onClick={() => setText('')}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"
                >
                    <Trash2 size={12} /> Clear
                </button>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Size: {size}px</label>
             <input 
                type="range" 
                min="128" 
                max="512" 
                step="8"
                value={size} 
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Foreground</label>
                 <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono text-slate-500">{fgColor}</span>
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Background</label>
                 <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono text-slate-500">{bgColor}</span>
                 </div>
              </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-2">
             <div className="p-1.5 bg-brand-100 text-brand-700 rounded-lg">
               <QrCode size={18} />
             </div>
             <h3 className="font-semibold text-slate-900">Preview</h3>
           </div>
           <div className="flex gap-2">
             <button 
                onClick={() => copy(text)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all"
             >
               {isCopied() ? <Check size={16} /> : <Copy size={16} />}
               Copy Text
             </button>
             <button 
                onClick={downloadQr}
                className="flex items-center gap-1.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
             >
               <Download size={16} />
               Download PNG
             </button>
           </div>
         </div>

         <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 overflow-auto">
            <div 
                ref={qrRef}
                className="bg-white p-4 shadow-xl rounded-xl border border-slate-100"
                style={{ backgroundColor: bgColor }}
            >
                <QRCode 
                    value={text || ' '}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="M"
                />
            </div>
         </div>
      </div>
    </div>
  );
};
