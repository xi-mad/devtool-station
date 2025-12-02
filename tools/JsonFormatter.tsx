import React, { useState } from 'react';
import { Copy, Trash2, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';

export const JsonFormatter: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { copy, isCopied } = useCopy();

  const formatJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(t('json-formatter.invalid_json'));
      }
    }
  };

  const compressJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const clear = () => {
    setInput('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-180px)]">
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2 items-center justify-between bg-slate-50 rounded-t-xl">
        <div className="flex gap-2">
          <button 
            onClick={formatJson}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            {t('json-formatter.prettify')}
          </button>
          <button 
            onClick={compressJson}
            className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            {t('json-formatter.compress')}
          </button>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => copy(input)}
            className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title={t('json-formatter.copy')}
          >
            {isCopied() ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          </button>
          <button 
            onClick={clear}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t('json-formatter.clear')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="relative flex-1">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('json-formatter.placeholder')}
          className="w-full h-full p-4 font-mono text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500/50"
          spellCheck={false}
        />
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span className="font-mono">{error}</span>
          </div>
        )}
        {!error && input && (
          <div className="absolute bottom-4 right-4 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-sm opacity-90">
             <CheckCircle size={12} /> {t('json-formatter.valid_json')}
          </div>
        )}
      </div>
    </div>
  );
};
