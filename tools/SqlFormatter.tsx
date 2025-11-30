import React, { useState } from 'react';
import { Database, Play, Copy, Trash2, Check } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { format } from 'sql-formatter';

export const SqlFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const { copy, isCopied } = useCopy();
  
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
      // Fallback or error handling
      console.error(e);
    }
  };

  const compressSql = () => {
      setInput(input.replace(/\s+/g, ' ').trim());
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-4">
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
         <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                <Database size={18} />
            </div>
            <span className="font-semibold text-slate-700">SQL Formatter</span>
         </div>
         <div className="flex gap-2">
            <button 
                onClick={formatSql}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
            >
                <Play size={16} /> Format
            </button>
            <button 
                onClick={compressSql}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
                Minify
            </button>
            <button 
                onClick={() => copy(input)}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                title="Copy"
            >
                {isCopied() ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            </button>
            <button 
                onClick={() => setInput('')}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Clear"
            >
                <Trash2 size={18} />
            </button>
         </div>
      </div>

      <div className="flex-1">
         <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="PASTE YOUR SQL HERE..."
            className="w-full h-full p-6 rounded-xl border border-slate-200 font-mono text-sm leading-6 text-slate-800 resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm"
            spellCheck={false}
         />
      </div>
    </div>
  );
};