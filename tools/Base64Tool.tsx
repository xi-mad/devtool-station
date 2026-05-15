import React, { useState } from 'react';
import { Binary, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolHeader } from '../components/ui/ToolHeader';
import { CopyButton } from '../components/ui/CopyButton';
import { StyledTextarea } from '../components/ui/StyledTextarea';

export const Base64Tool: React.FC = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    try {
      setBase64(btoa(val));
    } catch (e) {
      // Ignore partial input errors
    }
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBase64(val);
    try {
      setText(atob(val));
    } catch (e) {
      // Ignore errors
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)] transition-colors">
      <ToolHeader
        icon={Binary}
        title={t('base64.title')}
        subtitle={t('base64.subtitle')}
        onClear={() => { setText(''); setBase64(''); }}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center transition-colors">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('base64.plain_text')}</label>
            <CopyButton text={text} copyKey="text" className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {(copied) => <>{copied ? <Check size={14} /> : <Copy size={14} />}{t(copied ? 'base64.copied' : 'base64.copy')}</>}
            </CopyButton>
          </div>
          <StyledTextarea
            value={text}
            onChange={handleTextChange}
            placeholder={t('base64.placeholder_text')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center transition-colors">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('base64.base64_output')}</label>
            <CopyButton text={base64} copyKey="base64" className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {(copied) => <>{copied ? <Check size={14} /> : <Copy size={14} />}{t(copied ? 'base64.copied' : 'base64.copy')}</>}
            </CopyButton>
          </div>
          <StyledTextarea
            value={base64}
            onChange={handleBase64Change}
            placeholder={t('base64.placeholder_base64')}
          />
        </div>
      </div>
    </div>
  );
};
