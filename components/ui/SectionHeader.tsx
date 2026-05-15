import React from 'react';

interface SectionHeaderProps {
  icon: React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  actions,
  className = ''
}) => {
  const IconComponent = icon as React.ComponentType<{ size?: number; className?: string }>;
  const iconElement = React.isValidElement(icon) ? (
    icon
  ) : (
    <IconComponent size={16} className="text-slate-400 dark:text-slate-500" />
  );

  return (
    <div
      className={`bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 transition-colors ${className}`}
    >
      {iconElement}
      <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm flex-1 transition-colors">
        {title}
      </h3>
      {actions}
    </div>
  );
};
