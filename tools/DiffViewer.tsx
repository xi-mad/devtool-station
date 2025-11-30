import React, { useState, useEffect } from 'react';
import * as Diff from 'diff'; 
import { AlertCircle, Columns, FileDiff } from 'lucide-react';

type DiffMethod = 'chars' | 'words' | 'lines' | 'json';
type ViewMode = 'unified' | 'split';

export const DiffViewer: React.FC = () => {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [method, setMethod] = useState<DiffMethod>('lines');
  const [viewMode, setViewMode] = useState<ViewMode>('unified');
  const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    try {
      let result: Diff.Change[] = [];
      
      if (method === 'json') {
        try {
          // Normalize JSON for comparison
          const leftObj = left ? JSON.parse(left) : {};
          const rightObj = right ? JSON.parse(right) : {};
          // Use diffJson
          result = Diff.diffJson(leftObj, rightObj);
        } catch (e) {
          // If not valid JSON, fallback to line diff but show warning
          result = Diff.diffLines(left, right);
          setError("Invalid JSON in one or both inputs. Showing line diff instead.");
        }
      } else if (method === 'chars') {
        result = Diff.diffChars(left, right);
      } else if (method === 'words') {
        result = Diff.diffWords(left, right);
      } else {
        result = Diff.diffLines(left, right);
      }
      setDiffResult(result);
    } catch (e) {
      console.error(e);
      setDiffResult([]);
    }
  }, [left, right, method]);

  const renderUnified = () => (
    <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-6">
      {diffResult.map((part, index) => {
        const color = part.added 
          ? 'bg-green-100 text-green-800' 
          : part.removed 
            ? 'bg-red-100 text-red-800 decoration-red-400 line-through decoration-2 opacity-70' 
            : 'text-slate-600';
        return (
          <span key={index} className={`${color} px-0.5 rounded-sm`}>
            {part.value}
          </span>
        );
      })}
    </pre>
  );

  const renderSplit = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Original State (Left) */}
      <div className="overflow-auto border-r border-slate-100 pr-2">
         <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100 pb-2 mb-2">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
              Original
            </span>
         </div>
         <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-6">
            {diffResult.map((part, index) => {
              if (part.added) return null; // Skip added parts
              const color = part.removed ? 'bg-red-100 text-red-800' : 'text-slate-600';
              return (
                <span key={index} className={`${color} px-0.5 rounded-sm`}>
                  {part.value}
                </span>
              );
            })}
         </pre>
      </div>

      {/* Modified State (Right) */}
      <div className="overflow-auto pl-2">
         <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100 pb-2 mb-2">
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
              Modified
            </span>
         </div>
         <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-6">
            {diffResult.map((part, index) => {
              if (part.removed) return null; // Skip removed parts
              const color = part.added ? 'bg-green-100 text-green-800' : 'text-slate-600';
              return (
                <span key={index} className={`${color} px-0.5 rounded-sm`}>
                  {part.value}
                </span>
              );
            })}
         </pre>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-4">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-200 gap-3">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['lines', 'words', 'chars', 'json'] as DiffMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors whitespace-nowrap
                ${method === m 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
              `}
            >
              {m} Diff
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
             {error && (
                <div className="text-xs text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-2 py-1 rounded">
                    <AlertCircle size={14} /> <span className="truncate max-w-[200px]">{error}</span>
                </div>
            )}
            
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => setViewMode('unified')}
                    className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${viewMode === 'unified' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Unified View"
                >
                    <FileDiff size={16} />
                    <span className="text-xs font-medium">Unified</span>
                </button>
                <button
                    onClick={() => setViewMode('split')}
                    className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${viewMode === 'split' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Split View"
                >
                    <Columns size={16} />
                    <span className="text-xs font-medium">Split</span>
                </button>
            </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-2 h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                <span>Original Text</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-normal">Input A</span>
            </span>
            <textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                className="flex-1 w-full p-4 rounded-xl border border-slate-200 font-mono text-xs md:text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all"
                placeholder="Paste original text here..."
                spellCheck={false}
            />
        </div>
        <div className="flex flex-col gap-2 h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                 <span>Changed Text</span>
                 <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-normal">Input B</span>
            </span>
             <textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                className="flex-1 w-full p-4 rounded-xl border border-slate-200 font-mono text-xs md:text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all"
                placeholder="Paste changed text here..."
                spellCheck={false}
            />
        </div>
      </div>

      {/* Result Area */}
      <div className="h-1/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[200px]">
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Comparison Result</span>
            <span className="text-[10px] text-slate-400 font-mono">
                {diffResult.filter(r => r.added).length} insertions, {diffResult.filter(r => r.removed).length} deletions
            </span>
        </div>
        <div className="flex-1 overflow-auto p-4">
            {diffResult.length === 0 && (left || right) ? (
                <span className="text-slate-400 italic text-sm">Computing diff...</span>
            ) : !left && !right ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <FileDiff size={32} className="opacity-20" />
                    <span className="text-sm italic">Enter text in both fields above to compare</span>
                </div>
            ) : (
                viewMode === 'split' ? renderSplit() : renderUnified()
            )}
        </div>
      </div>
    </div>
  );
};