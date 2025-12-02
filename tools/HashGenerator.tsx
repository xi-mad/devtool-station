import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';

export const HashGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { copy, isCopied } = useCopy();

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }

    const results: Record<string, string> = {
      'MD5': CryptoJS.MD5(input).toString(),
      'SHA-1': CryptoJS.SHA1(input).toString(),
      'SHA-256': CryptoJS.SHA256(input).toString(),
      'SHA-512': CryptoJS.SHA512(input).toString(),
      'SHA-3': CryptoJS.SHA3(input).toString(),
      'RIPEMD-160': CryptoJS.RIPEMD160(input).toString(),
    };

    setHashes(results);
  }, [input]);



  const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-3', 'RIPEMD-160'];

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)]">
      {/* Input */}
      <div className="flex flex-col gap-2 h-1/3 min-h-[150px]">
        <label className="text-sm font-medium text-slate-700">{t('hash-generator.input_text')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('hash-generator.placeholder')}
          className="flex-1 p-4 rounded-xl border border-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm"
        />
      </div>

      {/* Outputs */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Shield size={16} className="text-slate-500" />
            <span className="text-xs font-bold uppercase text-slate-500">{t('hash-generator.generated_hashes')}</span>
         </div>
         <div className="overflow-y-auto p-6 space-y-6">
            {algorithms.map((algo) => (
               <div key={algo} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">{algo}</label>
                  <div className="relative group">
                     <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs md:text-sm text-slate-700 break-all pr-12">
                        {hashes[algo] || <span className="text-slate-400 italic">{t('hash-generator.waiting')}</span>}
                     </div>
                     {hashes[algo] && (
                        <button 
                           onClick={() => copy(hashes[algo], algo)}
                           className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 text-slate-400 hover:text-brand-600 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200"
                        >
                           {isCopied(algo) ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};