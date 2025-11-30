import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Settings, Check, FileText } from 'lucide-react';

type UuidVersion = 'v1' | 'v4' | 'v7';

// --- Generators ---

// UUID v4: Random (Native)
const generateV4 = () => crypto.randomUUID();

// UUID v1: Timestamp-based (Simulated Node)
// Note: Browser cannot access real MAC address, using random node ID per session.
const _nodeId = new Uint8Array(6);
crypto.getRandomValues(_nodeId);
_nodeId[0] |= 0x01; // Set multicast bit
let _clockSeq = Math.floor(Math.random() * 0x3fff);
let _lastMSecs = 0;
let _lastNSecs = 0;

const generateV1 = () => {
  let msecs = Date.now();
  let nsecs = _lastNSecs + 1;
  const dt = msecs - _lastMSecs;

  if (dt > 0 && dt < 10000) { // Time advanced
    nsecs = 0;
  } else if (dt < 0) { // Time went backwards
    _clockSeq = (_clockSeq + 1) & 0x3fff;
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;

  // Gregorian time since Oct 15, 1582 in 100ns intervals
  const msecsBig = BigInt(msecs);
  const nsecsBig = BigInt(nsecs);
  const time = (msecsBig + 12219292800000n) * 10000n + nsecsBig;

  const timeLow = time & 0xffffffffn;
  const timeMid = (time >> 32n) & 0xffffn;
  const timeHiAndVersion = ((time >> 48n) & 0x0fffn) | 0x1000n;
  
  const clockSeqHiAndReserved = (_clockSeq >>> 8) | 0x80;
  const clockSeqLow = _clockSeq & 0xff;

  const node = Array.from(_nodeId).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const tl = timeLow.toString(16).padStart(8, '0');
  const tm = timeMid.toString(16).padStart(4, '0');
  const th = timeHiAndVersion.toString(16).padStart(4, '0');
  const cs = clockSeqHiAndReserved.toString(16) + clockSeqLow.toString(16).padStart(2, '0');

  return `${tl}-${tm}-${th}-${cs}-${node}`;
};

// UUID v7: Unix Timestamp (ms) + Random
const generateV7 = () => {
  const msecs = Date.now();
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);

  const msecsBig = BigInt(msecs);
  const tsHex = msecsBig.toString(16).padStart(12, '0');
  
  // ver (4 bits) + rand_a (12 bits)
  const verRandA = (0x7000 | ((rand[0] << 8) | rand[1]) & 0x0fff).toString(16).padStart(4, '0');
  
  // var (2 bits) + rand_b (62 bits)
  // var is 10xx (0x80 | (byte & 0x3f))
  const varByte = (rand[2] & 0x3f) | 0x80;
  const varHex = varByte.toString(16).padStart(2, '0');
  
  const restHex = Array.from(rand.slice(3)).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${tsHex.slice(0, 8)}-${tsHex.slice(8)}-${verRandA}-${varHex}${restHex.slice(0, 2)}-${restHex.slice(2)}`;
};


export const UuidGenerator: React.FC = () => {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(() => {
    let fn: () => string = generateV4;
    if (version === 'v1') fn = generateV1;
    if (version === 'v7') fn = generateV7;

    const newUuids = Array(quantity).fill(null).map(() => {
      let uuid = fn();
      if (noHyphens) uuid = uuid.replace(/-/g, '');
      if (uppercase) uuid = uuid.toUpperCase();
      return uuid;
    });
    setUuids(newUuids);
  }, [version, quantity, uppercase, noHyphens]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedIndex(-1); // -1 for all
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)]">
      {/* Configuration Panel */}
      <div className="w-full md:w-72 flex flex-col gap-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
           <Settings className="text-slate-400" size={20} />
           <h3 className="font-semibold text-slate-900">Configuration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Version</label>
            <div className="space-y-2">
               {[
                 { id: 'v1', label: 'Version 1 (Time)', desc: 'Timestamp & Node ID' },
                 { id: 'v4', label: 'Version 4 (Random)', desc: 'Best for general use' },
                 { id: 'v7', label: 'Version 7 (Sorted)', desc: 'Time-sortable (Unix)' }
               ].map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setVersion(opt.id as UuidVersion)}
                   className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                     version === opt.id 
                       ? 'bg-brand-50 border-brand-200 ring-1 ring-brand-500/20' 
                       : 'bg-white border-slate-200 hover:border-slate-300'
                   }`}
                 >
                    <div className={`font-medium ${version === opt.id ? 'text-brand-700' : 'text-slate-900'}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                 </button>
               ))}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Quantity: {quantity}</label>
             <input 
                type="range" 
                min="1" 
                max="50" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
             <div className="flex justify-between text-xs text-slate-400 mt-1">
               <span>1</span>
               <span>50</span>
             </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={uppercase} 
                 onChange={(e) => setUppercase(e.target.checked)}
                 className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
               />
               <span className="text-sm text-slate-700">Uppercase</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={noHyphens} 
                 onChange={(e) => setNoHyphens(e.target.checked)}
                 className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
               />
               <span className="text-sm text-slate-700">Remove Hyphens</span>
            </label>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <button 
             onClick={generate}
             className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-sm"
           >
             <RefreshCw size={18} /> Regenerate
           </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-2">
             <div className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
               UUID {version.toUpperCase()}
             </div>
             <span className="text-sm text-slate-500">{uuids.length} generated</span>
           </div>
           <button 
              onClick={copyAll}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all"
           >
             {copiedIndex === -1 ? <Check size={16} /> : <FileText size={16} />}
             Copy All
           </button>
         </div>

         <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {uuids.map((uuid, idx) => (
              <div 
                key={`${idx}-${uuid}`} 
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 text-center text-xs text-slate-400 font-mono select-none">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <code className="flex-1 font-mono text-slate-700 text-sm md:text-base break-all">
                  {uuid}
                </code>
                <button
                  onClick={() => copyToClipboard(uuid, idx)}
                  className={`
                    p-2 rounded-lg transition-all
                    ${copiedIndex === idx 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-slate-400 hover:text-brand-600 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100'}
                  `}
                  title="Copy"
                >
                  {copiedIndex === idx ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};