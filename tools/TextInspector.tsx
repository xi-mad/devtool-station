import React, { useState, useMemo } from 'react';
import { Type, Hash, Copy, Check, Trash2 } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';

export const TextInspector: React.FC = () => {
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
    <div className="flex flex-col h-[calc(100vh-180px)] gap-4">
      {/* Toolbar */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-2">
         <div className="flex items-center gap-2 px-3 border-r border-slate-100 mr-1">
             <Type size={18} className="text-slate-400" />
             <span className="text-sm font-medium text-slate-600">Case</span>
         </div>
         <button onClick={() => transform('upper')} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 rounded-lg border border-slate-200 transition-colors uppercase">
            UPPERCASE
         </button>
         <button onClick={() => transform('lower')} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 rounded-lg border border-slate-200 transition-colors lowercase">
            lowercase
         </button>
         <button onClick={() => transform('title')} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 rounded-lg border border-slate-200 transition-colors capitalize">
            Title Case
         </button>
         <div className="w-px h-6 bg-slate-200 mx-1"></div>
         <button onClick={() => transform('camel')} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 rounded-lg border border-slate-200 transition-colors">
            camelCase
         </button>
         <button onClick={() => transform('snake')} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 rounded-lg border border-slate-200 transition-colors">
            snake_case
         </button>
          <button onClick={() => transform('kebab')} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 rounded-lg border border-slate-200 transition-colors">
             kebab-case
          </button>
          
          <div className="flex-1"></div>

          <button 
             onClick={() => copy(text)}
             className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
          >
             {isCopied() ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button 
             onClick={() => setText('')}
             className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
          >
             <Trash2 size={14} />
          </button>
       </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Editor */}
        <div className="flex-1 relative">
           <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here to inspect..."
            className="w-full h-full p-6 rounded-xl border border-slate-200 font-mono text-sm leading-6 resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all"
            spellCheck={false}
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none">
            {text.length > 0 ? 'Typing...' : 'Empty'}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-4">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                 <Hash size={16} className="text-slate-400" />
                 <h3 className="font-semibold text-slate-700 text-sm">Statistics</h3>
              </div>
              <div className="divide-y divide-slate-100">
                 <StatRow label="Characters" value={stats.chars} />
                 <StatRow label="Words" value={stats.words} />
                 <StatRow label="Lines" value={stats.lines} />
                 <StatRow label="Bytes" value={stats.bytes} suffix=" B" />
                 <StatRow label="No Spaces" value={stats.charsNoSpaces} />
              </div>
           </div>

           <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <h4 className="text-brand-800 text-xs font-bold uppercase tracking-wider mb-2">Details</h4>
              <p className="text-xs text-brand-600 leading-relaxed">
                 Use the toolbar above to convert case formats. Byte count assumes UTF-8 encoding.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string; value: number; suffix?: string }> = ({ label, value, suffix = '' }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-mono font-medium text-slate-900">
      {value.toLocaleString()}{suffix}
    </span>
  </div>
);