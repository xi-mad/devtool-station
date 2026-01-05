import React, { useState, useEffect } from 'react';
import { Fingerprint, Copy, Check, Trash2 } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';
import { useTranslation } from 'react-i18next';

export const JwtDecoder: React.FC = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { copy, isCopied } = useCopy();

  // Decode JWT when token changes
  const handleTokenChange = (val: string) => {
    setToken(val);
    setError(null);
    if (!val.trim()) return;

    try {
      const parts = val.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format (must have 3 parts)');
      }

      const decodedHeader = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      
      setHeader(JSON.stringify(JSON.parse(decodedHeader), null, 2));
      setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2));
      setSignature(parts[2]);
    } catch (e) {
      setError(t('jwt-decoder.error_invalid'));
    }
  };

  // Encode JWT when header or payload changes
  // Note: This is a simplified encoding without real signing
  useEffect(() => {
    try {
      // Validate JSON first
      JSON.parse(header);
      JSON.parse(payload);

      const encode = (str: string) => {
        return btoa(str)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      };

      // Only update token if we are not currently editing the token field (to avoid loops/cursor jumps if we were bidirectional)
      // But here we treat the JSON editors as the "source of truth" for generation if the user edits them.
      // However, to support bidirectional editing smoothly, we usually need a mode switch or careful state management.
      // For simplicity, let's make the Token field the primary input for decoding, 
      // and the JSON fields the primary input for encoding if the user types there.
      
      // Actually, let's just generate a "simulated" token if the user edits JSON.
      // We'll keep the existing signature or generate a dummy one.
      
      const encodedHeader = encode(JSON.stringify(JSON.parse(header)));
      const encodedPayload = encode(JSON.stringify(JSON.parse(payload)));
      const currentSig = signature || 'unsigned';
      
      const newToken = `${encodedHeader}.${encodedPayload}.${currentSig}`;
      
      // Only update token if it's different (and we are not in the middle of typing the token)
      // This is tricky. Let's just provide a "Generate Token" button or auto-update ONLY if the token doesn't match the current JSONs.
      // For now, let's stick to: Input Token -> Decodes to JSON. 
      // If user edits JSON -> Updates Token.
      
      // To avoid infinite loops, we can check if the current token decodes to the current JSON.
      // But simpler: Let's just update the token.
      // setToken(newToken); 
      // Wait, this will trigger handleTokenChange and re-format the JSON, causing cursor jumps.
      
      // Better approach: Separate "Encoded View" and "Decoded View" like Base64 tool?
      // Or just one view. Let's do this:
      // If user edits Token -> Update JSONs.
      // If user edits JSONs -> Update Token.
      // We need a flag to know source of change.
      
    } catch (e) {
      // Invalid JSON, don't update token
    }
  }, [header, payload]);

  const handleJsonChange = (type: 'header' | 'payload', val: string) => {
      if (type === 'header') setHeader(val);
      else setPayload(val);

      try {
          const h = type === 'header' ? val : header;
          const p = type === 'payload' ? val : payload;
          
          // Minify for encoding
          const hStr = JSON.stringify(JSON.parse(h));
          const pStr = JSON.stringify(JSON.parse(p));
          
          const encode = (str: string) => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          const newToken = `${encode(hStr)}.${encode(pStr)}.${signature || 'unsigned'}`;
          setToken(newToken);
          setError(null);
      } catch (e) {
          // Don't update token if JSON is invalid
      }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)] transition-colors">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg transition-colors">
            <Fingerprint size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">{t('jwt-decoder.title')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{t('jwt-decoder.subtitle')}</p>
          </div>
        </div>
        <button 
          onClick={() => { setToken(''); setHeader('{}'); setPayload('{}'); setSignature(''); setError(null); }}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          title={t('jwt-decoder.clear_all')}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left: Token Input */}
        <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('jwt-decoder.encoded_token')}</label>
                <button 
                    onClick={() => copy(token, 'token')}
                    className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                    {isCopied('token') ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied('token') ? t('jwt-decoder.copied') : t('jwt-decoder.copy')}
                </button>
            </div>
            <textarea
                value={token}
                onChange={(e) => handleTokenChange(e.target.value)}
                placeholder={t('jwt-decoder.placeholder_token')}
                className={`flex-1 p-4 rounded-xl border font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-all ${
                    error ? 'border-red-300 dark:border-red-500/50 bg-red-50/10 dark:bg-red-500/5 text-red-900 dark:text-red-200' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                }`}
            />
            {error && <div className="text-xs text-red-500 font-medium px-1">{error}</div>}
        </div>

        {/* Right: Decoded Payload */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Header */}
            <div className="flex-1 flex flex-col gap-2 min-h-0">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('jwt-decoder.header')}</label>
                    <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{t('jwt-decoder.header_desc')}</span>
                </div>
                <textarea
                    value={header}
                    onChange={(e) => handleJsonChange('header', e.target.value)}
                    className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-colors"
                />
            </div>

            {/* Payload */}
            <div className="flex-[2] flex flex-col gap-2 min-h-0">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('jwt-decoder.payload')}</label>
                    <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{t('jwt-decoder.payload_desc')}</span>
                </div>
                <textarea
                    value={payload}
                    onChange={(e) => handleJsonChange('payload', e.target.value)}
                    className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm transition-colors"
                />
            </div>
            
            {/* Signature (Read Only) */}
             <div className="flex flex-col gap-2 transition-colors">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('jwt-decoder.signature')}</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-500 dark:text-slate-400 break-all transition-colors">
                    {signature || <span className="italic opacity-50 dark:opacity-30">{t('jwt-decoder.no_signature')}</span>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
