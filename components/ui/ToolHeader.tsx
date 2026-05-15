import React from 'react';
import { ClearButton } from './ClearButton';

interface ToolHeaderProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
  onClear?: () => void;
  actions?: React.ReactNode;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ icon: Icon, title, subtitle, onClear, actions }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {actions}
        {onClear && <ClearButton onClick={onClear} />}
      </div>
    </div>
  );
};
