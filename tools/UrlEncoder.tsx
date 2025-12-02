import React, { useState, useEffect } from 'react';
import { Link, AlertCircle, Copy, Check, Trash2 } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';

type EncodeMode = 'component' | 'uri';

export const UrlEncoder: React.FC = () => {
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
      setError('Encoding failed');
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
         setError('Invalid URL encoding');
      }
    }
  };

  // Re-run encoding if mode changes
  useEffect(() => {
    handleDecodedChange(decoded);
  }, [mode]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)]">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
            <Link size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">URL Encoder / Decoder</h3>
            <p className="text-xs text-slate-500">Convert text to URL-safe format</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('component')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'component' 
                ? 'bg-white text-brand-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Component
          </button>
          <button
            onClick={() => setMode('uri')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'uri' 
                ? 'bg-white text-brand-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Full URI
          </button>
        </div>
        <button 
          onClick={() => { setDecoded(''); setEncoded(''); setError(null); }}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear All"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Editors */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-2 h-full">
          <label className="text-sm font-medium text-slate-700 flex justify-between items-center">
            <span>Decoded Text</span>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-normal">Normal string</span>
                <button 
                    onClick={() => copy(decoded, 'decoded')}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
                >
                    {isCopied('decoded') ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
          </label>
          <textarea
            value={decoded}
            onChange={(e) => handleDecodedChange(e.target.value)}
            placeholder="Type text to encode..."
            className="flex-1 p-4 rounded-xl border border-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all"
          />
        </div>

        <div className="flex flex-col gap-2 h-full relative">
          <label className="text-sm font-medium text-slate-700 flex justify-between items-center">
            <span>Encoded Text</span>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-normal">URL Safe</span>
                <button 
                    onClick={() => copy(encoded, 'encoded')}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
                >
                    {isCopied('encoded') ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
          </label>
          <textarea
            value={encoded}
            onChange={(e) => handleEncodedChange(e.target.value)}
            placeholder="Type URL encoded text..."
            className={`flex-1 p-4 rounded-xl border font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all ${
              error ? 'border-red-300 bg-red-50/10' : 'border-slate-200'
            }`}
          />
          {error && (
            <div className="absolute bottom-4 right-4 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-100 flex items-center gap-1.5 shadow-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 flex gap-4">
        <div>
            <span className="font-semibold text-slate-700">Component Mode:</span> Encodes characters like <code className="bg-slate-200 px-1 rounded">/</code> <code className="bg-slate-200 px-1 rounded">:</code> <code className="bg-slate-200 px-1 rounded">&</code>. Use for query parameters.
        </div>
        <div className="hidden md:block w-px bg-slate-300 mx-2"></div>
        <div>
            <span className="font-semibold text-slate-700">Full URI Mode:</span> Preserves URL structure. Use for full links.
        </div>
      </div>
    </div>
  );
};