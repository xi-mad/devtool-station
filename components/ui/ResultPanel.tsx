import React from 'react';
import { SectionHeader } from './SectionHeader';

interface ResultPanelProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  icon,
  title,
  actions,
  children,
  className = ''
}) => (
  <div
    className={`flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col min-h-0 overflow-hidden transition-colors ${className}`}
  >
    {icon && title && (
      <SectionHeader icon={icon} title={title} actions={actions} />
    )}
    {children}
  </div>
);
