import React from 'react';

interface LayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
                {description && <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
            </div>
        )}
        {children}
      </div>
    </div>
  );
};