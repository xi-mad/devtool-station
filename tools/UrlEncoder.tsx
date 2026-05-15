import React, { useState, useEffect } from 'react';
import { Link, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolHeader } from '../components/ui/ToolHeader';
import { CopyButton } from '../components/ui/CopyButton';
import { StyledTextarea } from '../components/ui/StyledTextarea';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { ToggleGroup } from '../components/ui/ToggleGroup';

type EncodeMode = 'component' | 'uri';

export const UrlEncoder: React.FC = () => {
  const { t } = useTranslation();
  const [decoded, setDecoded] = useState('');
  const [encoded, setEncoded] = useState('');
  const [mode, setMode] = useState<EncodeMode>('component');
  const [error, setError] = useState<string | null>(null);

  const handleDecodedChange = (val: string) => {
    setDecoded(val);
    setError(null);
    try {
      const result = mode === 'component' ? encodeURIComponent(val) : encodeURI(val);
      setEncoded(result);
    } catch (e) {
      setError(t('url-encoder.error_failed'));
    }
  };

  const handleEncodedChange = (val: string) => {
    setEncoded(val);
    setError(null);
    try {
      const result = decodeURIComponent(val);
      setDecoded(result);
    } catch (e) {
      if (val.trim()) {
        setError(t('url-encoder.error_invalid'));
      }
    }
  };

  useEffect(() => {
    handleDecodedChange(decoded);
  }, [mode]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)] transition-colors">
      <ToolHeader
        icon={Link}
        title={t('url-encoder.title')}
        subtitle={t('url-encoder.subtitle')}
        onClear={() => { setDecoded(''); setEncoded(''); setError(null); }}
        actions={
          <ToggleGroup
            options={[
              { value: 'component' as const, label: t('url-encoder.component_mode') },
              { value: 'uri' as const, label: t('url-encoder.full_uri_mode') },
            ]}
            value={mode}
            onChange={setMode}
          />
        }
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-2 h-full">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between items-center transition-colors">
            <span>{t('url-encoder.decoded_text')}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal transition-colors">{t('url-encoder.normal_string')}</span>
              <CopyButton text={decoded} copyKey="decoded" className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                {(copied) => <>{copied ? <Check size={14} /> : <Copy size={14} />}</>}
              </CopyButton>
            </div>
          </label>
          <StyledTextarea
            value={decoded}
            onChange={(e) => handleDecodedChange(e.target.value)}
            placeholder={t('url-encoder.placeholder_decoded')}
          />
        </div>

        <div className="flex flex-col gap-2 h-full relative">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between items-center transition-colors">
            <span>{t('url-encoder.encoded_text')}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal transition-colors">{t('url-encoder.url_safe')}</span>
              <CopyButton text={encoded} copyKey="encoded" className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                {(copied) => <>{copied ? <Check size={14} /> : <Copy size={14} />}</>}
              </CopyButton>
            </div>
          </label>
          <StyledTextarea
            value={encoded}
            onChange={(e) => handleEncodedChange(e.target.value)}
            placeholder={t('url-encoder.placeholder_encoded')}
            className={error ? 'border-red-300 dark:border-red-500/50 bg-red-50/10 dark:bg-red-500/5 text-red-900 dark:text-red-200' : ''}
          />
          {error && (
            <ErrorDisplay message={error} className="absolute bottom-4 right-4 shadow-sm" />
          )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-500 dark:text-slate-400 flex gap-4 transition-colors">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('url-encoder.component_desc_label')}</span> {t('url-encoder.component_desc')}
        </div>
        <div className="hidden md:block w-px bg-slate-300 dark:bg-slate-700 mx-2 transition-colors"></div>
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('url-encoder.full_uri_desc_label')}</span> {t('url-encoder.full_uri_desc')}
        </div>
      </div>
    </div>
  );
};
