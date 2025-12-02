import React, { useState } from 'react';
import { Languages, Copy, Check, Trash2 } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';

export const UnicodeConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [unicode, setUnicode] = useState('');
  const { copy, isCopied } = useCopy();

  const handleTextChange = (val: string) => {
    setText(val);
    if (!val) {
      setUnicode('');
      return;
    }
    const converted = val.split('').map(char => {
      const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
      return `\\u${code}`;
    }).join('');
    setUnicode(converted);
  };

  const handleUnicodeChange = (val: string) => {
    setUnicode(val);
    if (!val) {
      setText('');
      return;
    }
    try {
      // Replace \uXXXX with actual characters
      const converted = val.replace(/\\u([0-9A-F]{4})/gi, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
      setText(converted);
    } catch (e) {
      // If conversion fails (e.g. partial input), we might just leave text as is or show error
      // For now, let's just try best effort
    }
  };

  const clearAll = () => {
    setText('');
    setUnicode('');
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)]">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
            <Languages size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Unicode Converter</h3>
            <p className="text-xs text-slate-500">Text ↔ Unicode Escapes</p>
          </div>
        </div>
        <button 
          onClick={clearAll}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear All"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        {/* Text Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-slate-700">Native Text</label>
             <button 
                onClick={() => copy(text, 'text')}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
             >
                {isCopied('text') ? <Check size={14} /> : <Copy size={14} />}
                {isCopied('text') ? 'Copied' : 'Copy'}
             </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type Chinese or any text here..."
            className="flex-1 p-4 rounded-xl border border-slate-200 font-sans text-base resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm"
          />
        </div>

        {/* Unicode Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-slate-700">Unicode (CN)</label>
             <button 
                onClick={() => copy(unicode, 'unicode')}
                className="text-xs flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
             >
                {isCopied('unicode') ? <Check size={14} /> : <Copy size={14} />}
                {isCopied('unicode') ? 'Copied' : 'Copy'}
             </button>
          </div>
          <textarea
            value={unicode}
            onChange={(e) => handleUnicodeChange(e.target.value)}
            placeholder="\u4F60\u597D..."
            className="flex-1 p-4 rounded-xl border border-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm bg-slate-50"
          />
        </div>
      </div>
    </div>
  );
};
