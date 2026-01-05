import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useTheme } from '../hooks/useTheme';

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
  const { theme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  React.useImperativeHandle(ref, () => ({
    scrollTo: (top, left) => {
      if (editorRef.current) {
        editorRef.current.setScrollPosition({ scrollTop: top, scrollLeft: left });
      }
    },
    setSelection: (start, end) => {
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          const startPos = model.getPositionAt(start);
          const endPos = model.getPositionAt(end);
          editorRef.current.setSelection({
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
          });
          editorRef.current.focus();
        }
      }
    }
  }));

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleChange = (value: string | undefined) => {
    onChange(value || '');
  };

  // Map language names to Monaco language IDs
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'json': 'json',
      'sql': 'sql',
      'text': 'plaintext',
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'html': 'html',
      'css': 'css',
    };
    return languageMap[lang.toLowerCase()] || 'plaintext';
  };

  return (
    <div className={className}>
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: '"JetBrains Mono", monospace',
          lineHeight: 24,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          wrappingStrategy: 'advanced',
          lineNumbers: 'on',
          folding: true,
          foldingStrategy: 'indentation',
          renderLineHighlight: 'line',
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          renderWhitespace: 'selection',
          tabSize: 2,
          insertSpaces: true,
        }}
        loading={<div className="flex items-center justify-center h-full text-slate-400">Loading editor...</div>}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
