import React, { useState, useEffect } from 'react';
import * as Diff from 'diff'; 
import { AlertCircle, Columns, FileDiff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CodeEditor } from '../components/CodeEditor';

type DiffMethod = 'chars' | 'words' | 'lines' | 'json';
type ViewMode = 'unified' | 'split';

export const DiffViewer: React.FC = () => {
  const { t } = useTranslation();
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
          setError(t('diff-viewer.invalid_json'));
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
  }, [left, right, method, t]);

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
              {t('diff-viewer.original')}
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
              {t('diff-viewer.modified')}
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
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-200 gap-3 sticky top-0 z-20">
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
              {m} {t('diff-viewer.diff_suffix')}
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
                    title={t('diff-viewer.unified_view')}
                >
                    <FileDiff size={16} />
                    <span className="text-xs font-medium">{t('diff-viewer.unified')}</span>
                </button>
                <button
                    onClick={() => setViewMode('split')}
                    className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${viewMode === 'split' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    title={t('diff-viewer.split_view')}
                >
                    <Columns size={16} />
                    <span className="text-xs font-medium">{t('diff-viewer.split')}</span>
                </button>
            </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase flex justify-between sticky top-[60px] z-10 bg-slate-50/80 backdrop-blur py-1 rounded">
                <span>{t('diff-viewer.original_text')}</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-normal">{t('diff-viewer.input_a')}</span>
            </span>
            <CodeEditor
                value={left}
                onChange={setLeft}
                language={method === 'json' ? 'json' : 'text'}
                className="w-full flex-1 border border-slate-200 rounded-xl shadow-sm bg-white min-h-[300px]"
                placeholder={t('diff-viewer.paste_original')}
            />
        </div>
        <div className="flex flex-col gap-2 h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase flex justify-between sticky top-[60px] z-10 bg-slate-50/80 backdrop-blur py-1 rounded">
                 <span>{t('diff-viewer.changed_text')}</span>
                 <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-normal">{t('diff-viewer.input_b')}</span>
            </span>
             <CodeEditor
                value={right}
                onChange={setRight}
                language={method === 'json' ? 'json' : 'text'}
                className="w-full flex-1 border border-slate-200 rounded-xl shadow-sm bg-white min-h-[300px]"
                placeholder={t('diff-viewer.paste_changed')}
            />
        </div>
      </div>

      {/* Result Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[200px]">
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between rounded-t-xl sticky top-[60px] z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('diff-viewer.comparison_result')}</span>
            <span className="text-[10px] text-slate-400 font-mono">
                {diffResult.filter(r => r.added).length} {t('diff-viewer.insertions')}, {diffResult.filter(r => r.removed).length} {t('diff-viewer.deletions')}
            </span>
        </div>
        <div className="p-4">
            {diffResult.length === 0 && (left || right) ? (
                <span className="text-slate-400 italic text-sm">{t('diff-viewer.computing')}</span>
            ) : !left && !right ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2">
                    <FileDiff size={32} className="opacity-20" />
                    <span className="text-sm italic">{t('diff-viewer.empty_state')}</span>
                </div>
            ) : (
                viewMode === 'split' ? renderSplit() : renderUnified()
            )}
        </div>
      </div>
    </div>
  );
};