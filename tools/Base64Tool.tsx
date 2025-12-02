import React, { useState } from 'react';
import { Binary, Copy, Check, Trash2 } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';

export const Base64Tool: React.FC = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');
  const { copy, isCopied } = useCopy();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    try {
      setBase64(btoa(val));
    } catch (e) {
      // Ignore partial input errors
    }
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBase64(val);
    try {
      setText(atob(val));
    } catch (e) {
      // Ignore errors
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)]">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
            <Binary size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{t('base64.title')}</h3>
            <p className="text-xs text-slate-500">{t('base64.subtitle')}</p>
          </div>
        </div>
        <button 
          onClick={() => { setText(''); setBase64(''); }}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title={t('base64.clear_all')}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">{t('base64.plain_text')}</label>
            <button 
                onClick={() => copy(text, 'text')}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
            >
                {isCopied('text') ? <Check size={14} /> : <Copy size={14} />}
                {isCopied('text') ? t('base64.copied') : t('base64.copy')}
            </button>
        </div>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder={t('base64.placeholder_text')}
          className="flex-1 p-4 rounded-xl border border-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">{t('base64.base64_output')}</label>
            <button 
                onClick={() => copy(base64, 'base64')}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
            >
                {isCopied('base64') ? <Check size={14} /> : <Copy size={14} />}
                {isCopied('base64') ? t('base64.copied') : t('base64.copy')}
            </button>
        </div>
         <textarea
          value={base64}
          onChange={handleBase64Change}
          placeholder={t('base64.placeholder_base64')}
          className="flex-1 p-4 rounded-xl border border-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm"
        />
      </div>
      </div>
      </div>
  );
};
