import React, { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';
import { useCopy } from '../hooks/useCopy';

type Base = 'decimal' | 'hex' | 'binary' | 'octal';

export const NumberBase: React.FC = () => {
  const { copy, isCopied } = useCopy();
  const [values, setValues] = useState({
    decimal: '',
    hex: '',
    binary: '',
    octal: ''
  });

  const update = (value: string, fromBase: Base) => {
    if (!value) {
      setValues({ decimal: '', hex: '', binary: '', octal: '' });
      return;
    }

    let num: number | bigint;
    try {
      // Remove prefixes/spaces for cleaner parsing
      const cleanVal = value.trim();
      
      if (fromBase === 'decimal') {
        num = BigInt(cleanVal);
      } else if (fromBase === 'hex') {
        num = BigInt(`0x${cleanVal.replace(/^0x/, '')}`);
      } else if (fromBase === 'binary') {
        num = BigInt(`0b${cleanVal.replace(/^0b/, '')}`);
      } else { // octal
        num = BigInt(`0o${cleanVal.replace(/^0o/, '')}`);
      }

      setValues({
        decimal: num.toString(10),
        hex: num.toString(16).toUpperCase(),
        binary: num.toString(2),
        octal: num.toString(8)
      });
    } catch (e) {
      // Allow typing invalid chars temporarily, but don't update others
      setValues(prev => ({ ...prev, [fromBase]: value }));
    }
  };



  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-6">
        
        <BaseInput 
          label="Decimal" 
          value={values.decimal} 
          onChange={(v) => update(v, 'decimal')} 
          placeholder="12345"
          badge="DEC"
          onCopy={() => copy(values.decimal, 'decimal')}
          isCopied={isCopied('decimal')}
        />

        <BaseInput 
          label="Hexadecimal" 
          value={values.hex} 
          onChange={(v) => update(v, 'hex')} 
          placeholder="3039"
          badge="HEX"
          onCopy={() => copy(values.hex, 'hex')}
          isCopied={isCopied('hex')}
        />

        <BaseInput 
          label="Binary" 
          value={values.binary} 
          onChange={(v) => update(v, 'binary')} 
          placeholder="11000000111001"
          badge="BIN"
          onCopy={() => copy(values.binary, 'binary')}
          isCopied={isCopied('binary')}
        />

        <BaseInput 
          label="Octal" 
          value={values.octal} 
          onChange={(v) => update(v, 'octal')} 
          placeholder="30071"
          badge="OCT"
          onCopy={() => copy(values.octal, 'octal')}
          isCopied={isCopied('octal')}
        />

      </div>
    </div>
  );
};

const BaseInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  badge: string;
  onCopy: () => void;
  isCopied: boolean;
}> = ({ label, value, onChange, placeholder, badge, onCopy, isCopied }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
            {badge}
        </div>
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-lg text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
      />
      <button 
        onClick={onCopy}
        className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg border border-transparent hover:border-brand-100 transition-colors"
      >
        {isCopied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
      </button>
    </div>
  </div>
);