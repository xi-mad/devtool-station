import React, { useState, useEffect } from 'react';
import { Link, AlertCircle, Copy, Check, Trash2 } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';

type EncodeMode = 'component' | 'uri';

export const UrlEncoder: React.FC = () => {
  const { t } = useTranslation();
  const [decoded, setDecoded] = useState('');
  const [encoded, setEncoded] = useState('');
  const [mode, setMode] = useState<EncodeMode>('component');
  const [error, setError] = useState<string | null>(null);
  const { copy, isCopied } = useCopy();

  // Auto-encode when decoded changes
  const handleDecodedChange = (val: string) => {
    setDecoded(val);
    setError(null);
    try {
      const result = mode === 'component' ? encodeURIComponent(val) : encodeURI(val);
      setEncoded(result);
    } catch (e) {
      setError(t('url-encoder.error_failed'));
    }
  };

  // Auto-decode when encoded changes
  const handleEncodedChange = (val: string) => {
    setEncoded(val);
    setError(null);
    try {
      const result = decodeURIComponent(val); // decodeURI is rarely stricter than decodeURIComponent for input
      setDecoded(result);
    } catch (e) {
      // Common to have partial input that throws URIError
      if (val.trim()) {
        // Only show error if it's not just a trailing %
         setError(t('url-encoder.error_invalid'));
      }
    }
  };

  // Re-run encoding if mode changes
  useEffect(() => {
    handleDecodedChange(decoded);
  }, [mode]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)] transition-colors">
      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg transition-colors">
            <Link size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">{t('url-encoder.title')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t('url-encoder.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg transition-colors">
          <button
            onClick={() => setMode('component')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'component' 
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t('url-encoder.component_mode')}
          </button>
          <button
            onClick={() => setMode('uri')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'uri' 
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t('url-encoder.full_uri_mode')}
          </button>
        </div>
        <button 
          onClick={() => { setDecoded(''); setEncoded(''); setError(null); }}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          title={t('url-encoder.clear_all')}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Editors */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-2 h-full">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between items-center transition-colors">
            <span>{t('url-encoder.decoded_text')}</span>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-normal transition-colors">{t('url-encoder.normal_string')}</span>
                <button 
                    onClick={() => copy(decoded, 'decoded')}
                    className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                    {isCopied('decoded') ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
          </label>
          <textarea
            value={decoded}
            onChange={(e) => handleDecodedChange(e.target.value)}
            placeholder={t('url-encoder.placeholder_decoded')}
            className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all"
          />
        </div>

        <div className="flex flex-col gap-2 h-full relative">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between items-center transition-colors">
            <span>{t('url-encoder.encoded_text')}</span>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-normal transition-colors">{t('url-encoder.url_safe')}</span>
                <button 
                    onClick={() => copy(encoded, 'encoded')}
                    className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                    {isCopied('encoded') ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
          </label>
          <textarea
            value={encoded}
            onChange={(e) => handleEncodedChange(e.target.value)}
            placeholder={t('url-encoder.placeholder_encoded')}
            className={`flex-1 p-4 rounded-xl border font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all ${
              error ? 'border-red-300 dark:border-red-500/50 bg-red-50/10 dark:bg-red-500/5 text-red-900 dark:text-red-200' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
            }`}
          />
          {error && (
            <div className="absolute bottom-4 right-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-100 dark:border-red-800/50 flex items-center gap-1.5 shadow-sm transition-colors">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-500 dark:text-slate-400 flex gap-4 transition-colors">
        <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('url-encoder.component_desc_label')}</span> {t('url-encoder.component_desc')}
        </div>
        <div className="hidden md:block w-px bg-slate-300 dark:bg-slate-700 mx-2 transition-colors"></div>
        <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('url-encoder.full_uri_desc_label')}</span> {t('url-encoder.full_uri_desc')}
        </div>
      </div>
    </div>
  );
};