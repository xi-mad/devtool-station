import React from 'react';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export const ToggleGroup = <T extends string>({
  options,
  value,
  onChange,
  className = ''
}: ToggleGroupProps<T>) => (
  <div className={`flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg transition-colors ${className}`}>
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
          value === opt.value
            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
      >
        {opt.icon}
        {opt.label}
      </button>
    ))}
  </div>
);
