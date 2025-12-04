import React, { useEffect, useRef, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';

// Ensure Prism is available globally for components that might rely on it
if (typeof window !== 'undefined') {
  (window as any).Prism = Prism;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language, 
  placeholder, 
  className = '',
  readOnly = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const highlighted = useMemo(() => {
    const grammar = Prism.languages[language];
    if (!grammar) {
      // Simple escape for fallback
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    return Prism.highlight(value, grammar, language);
  }, [value, language]);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div 
      className={`relative font-mono text-sm focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500 transition-all ${className}`}
    >
      {/* Highlighted Code (Background) */}
      <pre
        ref={preRef}
        aria-hidden="true"
        className={`language-${language} absolute inset-0 m-0 p-4 pointer-events-none overflow-hidden whitespace-pre-wrap break-all`}
        style={{
             fontFamily: '"JetBrains Mono", monospace',
             fontSize: '14px',
             lineHeight: '1.5rem', // leading-6
             background: 'transparent',
             border: 'none',
             borderRadius: 'inherit',
             margin: 0,
        }}
      >
        <code 
          className={`language-${language}`}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '14px',
            lineHeight: '1.5rem',
          }}
          dangerouslySetInnerHTML={{ __html: highlighted + (value.endsWith('\n') ? '<br>' : '') }}
        />
      </pre>

      {/* Editable Textarea (Foreground) */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-slate-800 resize-none focus:outline-none z-10 whitespace-pre-wrap break-all rounded-[inherit] ${readOnly ? 'cursor-default' : ''}`}
        spellCheck={false}
        style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '14px',
            lineHeight: '1.5rem',
        }}
      />
    </div>
  );
};
