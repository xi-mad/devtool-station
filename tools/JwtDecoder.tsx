import React, { useState, useEffect } from 'react';
import { Fingerprint, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolHeader } from '../components/ui/ToolHeader';
import { CopyButton } from '../components/ui/CopyButton';
import { StyledTextarea } from '../components/ui/StyledTextarea';

export const JwtDecoder: React.FC = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    try {
      JSON.parse(header);
      JSON.parse(payload);

      const encode = (str: string) => {
        return btoa(str)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      };
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
      <ToolHeader
        icon={Fingerprint}
        title={t('jwt-decoder.title')}
        subtitle={t('jwt-decoder.subtitle')}
        onClear={() => { setToken(''); setHeader('{}'); setPayload('{}'); setSignature(''); setError(null); }}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('jwt-decoder.encoded_token')}</label>
            <CopyButton text={token} copyKey="token" className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {(copied) => <>{copied ? <Check size={14} /> : <Copy size={14} />}{t(copied ? 'jwt-decoder.copied' : 'jwt-decoder.copy')}</>}
            </CopyButton>
          </div>
          <StyledTextarea
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder={t('jwt-decoder.placeholder_token')}
            className={error ? 'border-red-300 dark:border-red-500/50 bg-red-50/10 dark:bg-red-500/5 text-red-900 dark:text-red-200' : ''}
          />
          {error && <div className="text-xs text-red-500 font-medium px-1">{error}</div>}
        </div>

        <div className="flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('jwt-decoder.header')}</label>
              <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{t('jwt-decoder.header_desc')}</span>
            </div>
            <StyledTextarea
              value={header}
              onChange={(e) => handleJsonChange('header', e.target.value)}
            />
          </div>

          <div className="flex-[2] flex flex-col gap-2 min-h-0">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('jwt-decoder.payload')}</label>
              <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{t('jwt-decoder.payload_desc')}</span>
            </div>
            <StyledTextarea
              value={payload}
              onChange={(e) => handleJsonChange('payload', e.target.value)}
            />
          </div>

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
