import React, { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    try {
      setBase64(btoa(val));
    } catch (e) {
      // Ignore partial input errors
    }
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBase64(val);
    try {
      setText(atob(val));
    } catch (e) {
      // Ignore errors
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Plain Text</label>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type text to encode..."
          className="flex-1 p-4 rounded-xl border border-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Base64 Output</label>
         <textarea
          value={base64}
          onChange={handleBase64Change}
          placeholder="Type Base64 to decode..."
          className="flex-1 p-4 rounded-xl border border-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none shadow-sm"
        />
      </div>
    </div>
  );
};
