import React, { useState, useMemo } from 'react';
import { Type, Hash, Copy, Check, Trash2 } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';
import { CodeEditor } from '../components/CodeEditor';

export const TextInspector: React.FC = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const { copy, isCopied } = useCopy();

  const stats = useMemo(() => {
    return {
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, '').length,
      words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
      lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
      bytes: new Blob([text]).size
    };
  }, [text]);

  const transform = (type: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'reverse') => {
    let result = text;
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'camel':
        result = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
        break;
      case 'snake':
        result = text
          .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('_') || text;
        break;
      case 'kebab':
        result = text
          .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('-') || text;
        break;
       case 'reverse':
        result = text.split('').reverse().join('');
        break;
    }
    setText(result);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-4 transition-colors">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 transition-colors">
         <div className="flex items-center gap-2 px-3 border-r border-slate-100 dark:border-slate-800 mr-1 transition-colors">
             <Type size={18} className="text-slate-400 dark:text-slate-500" />
             <span className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">{t('text-inspector.case')}</span>
         </div>
         <button onClick={() => transform('upper')} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors uppercase">
            {t('text-inspector.uppercase')}
         </button>
         <button onClick={() => transform('lower')} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors lowercase">
            {t('text-inspector.lowercase')}
         </button>
         <button onClick={() => transform('title')} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors capitalize">
            {t('text-inspector.title_case')}
         </button>
         <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 transition-colors"></div>
         <button onClick={() => transform('camel')} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
            {t('text-inspector.camel_case')}
         </button>
         <button onClick={() => transform('snake')} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
            {t('text-inspector.snake_case')}
         </button>
          <button onClick={() => transform('kebab')} className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
             {t('text-inspector.kebab_case')}
          </button>
          
          <div className="flex-1"></div>

          <button 
             onClick={() => copy(text)}
             className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
             {isCopied() ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button 
             onClick={() => setText('')}
             className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
             <Trash2 size={14} />
          </button>
       </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Editor */}
        <div className="flex-1 relative">
           <CodeEditor
            value={text}
            onChange={setText}
            language="text"
            placeholder={t('text-inspector.placeholder')}
            className="w-full h-full rounded-xl shadow-sm bg-white"
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none bg-white/80 backdrop-blur px-2 py-1 rounded">
            {text.length > 0 ? t('text-inspector.typing') : t('text-inspector.empty')}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-4">
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 transition-colors">
                 <Hash size={16} className="text-slate-400 dark:text-slate-500" />
                 <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm transition-colors">{t('text-inspector.statistics')}</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                 <StatRow label={t('text-inspector.characters')} value={stats.chars} />
                 <StatRow label={t('text-inspector.words')} value={stats.words} />
                 <StatRow label={t('text-inspector.lines')} value={stats.lines} />
                 <StatRow label={t('text-inspector.bytes')} value={stats.bytes} suffix=" B" />
                 <StatRow label={t('text-inspector.no_spaces')} value={stats.charsNoSpaces} />
              </div>
           </div>

           <div className="bg-brand-50 dark:bg-brand-500/10 rounded-xl p-4 border border-brand-100 dark:border-brand-500/20 transition-colors">
              <h4 className="text-brand-800 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2 transition-colors">{t('text-inspector.details')}</h4>
              <p className="text-xs text-brand-600 dark:text-brand-500/80 leading-relaxed transition-colors">
                 {t('text-inspector.details_text')}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string; value: number; suffix?: string }> = ({ label, value, suffix = '' }) => (
  <div className="flex items-center justify-between px-4 py-3 transition-colors">
    <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{label}</span>
    <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100 transition-colors">
      {value.toLocaleString()}{suffix}
    </span>
  </div>
);