import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  variant?: 'error' | 'warning';
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  variant = 'error',
  className = ''
}) => {
  const isError = variant === 'error';
  return (
    <div
      className={`flex items-start gap-2 text-sm ${
        isError
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
      } border px-4 py-3 rounded-lg transition-colors ${className}`}
    >
      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
      <span className="font-mono">{message}</span>
    </div>
  );
};
