import React from 'react';
import { Trash2 } from 'lucide-react';

interface ClearButtonProps {
  onClick: () => void;
  className?: string;
  title?: string;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClick, className = '', title }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors ${className}`}
      type="button"
      title={title}
    >
      <Trash2 size={18} />
    </button>
  );
};
