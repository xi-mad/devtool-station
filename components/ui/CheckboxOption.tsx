import React from 'react';

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxOption: React.FC<CheckboxOptionProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-brand-500 transition-colors"
    />
    <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">{label}</span>
  </label>
);
