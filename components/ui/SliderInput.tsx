import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  className = ''
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
      {label}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 transition-colors"
    />
    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);
