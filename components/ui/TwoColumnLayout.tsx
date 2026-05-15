import React from 'react';

interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: 'w-64' | 'w-72' | 'w-80';
  breakpoint?: 'md' | 'lg';
  className?: string;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  sidebar,
  children,
  sidebarWidth = 'w-72',
  breakpoint = 'md',
  className = ''
}) => (
  <div className={`flex flex-col ${breakpoint}:flex-row gap-6 h-[calc(100vh-180px)] transition-colors ${className}`}>
    <div className={`w-full ${breakpoint}:${sidebarWidth} flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors`}>
      {sidebar}
    </div>
    {children}
  </div>
);
