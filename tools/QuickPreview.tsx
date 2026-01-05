import React, { useState, useEffect } from 'react';
import { Braces, Clock, Palette, Binary, Link, Fingerprint, FileText, Type, Shield, Hash, Database, Dna, Languages, Maximize2, QrCode } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { format } from 'sql-formatter';
import QRCode from 'react-qr-code';
import { useTranslation } from 'react-i18next';

type DetectedType = 'json' | 'timestamp' | 'color' | 'base64' | 'url' | 'jwt' | 'number' | 'text' | 'unicode' | 'sql' | 'qrcode' | 'unknown';

interface PreviewResult {
  id: string;
  type: DetectedType;
  label: string;
  icon: any;
  content: React.ReactNode;
  priority: number; // Higher shows first
}

export const QuickPreview: React.FC<{ onSelectTool: (id: any) => void }> = ({ onSelectTool }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [results, setResults] = useState<PreviewResult[]>([]);

  useEffect(() => {
    const val = input.trim();
    if (!val) {
      setResults([]);
      return;
    }

    const newResults: PreviewResult[] = [];

    // --- Detectors ---

    // 0. JSON
    if ((val.startsWith('{') || val.startsWith('[')) && (val.endsWith('}') || val.endsWith(']'))) {
      try {
        const parsed = JSON.parse(val);
        newResults.push({
          id: 'json',
          type: 'json',
          label: t('quick-preview.labels.json'),
          icon: Braces,
          priority: 100,
          content: (
            <pre className="text-xs md:text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
              {JSON.stringify(parsed, null, 2)}
            </pre>
          )
        });
      } catch (e) {}
    }

    // 1. SQL
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'FROM', 'WHERE', 'JOIN'];
    const upperVal = val.toUpperCase();
    if (sqlKeywords.some(k => upperVal.includes(k)) && (upperVal.includes('SELECT') || upperVal.includes('TABLE') || upperVal.includes('INTO') || upperVal.includes('VALUES'))) {
        try {
            const formatted = format(val, { language: 'sql' });
            if (formatted !== val) {
                newResults.push({
                    id: 'sql',
                    type: 'sql',
                    label: t('quick-preview.labels.sql'),
                    icon: Database,
                    priority: 95,
                    content: (
                        <pre className="text-xs md:text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
                            {formatted}
                        </pre>
                    )
                });
            }
        } catch (e) {}
    }

    // 2. Timestamp (10-13 digits)
    if (/^\d{10,13}$/.test(val)) {
      const num = parseInt(val);
      const isMs = val.length === 13;
      const date = new Date(isMs ? num : num * 1000);
      if (!isNaN(date.getTime())) {
        newResults.push({
          id: 'timestamp',
          type: 'timestamp',
          label: t('quick-preview.labels.timestamp'),
          icon: Clock,
          priority: 90,
          content: (
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">ISO 8601</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{date.toISOString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Local</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{date.toLocaleString()}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Relative</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">
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
          )
        });
      }
    }

    // 3. Color (Hex, RGB, HSL)
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i;
    if (hexRegex.test(val) || rgbRegex.test(val) || val.startsWith('hsl(')) {
        newResults.push({
            id: 'color',
            type: 'color',
            label: t('quick-preview.labels.color'),
            icon: Palette,
            priority: 95,
            content: (
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors" style={{ backgroundColor: val }} />
                    <div className="space-y-1">
                        <div className="text-lg font-bold text-slate-900 dark:text-white uppercase transition-colors">{val}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Valid CSS Color</div>
                    </div>
                </div>
            )
        });
    }

    // 4. JWT
    if (val.split('.').length === 3 && val.startsWith('ey')) {
        try {
            const [header, payload] = val.split('.').slice(0, 2).map(part => 
                JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')))
            );
            newResults.push({
                id: 'jwt',
                type: 'jwt',
                label: t('quick-preview.labels.jwt'),
                icon: Fingerprint,
                priority: 100,
                content: (
                     <div className="space-y-4">
                         <div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Header</div>
                            <pre className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto transition-colors">{JSON.stringify(header, null, 2)}</pre>
                         </div>
                         <div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Payload</div>
                            <pre className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto transition-colors">{JSON.stringify(payload, null, 2)}</pre>
                         </div>
                    </div>
                )
            });
        } catch(e) {}
    }

    // 5. URL Encoded
    if (/%[0-9A-F]{2}/i.test(val)) {
        try {
            const decoded = decodeURIComponent(val);
            if (decoded !== val) {
                newResults.push({
                    id: 'url',
                    type: 'url',
                    label: t('quick-preview.labels.url'),
                    icon: Link,
                    priority: 80,
                    content: <div className="break-all font-mono text-slate-900 dark:text-slate-100 transition-colors">{decoded}</div>
                });
            }
        } catch(e) {}
    }

    // 6. Unicode Escapes (\uXXXX)
    if (/\\u[0-9a-fA-F]{4}/.test(val)) {
        try {
            const decoded = val.replace(/\\u[\dA-F]{4}/gi, (match) => 
                String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
            );
            if (decoded !== val) {
                newResults.push({
                    id: 'unicode',
                    type: 'unicode',
                    label: t('quick-preview.labels.unicode'),
                    icon: Languages,
                    priority: 85,
                    content: <div className="break-all font-mono text-slate-900 dark:text-slate-100 transition-colors">{decoded}</div>
                });
            }
        } catch(e) {}
    }

    // 7. Base64
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (val.length > 8 && base64Regex.test(val) && !val.includes(' ')) {
        try {
            const decoded = atob(val);
            if (/^[\x20-\x7E]*$/.test(decoded)) {
                newResults.push({
                    id: 'base64',
                    type: 'base64',
                    label: t('quick-preview.labels.base64'),
                    icon: Binary,
                    priority: 85,
                    content: <div className="break-all font-mono text-slate-900 dark:text-slate-100 transition-colors">{decoded}</div>
                });
            }
        } catch(e) {}
    }

    // 8. Number Base (Decimal, Hex, Binary)
    if (/^\d+$/.test(val) || /^0x[0-9a-fA-F]+$/.test(val) || /^0b[01]+$/.test(val)) {
        let num: number | null;
        if (val.startsWith('0x')) num = parseInt(val, 16);
        else if (val.startsWith('0b')) num = parseInt(val.slice(2), 2);
        else num = parseInt(val, 10);

        if (num !== null && !isNaN(num)) {
            newResults.push({
                id: 'number',
                type: 'number',
                label: t('quick-preview.labels.number'),
                icon: Hash,
                priority: 70,
                content: (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Decimal</div>
                            <div className="font-mono font-medium text-slate-900 dark:text-slate-100">{num.toString(10)}</div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Hexadecimal</div>
                            <div className="font-mono font-medium text-slate-900 dark:text-slate-100">0x{num.toString(16).toUpperCase()}</div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Binary</div>
                            <div className="font-mono font-medium text-slate-900 dark:text-slate-100">0b{num.toString(2)}</div>
                        </div>
                    </div>
                )
            });
        }
    }

    // 9. Text Stats (Always show for non-empty string)
    newResults.push({
        id: 'text-stats',
        type: 'text',
        label: t('quick-preview.labels.text'),
        icon: Type,
        priority: 10,
        content: (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t('quick-preview.stats.characters')}</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100 transition-colors">{val.length}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t('quick-preview.stats.words')}</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100 transition-colors">{val.trim() ? val.trim().split(/\s+/).length : 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t('quick-preview.stats.lines')}</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100 transition-colors">{val.split(/\r\n|\r|\n/).length}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t('quick-preview.stats.bytes')}</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100 transition-colors">{new Blob([val]).size}</span>
                </div>
            </div>
        )
    });

    const maxQRCodeLength = 2000;
    // 10. QR Code (Only show if input is within size limits)
    if (val.length <= maxQRCodeLength) {
        newResults.push({
            id: 'qrcode',
            type: 'qrcode',
            label: t('quick-preview.labels.qrcode'),
            icon: QrCode,
            priority: 5,
            content: (
                <div className="flex justify-center py-4">
                    <div className="p-4 bg-white dark:bg-slate-50 rounded-xl border dark:border-slate-800 shadow-sm aspect-square flex items-center justify-center transition-colors">
                        {/* Key forces remount when length changes significantly */}
                        <QRCode 
                            key={`qr-${Math.floor(val.length / 100)}`}
                            value={val.length <= maxQRCodeLength ? val : val.substring(0, maxQRCodeLength)}
                            size={150}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#000000"
                        />
                    </div>
                </div>
            )
        });
    }

    // 11. Hash (MD5, SHA256) - Always show
    newResults.push({
        id: 'hash',
        type: 'unknown', // Generic
        label: t('quick-preview.labels.hash'),
        icon: Shield,
        priority: 5,
        content: (
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className="w-16 text-xs text-slate-500 dark:text-slate-400">MD5</span>
                    <code className="flex-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-700 dark:text-slate-300 break-all transition-colors">
                        {CryptoJS.MD5(val).toString()}
                    </code>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-16 text-xs text-slate-500 dark:text-slate-400">SHA-256</span>
                    <code className="flex-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-700 dark:text-slate-300 break-all transition-colors">
                        {CryptoJS.SHA256(val).toString()}
                    </code>
                </div>
            </div>
        )
    });

    setResults(newResults.sort((a, b) => b.priority - a.priority));

  }, [input, t]);

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12 transition-colors">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
          {t('quick-preview.title')}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto transition-colors">
          {t('quick-preview.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('quick-preview.placeholder')}
                className="relative w-full h-32 md:h-40 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-lg font-mono resize-none transition-colors"
            />
             {input && (
                <button 
                  onClick={() => setInput('')} 
                  className="absolute top-4 right-4 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700 shadow-sm transition-colors"
                >
                  {t('quick-preview.clear')}
                </button>
            )}
        </div>

        {/* Live Result Cards */}
        {input && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {results.length > 0 ? (
                    results.map((res) => (
                        <div key={res.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                                <div className="flex items-center gap-2">
                                    <res.icon size={16} className="text-brand-600 dark:text-brand-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
                                        {res.label}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                {res.content}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-slate-400 dark:text-slate-600 text-sm italic text-center py-4 transition-colors">
                        {t('quick-preview.no-format')}
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Quick Links */}
      {!input && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <QuickLink icon={Braces} label={t('quick-preview.links.json')} onClick={() => onSelectTool('json-formatter')} />
            <QuickLink icon={Database} label={t('quick-preview.links.sql')} onClick={() => onSelectTool('sql-formatter')} />
            <QuickLink icon={Clock} label={t('quick-preview.links.datetime')} onClick={() => onSelectTool('timestamp')} />
            <QuickLink icon={Palette} label={t('quick-preview.links.color')} onClick={() => onSelectTool('color-palette')} />
            <QuickLink icon={Binary} label={t('quick-preview.links.base64')} onClick={() => onSelectTool('base64')} />
            <QuickLink icon={Shield} label={t('quick-preview.links.hash')} onClick={() => onSelectTool('hash-generator')} />
            <QuickLink icon={Link} label={t('quick-preview.links.url')} onClick={() => onSelectTool('url-encoder')} />
            <QuickLink icon={Fingerprint} label={t('quick-preview.links.uuid')} onClick={() => onSelectTool('uuid-generator')} /> 
            <QuickLink icon={Hash} label={t('quick-preview.links.number')} onClick={() => onSelectTool('number-base')} />
            <QuickLink icon={FileText} label={t('quick-preview.links.diff')} onClick={() => onSelectTool('diff-viewer')} />
            <QuickLink icon={Type} label={t('quick-preview.links.char-counter')} onClick={() => onSelectTool('text-inspector')} />
            <QuickLink icon={Dna} label={t('quick-preview.links.random')} onClick={() => onSelectTool('random-string')} />
            <QuickLink icon={Languages} label={t('quick-preview.links.unicode')} onClick={() => onSelectTool('unicode-converter')} />
            <QuickLink icon={Fingerprint} label={t('quick-preview.links.jwt')} onClick={() => onSelectTool('jwt-decoder')} />
            <QuickLink icon={QrCode} label={t('quick-preview.links.qrcode')} onClick={() => onSelectTool('qr-code-generator')} />
            <QuickLink icon={Maximize2} label={t('quick-preview.links.fullscreen')} onClick={() => onSelectTool('fullscreen-color')} />
        </div>
      )}
    </div>
  );
};

const QuickLink: React.FC<{ icon: any, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-200 dark:hover:border-brand-500 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
    >
        <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <Icon size={20} />
        </div>
        <span className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
    </button>
)