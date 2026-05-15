import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Settings, Check, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '../components/ui/CopyButton';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TwoColumnLayout } from '../components/ui/TwoColumnLayout';
import { ResultPanel } from '../components/ui/ResultPanel';
import { SliderInput } from '../components/ui/SliderInput';
import { CheckboxOption } from '../components/ui/CheckboxOption';

type UuidVersion = 'v1' | 'v4' | 'v7';

const generateV4 = () => crypto.randomUUID();

const _nodeId = new Uint8Array(6);
crypto.getRandomValues(_nodeId);
_nodeId[0] |= 0x01;
let _clockSeq = Math.floor(Math.random() * 0x3fff);
let _lastMSecs = 0;
let _lastNSecs = 0;

const generateV1 = () => {
  let msecs = Date.now();
  let nsecs = _lastNSecs + 1;
  const dt = msecs - _lastMSecs;

  if (dt > 0 && dt < 10000) {
    nsecs = 0;
  } else if (dt < 0) {
    _clockSeq = (_clockSeq + 1) & 0x3fff;
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;

  const msecsBig = BigInt(msecs);
  const nsecsBig = BigInt(nsecs);
  const time = (msecsBig + 12219292800000n) * 10000n + nsecsBig;

  const timeLow = time & 0xffffffffn;
  const timeMid = (time >> 32n) & 0xffffn;
  const timeHiAndVersion = ((time >> 48n) & 0x0fffn) | 0x1000n;

  const clockSeqHiAndReserved = (_clockSeq >>> 8) | 0x80;
  const clockSeqLow = _clockSeq & 0xff;

  const node = Array.from(_nodeId).map(b => b.toString(16).padStart(2, '0')).join('');

  const tl = timeLow.toString(16).padStart(8, '0');
  const tm = timeMid.toString(16).padStart(4, '0');
  const th = timeHiAndVersion.toString(16).padStart(4, '0');
  const cs = clockSeqHiAndReserved.toString(16) + clockSeqLow.toString(16).padStart(2, '0');

  return `${tl}-${tm}-${th}-${cs}-${node}`;
};

const generateV7 = () => {
  const msecs = Date.now();
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);

  const msecsBig = BigInt(msecs);
  const tsHex = msecsBig.toString(16).padStart(12, '0');

  const verRandA = (0x7000 | ((rand[0] << 8) | rand[1]) & 0x0fff).toString(16).padStart(4, '0');

  const varByte = (rand[2] & 0x3f) | 0x80;
  const varHex = varByte.toString(16).padStart(2, '0');

  const restHex = Array.from(rand.slice(3)).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${tsHex.slice(0, 8)}-${tsHex.slice(8)}-${verRandA}-${varHex}${restHex.slice(0, 2)}-${restHex.slice(2)}`;
};


export const UuidGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = useCallback(() => {
    let fn: () => string = generateV4;
    if (version === 'v1') fn = generateV1;
    if (version === 'v7') fn = generateV7;

    const newUuids = Array(quantity).fill(null).map(() => {
      let uuid = fn();
      if (noHyphens) uuid = uuid.replace(/-/g, '');
      if (uppercase) uuid = uuid.toUpperCase();
      return uuid;
    });
    setUuids(newUuids);
  }, [version, quantity, uppercase, noHyphens]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <TwoColumnLayout
      sidebarWidth="w-72"
      sidebar={
        <>
        <SectionHeader icon={Settings} title={t('uuid-generator.configuration')} className="p-6 [&_h3]:text-slate-900 [&_h3]:dark:text-white" />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">{t('uuid-generator.version')}</label>
            <div className="space-y-2">
              {[
                { id: 'v1', label: t('uuid-generator.v1_label'), desc: t('uuid-generator.v1_desc') },
                { id: 'v4', label: t('uuid-generator.v4_label'), desc: t('uuid-generator.v4_desc') },
                { id: 'v7', label: t('uuid-generator.v7_label'), desc: t('uuid-generator.v7_desc') }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setVersion(opt.id as UuidVersion)}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                    version === opt.id
                      ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/50 ring-1 ring-brand-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`font-medium ${version === opt.id ? 'text-brand-700 dark:text-brand-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <SliderInput
            label={`${t('uuid-generator.quantity')}: ${quantity}`}
            value={quantity}
            min={1}
            max={50}
            onChange={setQuantity}
          />

          <div className="space-y-3">
            <CheckboxOption label={t('uuid-generator.uppercase')} checked={uppercase} onChange={setUppercase} />
            <CheckboxOption label={t('uuid-generator.remove_hyphens')} checked={noHyphens} onChange={setNoHyphens} />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
          <button
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-sm"
          >
            <RefreshCw size={18} /> {t('uuid-generator.regenerate')}
          </button>
        </div>
        </>
      }
    >
      <ResultPanel>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide transition-colors">
              UUID {version.toUpperCase()}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{uuids.length} {t('uuid-generator.generated')}</span>
          </div>
          <CopyButton
            text={uuids.join('\n')}
            copyKey="all"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
          >
            {(copied) => <>{copied ? <Check size={16} /> : <FileText size={16} />}{t('uuid-generator.copy_all')}</>}
          </CopyButton>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {uuids.map((uuid, idx) => (
            <div
              key={`${idx}-${uuid}`}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-8 text-center text-xs text-slate-400 dark:text-slate-500 font-mono select-none transition-colors">
                {(idx + 1).toString().padStart(2, '0')}
              </div>
              <code className="flex-1 font-mono text-slate-700 dark:text-slate-300 text-sm md:text-base break-all transition-colors">
                {uuid}
              </code>
              <CopyButton
                text={uuid}
                copyKey={idx.toString()}
                className={(copied) => `p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${copied ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-700 shadow-sm'}`}
              >
                {(copied) => <>{copied ? <Check size={18} /> : <Copy size={18} />}</>}
              </CopyButton>
            </div>
          ))}
        </div>
      </ResultPanel>
    </TwoColumnLayout>
  );
};
