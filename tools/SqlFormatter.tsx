import React, { useState } from 'react';
import { Database, Play, Copy, Trash2, Check } from 'lucide-react';
import { format } from 'sql-formatter';
import { useTranslation } from 'react-i18next';
import { CodeEditor } from '../components/CodeEditor';
import { CopyButton } from '../components/ui/CopyButton';
import { ClearButton } from '../components/ui/ClearButton';

export const SqlFormatter: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const formatSql = () => {
    let sql = input.trim();
    if (!sql) return;

    try {
      const formatted = format(sql, {
        language: 'sql',
        tabWidth: 2,
        keywordCase: 'upper',
      });
      setInput(formatted);
    } catch (e) {
      console.error(e);
    }
  };

  const compressSql = () => {
    setInput(input.replace(/\s+/g, ' ').trim());
  };

  return (
    <div className="flex flex-col h-[calc(100vh)] gap-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg transition-colors">
            <Database size={18} />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('sql-formatter.title')}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={formatSql}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Play size={16} /> {t('sql-formatter.format')}
          </button>
          <button
            onClick={compressSql}
            className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            {t('sql-formatter.minify')}
          </button>
          <CopyButton
            text={input}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors border border-transparent hover:border-brand-100 dark:hover:border-slate-800"
          >
            {(copied) => <>{copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}</>}
          </CopyButton>
          <ClearButton onClick={() => setInput('')} title={t('sql-formatter.clear')} />
        </div>
      </div>

      <div className="flex-1 relative">
        <CodeEditor
          value={input}
          onChange={setInput}
          language="sql"
          placeholder={t('sql-formatter.placeholder')}
          className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors"
        />
      </div>
    </div>
  );
};
