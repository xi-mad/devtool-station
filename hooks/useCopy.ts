import { useState, useCallback } from 'react';

export function useCopy(timeout = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback((text: string, key: string = 'default') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), timeout);
  }, [timeout]);

  const isCopied = useCallback((key: string = 'default') => {
    return copiedKey === key;
  }, [copiedKey]);

  return { copy, isCopied, copiedKey };
}
