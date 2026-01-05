import React, { useState, useEffect, useCallback } from 'react';
import { Dna, RefreshCw, Copy, Check, Settings } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';

export const RandomStringGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [result, setResult] = useState('');
  
  const { copy, isCopied } = useCopy();

  const generate = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let chars = '';
    if (useUppercase) chars += uppercase;
    if (useLowercase) chars += lowercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    if (chars === '') {
      setResult('');
      return;
    }

    let str = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      str += chars[randomValues[i] % chars.length];
    }
    setResult(str);
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)] transition-colors">
      {/* Configuration */}
      <div className="w-full md:w-72 flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
           <Settings className="text-slate-400 dark:text-slate-500" size={20} />
           <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">{t('random-string.configuration')}</h3>
        </div>

        <div className="space-y-6">
          <div>
             <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('random-string.length')}</label>
                <input 
                  type="number" 
                  min="1" 
                  max="512" 
                  value={length} 
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 0;
                    if (val > 512) val = 512;
                    setLength(val);
                  }}
                  className="w-20 p-1 px-2 text-right text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                />
             </div>
             <input 
                type="range" 
                min="1" 
                max="512" 
                value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 transition-colors"
             />
             <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">
               <span>1</span>
               <span>512</span>
             </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={useUppercase} 
                 onChange={(e) => setUseUppercase(e.target.checked)}
                 className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-brand-500 transition-colors"
               />
               <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">{t('random-string.uppercase_az')}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={useLowercase} 
                 onChange={(e) => setUseLowercase(e.target.checked)}
                 className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-brand-500 transition-colors"
               />
               <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">{t('random-string.lowercase_az')}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={useNumbers} 
                 onChange={(e) => setUseNumbers(e.target.checked)}
                 className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-brand-500 transition-colors"
               />
               <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">{t('random-string.numbers_09')}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={useSymbols} 
                 onChange={(e) => setUseSymbols(e.target.checked)}
                 className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-brand-500 transition-colors"
               />
               <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">{t('random-string.symbols')}</span>
            </label>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
           <button 
             onClick={generate}
             className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-sm"
           >
             <RefreshCw size={18} /> {t('random-string.regenerate')}
           </button>
        </div>
      </div>

      {/* Result */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col min-h-0 overflow-hidden transition-colors">
         <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
            <Dna size={16} className="text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 transition-colors">{t('random-string.generated_string')}</span>
         </div>
         <div className="flex-1 p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl relative group">
                <textarea
                    readOnly
                    value={result}
                    className="w-full h-32 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono text-lg md:text-xl text-slate-800 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-center flex items-center justify-center transition-colors shadow-inner"
                />
                {result && (
                    <div className="absolute top-4 right-4">
                        <button 
                            onClick={() => copy(result)}
                            className="p-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-all"
                            title={t('random-string.copy')}
                        >
                            {isCopied() ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                        </button>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
