import React, { useState } from 'react';
import { Languages, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolHeader } from '../components/ui/ToolHeader';
import { CopyButton } from '../components/ui/CopyButton';
import { StyledTextarea } from '../components/ui/StyledTextarea';

export const UnicodeConverter: React.FC = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [unicode, setUnicode] = useState('');

  const handleTextChange = (val: string) => {
    setText(val);
    if (!val) {
      setUnicode('');
      return;
    }
    const converted = val.split('').map(char => {
      const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
      return `\\u${code}`;
    }).join('');
    setUnicode(converted);
  };

  const handleUnicodeChange = (val: string) => {
    setUnicode(val);
    if (!val) {
      setText('');
      return;
    }
    try {
      const converted = val.replace(/\\u([0-9A-F]{4})/gi, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
      setText(converted);
    } catch (e) {
      // best effort
    }
  };

  const clearAll = () => {
    setText('');
    setUnicode('');
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)] transition-colors">
      <ToolHeader
        icon={Languages}
        title={t('unicode-converter.title')}
        subtitle={t('unicode-converter.subtitle')}
        onClear={clearAll}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('unicode-converter.native_text')}</label>
            <CopyButton text={text} copyKey="text" className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {(copied) => <>{copied ? <Check size={14} /> : <Copy size={14} />}{t(copied ? 'unicode-converter.copied' : 'unicode-converter.copy')}</>}
            </CopyButton>
          </div>
          <StyledTextarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t('unicode-converter.placeholder_text')}
            className="font-sans text-base"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{t('unicode-converter.unicode_cn')}</label>
            <CopyButton text={unicode} copyKey="unicode" className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {(copied) => <>{copied ? <Check size={14} /> : <Copy size={14} />}{t(copied ? 'unicode-converter.copied' : 'unicode-converter.copy')}</>}
            </CopyButton>
          </div>
          <StyledTextarea
            value={unicode}
            onChange={(e) => handleUnicodeChange(e.target.value)}
            placeholder={t('unicode-converter.placeholder_unicode')}
          />
        </div>
      </div>
    </div>
  );
};
