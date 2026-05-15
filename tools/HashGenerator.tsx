import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '../components/ui/CopyButton';
import { StyledTextarea } from '../components/ui/StyledTextarea';
import { ResultPanel } from '../components/ui/ResultPanel';

export const HashGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

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
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)] transition-colors">
      <div className="flex flex-col gap-2 h-1/3 min-h-[150px]">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('hash-generator.input_text')}</label>
        <StyledTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('hash-generator.placeholder')}
        />
      </div>

      <ResultPanel>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 transition-colors">
          <Shield size={16} className="text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t('hash-generator.generated_hashes')}</span>
        </div>
        <div className="overflow-y-auto p-6 space-y-6">
          {algorithms.map((algo) => (
            <div key={algo} className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{algo}</label>
              <div className="relative group">
                <div className="w-full p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs md:text-sm text-slate-700 dark:text-slate-300 break-all pr-12 transition-colors">
                  {hashes[algo] || <span className="text-slate-400 dark:text-slate-500 italic">{t('hash-generator.waiting')}</span>}
                </div>
                {hashes[algo] && (
                  <CopyButton
                    text={hashes[algo]}
                    copyKey={algo}
                    className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 text-slate-400 hover:text-brand-600 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200"
                  >
                    {(copied) => <>{copied ? <Check size={16} /> : <Copy size={16} />}</>}
                  </CopyButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </ResultPanel>
    </div>
  );
};
