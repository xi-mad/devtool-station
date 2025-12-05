import React, { useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface CodeEditorRef {
  scrollTo: (top: number, left: number) => void;
  setSelection: (start: number, end: number) => void;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const CodeEditor = React.forwardRef<CodeEditorRef, CodeEditorProps>(({ 
  value, 
  onChange, 
  language, 
  placeholder, 
  className = '',
  readOnly = false
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    scrollTo: (top, left) => {
      if (containerRef.current) {
        containerRef.current.scrollTop = top;
        containerRef.current.scrollLeft = left;
      }
    },
    setSelection: (start, end) => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(start, end);
        textareaRef.current.focus();
      }
    }
  }));

  // Ensure the background grows to accommodate the trailing newline cursor position
  // by appending a space if the value ends with a newline.
  const displayValue = value.endsWith('\n') ? value + ' ' : value;

  return (
    <div 
      ref={containerRef}
      className={`relative font-mono text-sm border-brand-500 transition-all overflow-auto ${className}`}
      onClick={() => textareaRef.current?.focus()}
    >
      <div className="min-w-full min-h-full relative inline-block align-top">
        {/* Highlighted Code (Background) */}
        <SyntaxHighlighter
          language={language}
          style={prism}
          customStyle={{
            margin: 0,
            padding: '1rem', // matches p-4
            background: 'transparent',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '14px',
            lineHeight: '1.5rem',
            pointerEvents: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            overflow: 'visible',
            border: 'none',
            minHeight: '100%',
          }}
          codeTagProps={{
            style: {
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5rem',
            }
          }}
          PreTag="div"
        >
          {displayValue}
        </SyntaxHighlighter>

        {/* Editable Textarea (Foreground) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-slate-800 resize-none focus:outline-none overflow-hidden whitespace-pre-wrap break-all ${readOnly ? 'cursor-default' : ''}`}
          spellCheck={false}
          style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5rem',
          }}
        />
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
