import React, { useState } from 'react';
import { Copy, Trash2, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';
import { CodeEditor } from '../components/CodeEditor';

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

  const removeNewlines = () => {
    if (!input.trim()) return;
    // Remove literal \n characters (the two-character sequence backslash-n)
    const cleaned = input.replace(/\\n/g, '');
    setInput(cleaned);
    setError(null);
  };

  const addEscape = () => {
    if (!input.trim()) return;
    try {
      // First parse to validate JSON, then stringify with escaping
      const parsed = JSON.parse(input);
      const escaped = JSON.stringify(JSON.stringify(parsed));
      // Remove the outer quotes added by double stringify
      setInput(escaped.slice(1, -1));
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const removeEscape = () => {
    if (!input.trim()) return;
    try {
      // Directly unescape the string without requiring valid JSON
      // Wrap in quotes and parse to handle escape sequences
      const unescaped = JSON.parse(`"${input}"`);
      setInput(unescaped);
      setError(null);
    } catch (e) {
      // If that fails, try manual replacement of common escape sequences
      try {
        let result = input
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
        setInput(result);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-180px)]">
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2 items-center justify-between bg-slate-50 rounded-t-xl">
        <div className="flex flex-wrap gap-2">
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
          <button 
            onClick={removeNewlines}
            className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            title="Remove literal \n characters"
          >
            {t('json-formatter.remove_newlines')}
          </button>
          <button 
            onClick={addEscape}
            className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            title="Add escape sequences"
          >
            {t('json-formatter.add_escape')}
          </button>
          <button 
            onClick={removeEscape}
            className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            title="Remove escape sequences"
          >
            {t('json-formatter.remove_escape')}
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
        <CodeEditor
          value={input}
          onChange={setInput}
          language="json"
          placeholder={t('json-formatter.placeholder')}
          className="w-full h-full rounded-xl border border-slate-200 shadow-sm bg-white"
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
