import { useCopy } from '../../hooks/useCopy';
import React from 'react';

interface CopyButtonProps {
  text: string;
  copyKey?: string;
  className?: string | ((isCopied: boolean) => string);
  children: (isCopied: boolean) => React.ReactNode;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, copyKey = 'default', className = '', children }) => {
  const { copy, isCopied } = useCopy();
  const copied = isCopied(copyKey);
  const resolvedClassName = typeof className === 'function' ? className(copied) : className;
  return (
    <button onClick={() => copy(text, copyKey)} className={resolvedClassName} type="button">
      {children(copied)}
    </button>
  );
};
