import React, { useState } from 'react';
import { Database, Play, Copy, Trash2 } from 'lucide-react';

export const SqlFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  
  const formatSql = () => {
    let sql = input.trim();
    if (!sql) return;

    // Simple Regex-based formatter
    // 1. Collapse spaces
    sql = sql.replace(/\s+/g, ' ');
    
    // 2. Add newlines before major keywords
    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 
        'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'UNION', 'VALUES', 'SET', 'UPDATE', 'INSERT INTO', 'DELETE FROM'
    ];
    
    // Case insensitive replace to insert newlines
    keywords.forEach(kw => {
        const regex = new RegExp(`\\s(${kw})\\s`, 'gi');
        sql = sql.replace(regex, '\n$1 ');
    });

    // 3. Indent columns in SELECT slightly (after commas)
    sql = sql.replace(/\s*,\s*/g, ',\n    ');

    // 4. Bracket handling (simple)
    sql = sql.replace(/\s*\(\s*/g, ' (\n    ');
    sql = sql.replace(/\s*\)\s*/g, '\n) ');

    setInput(sql);
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
                onClick={() => navigator.clipboard.writeText(input)}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                title="Copy"
            >
                <Copy size={18} />
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