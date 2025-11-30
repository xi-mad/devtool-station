import React, { useState, useEffect } from 'react';
import { Clock, Copy } from 'lucide-react';

export const TimestampTool: React.FC = () => {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [inputTs, setInputTs] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString());

  // Update "Now" every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTsChange = (val: string) => {
    setInputTs(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      // Check if ms or seconds (simple heuristic: > 100000000000 is likely ms)
      const date = new Date(num > 100000000000 ? num : num * 1000);
      setInputDate(date.toISOString());
    }
  };

  const handleDateChange = (val: string) => {
    setInputDate(val);
    const ts = Date.parse(val);
    if (!isNaN(ts)) {
      setInputTs(Math.floor(ts / 1000).toString());
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Current Time Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Current Unix Timestamp</h3>
            <p className="text-slate-500 text-sm">Seconds since Jan 01 1970</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <code className="text-2xl font-mono font-bold text-slate-800 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            {now}
          </code>
          <button 
            onClick={() => navigator.clipboard.writeText(now.toString())}
            className="p-3 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      {/* Converter */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-8">
        <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-4">Converter</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Unix Timestamp (Seconds or MS)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputTs}
                onChange={(e) => handleTsChange(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
              />
              <button 
                onClick={() => handleTsChange(now.toString())}
                className="px-3 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200"
              >
                Now
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">ISO 8601 Date</label>
            <input 
              type="text"
              value={inputDate}
              onChange={(e) => handleDateChange(e.target.value)}
               className="w-full p-3 rounded-lg border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
            />
            <p className="text-xs text-slate-500">Format: YYYY-MM-DDTHH:mm:ss.sssZ</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
           <div className="flex justify-between text-sm">
             <span className="text-slate-500">Local String:</span>
             <span className="font-mono text-slate-800">{new Date(parseInt(inputTs) * 1000).toString()}</span>
           </div>
           <div className="flex justify-between text-sm">
             <span className="text-slate-500">UTC String:</span>
             <span className="font-mono text-slate-800">{new Date(parseInt(inputTs) * 1000).toUTCString()}</span>
           </div>
           <div className="flex justify-between text-sm">
             <span className="text-slate-500">Relative:</span>
             <span className="font-mono text-slate-800">
               {(() => {
                 const diff = Date.now() - parseInt(inputTs) * 1000;
                 const seconds = Math.floor(Math.abs(diff) / 1000);
                 const suffix = diff > 0 ? 'ago' : 'from now';
                 if (seconds < 60) return `${seconds} seconds ${suffix}`;
                 if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ${suffix}`;
                 if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ${suffix}`;
                 return `${Math.floor(seconds / 86400)} days ${suffix}`;
               })()}
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};
