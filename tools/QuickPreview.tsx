import React, { useState, useEffect } from 'react';
import { Zap, Braces, Clock, Palette, Binary, Link, Fingerprint, FileText, ArrowRight, Type, Shield, Hash, Database } from 'lucide-react';

type DetectedType = 'json' | 'timestamp' | 'color' | 'base64' | 'url' | 'jwt' | 'unknown';

export const QuickPreview: React.FC<{ onSelectTool: (id: any) => void }> = ({ onSelectTool }) => {
  const [input, setInput] = useState('');
  const [type, setType] = useState<DetectedType>('unknown');
  const [result, setResult] = useState<React.ReactNode>(null);

  useEffect(() => {
    const val = input.trim();
    if (!val) {
      setType('unknown');
      setResult(null);
      return;
    }

    // 1. Check for JSON
    if ((val.startsWith('{') || val.startsWith('[')) && (val.endsWith('}') || val.endsWith(']'))) {
      try {
        const parsed = JSON.parse(val);
        setType('json');
        setResult(
          <pre className="text-xs md:text-sm font-mono text-slate-700 whitespace-pre-wrap break-all">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
        return;
      } catch (e) {}
    }

    // 2. Check for Timestamp (10-13 digits)
    if (/^\d{10,13}$/.test(val)) {
      const num = parseInt(val);
      const isMs = val.length === 13;
      const date = new Date(isMs ? num : num * 1000);
      if (!isNaN(date.getTime())) {
        setType('timestamp');
        setResult(
          <div className="space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">ISO 8601</span>
              <span className="font-mono text-slate-900">{date.toISOString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Local</span>
              <span className="font-mono text-slate-900">{date.toLocaleString()}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-slate-500">Relative</span>
              <span className="font-mono text-slate-900">
                  {(() => {
                 const diff = Date.now() - date.getTime();
                 const seconds = Math.floor(Math.abs(diff) / 1000);
                 const suffix = diff > 0 ? 'ago' : 'from now';
                 if (seconds < 60) return `${seconds}s ${suffix}`;
                 if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${suffix}`;
                 if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${suffix}`;
                 return `${Math.floor(seconds / 86400)}d ${suffix}`;
               })()}
              </span>
            </div>
          </div>
        );
        return;
      }
    }

    // 3. Check for Color (Hex, RGB, HSL)
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i;
    if (hexRegex.test(val) || rgbRegex.test(val) || val.startsWith('hsl(')) {
        setType('color');
        setResult(
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl shadow-sm border border-slate-200" style={{ backgroundColor: val }} />
                <div className="space-y-1">
                    <div className="text-lg font-bold text-slate-900 uppercase">{val}</div>
                    <div className="text-sm text-slate-500">Valid CSS Color</div>
                </div>
            </div>
        );
        return;
    }

    // 4. Check for JWT
    if (val.split('.').length === 3 && val.startsWith('ey')) {
        try {
            const [header, payload] = val.split('.').slice(0, 2).map(part => 
                JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')))
            );
            setType('jwt');
            setResult(
                 <div className="space-y-4">
                     <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Header</div>
                        <pre className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-700">{JSON.stringify(header, null, 2)}</pre>
                     </div>
                     <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Payload</div>
                        <pre className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-700">{JSON.stringify(payload, null, 2)}</pre>
                     </div>
                </div>
            );
            return;
        } catch(e) {}
    }

    // 5. Check for URL Encoded
    if (/%[0-9A-F]{2}/i.test(val)) {
        try {
            const decoded = decodeURIComponent(val);
            if (decoded !== val) {
                setType('url');
                setResult(
                    <div className="break-all font-mono text-slate-900">{decoded}</div>
                );
                return;
            }
        } catch(e) {}
    }

    // 6. Check for Base64 (Basic check)
    // Regex is tricky for base64 as it matches normal words. checking for typical chars and length > 8
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (val.length > 8 && base64Regex.test(val) && !val.includes(' ')) {
        try {
            const decoded = atob(val);
            // Check if result looks like readable text
             if (/^[\x20-\x7E]*$/.test(decoded)) {
                setType('base64');
                setResult(
                    <div className="break-all font-mono text-slate-900">{decoded}</div>
                );
                return;
             }
        } catch(e) {}
    }

    setType('unknown');
    setResult(null);

  }, [input]);

  const getIcon = () => {
    switch(type) {
        case 'json': return Braces;
        case 'timestamp': return Clock;
        case 'color': return Palette;
        case 'base64': return Binary;
        case 'url': return Link;
        case 'jwt': return Fingerprint;
        default: return FileText;
    }
  }

  const TypeIcon = getIcon();

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Developer Tools, Simplified.
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          One input for everything. Paste JSON, timestamps, colors, or base64 to instantly preview and convert.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try json, timestamp, color, base64, jwt, or url-encoded text..."
                className="relative w-full h-32 md:h-40 p-6 rounded-xl bg-white border border-slate-200 shadow-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-lg font-mono resize-none"
            />
             {input && (
                <button 
                  onClick={() => setInput('')} 
                  className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm"
                >
                  Clear
                </button>
            )}
        </div>

        {/* Live Result Card */}
        {input && (
             <div className={`
                bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300
                ${type !== 'unknown' ? 'border-brand-200 ring-4 ring-brand-50/50' : 'border-slate-200 opacity-50'}
             `}>
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TypeIcon size={16} className={type !== 'unknown' ? 'text-brand-600' : 'text-slate-400'} />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {type === 'unknown' ? 'Auto-detecting...' : `Detected: ${type}`}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    {type === 'unknown' ? (
                        <div className="text-slate-400 text-sm italic text-center py-4">
                            Format not recognized or input too short.
                        </div>
                    ) : (
                        result
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Quick Links */}
      {!input && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <QuickLink icon={Braces} label="JSON" onClick={() => onSelectTool('json-formatter')} />
            <QuickLink icon={Database} label="SQL Formatter" onClick={() => onSelectTool('sql-formatter')} />
            <QuickLink icon={Clock} label="Datetime" onClick={() => onSelectTool('timestamp')} />
            <QuickLink icon={Palette} label="Color" onClick={() => onSelectTool('color-palette')} />
            <QuickLink icon={Binary} label="Base64" onClick={() => onSelectTool('base64')} />
            <QuickLink icon={Shield} label="Hash Gen" onClick={() => onSelectTool('hash-generator')} />
            <QuickLink icon={Link} label="URL Encoding" onClick={() => onSelectTool('url-encoder')} />
            <QuickLink icon={Fingerprint} label="UUID / JWT" onClick={() => onSelectTool('uuid-generator')} /> 
            <QuickLink icon={Hash} label="Number Base" onClick={() => onSelectTool('number-base')} />
            <QuickLink icon={FileText} label="Text Diff" onClick={() => onSelectTool('diff-viewer')} />
            <QuickLink icon={Type} label="Char Counter" onClick={() => onSelectTool('text-inspector')} />
        </div>
      )}
    </div>
  );
};

const QuickLink: React.FC<{ icon: any, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
    >
        <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <Icon size={20} />
        </div>
        <span className="font-medium text-slate-600 group-hover:text-slate-900">{label}</span>
    </button>
)