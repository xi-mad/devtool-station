import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Download, Copy, Check, Trash2, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '../components/ui/CopyButton';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TwoColumnLayout } from '../components/ui/TwoColumnLayout';
import { ResultPanel } from '../components/ui/ResultPanel';
import { SliderInput } from '../components/ui/SliderInput';

export const QrCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const maxLength = 2000;
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    // Allow input but warn if over limit
    setText(newText);
  };

  const isOverLimit = text.length > maxLength;
  const isNearLimit = text.length > maxLength * 0.9;

  return (
    <TwoColumnLayout
      sidebarWidth="w-80"
      breakpoint="lg"
      sidebar={
        <>
         <SectionHeader icon={Settings} title={t('qr-code.configuration')} className="p-4 [&_h3]:text-slate-900 [&_h3]:dark:text-white" />

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('qr-code.content')}</label>
             <textarea 
                value={text}
                onChange={handleTextChange}
                placeholder={t('qr-code.placeholder')}
                className={`w-full h-32 p-3 rounded-lg border text-sm focus:ring-2 focus:ring-brand-500/20 outline-none resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors ${
                  isOverLimit 
                    ? 'border-red-300 dark:border-red-500/50 focus:border-red-500' 
                    : isNearLimit 
                    ? 'border-amber-300 dark:border-amber-500/50 focus:border-amber-500'
                    : 'border-slate-200 dark:border-slate-800 focus:border-brand-500'
                }`}
             />
             <div className="flex justify-between items-center mt-2">
                <div className={`text-xs transition-colors ${
                  isOverLimit 
                    ? 'text-red-600 dark:text-red-400 font-medium' 
                    : isNearLimit 
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {text.length} / {maxLength} {t('qr-code.characters')}
                  {isOverLimit && ` - ⚠️ ${t('qr-code.limit_exceeded')}`}
                </div>
                <button
                    onClick={() => setText('')}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"
                >
                    <Trash2 size={12} /> {t('qr-code.clear')}
                </button>
             </div>
          </div>

          <SliderInput
            label={`${t('qr-code.size')}: ${size}px`}
            value={size}
            min={128}
            max={512}
            step={8}
            onChange={setSize}
          />

          <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">{t('qr-code.foreground')}</label>
                 <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
                    />
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 transition-colors">{fgColor}</span>
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">{t('qr-code.background')}</label>
                 <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
                    />
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 transition-colors">{bgColor}</span>
                 </div>
              </div>
          </div>
        </div>
        </>
      }
    >
      <ResultPanel>
         <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
           <div className="flex items-center gap-2">
             <div className="p-1.5 bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 rounded-lg transition-colors">
               <QrCode size={18} />
             </div>
             <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">{t('qr-code.preview')}</h3>
           </div>
           <div className="flex gap-2">
             <CopyButton
                text={text}
                copyKey="qr-text"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
             >
               {(copied) => <>{copied ? <Check size={16} /> : <Copy size={16} />}{t('qr-code.copy_text')}</>}
             </CopyButton>
             <button 
                onClick={downloadQr}
                className="flex items-center gap-1.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
             >
               <Download size={16} />
               {t('qr-code.download_png')}
             </button>
           </div>
         </div>

         <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/20 overflow-auto transition-colors">
            {isOverLimit ? (
              <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-500/30 transition-colors">
                <div className="text-4xl mb-4">⚠️</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('qr-code.content_too_long')}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {t('qr-code.current_length')}: {text.length} {t('qr-code.characters')}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {t('qr-code.max_length')}: {maxLength} {t('qr-code.characters')}
                </div>
                <div className="text-xs text-amber-600 mt-3">
                  {t('qr-code.reduce_content')}
                </div>
              </div>
            ) : (
              <div 
                  ref={qrRef}
                  className="bg-white p-4 shadow-xl rounded-xl border border-slate-100 dark:border-slate-800 transition-colors"
                  style={{ backgroundColor: bgColor }}
              >
                  <QRCode 
                      key={`qr-${Math.floor(text.length / 100)}`}
                      value={text || ' '}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level="M"
                  />
              </div>
            )}
         </div>
      </ResultPanel>
    </TwoColumnLayout>
  );
};
