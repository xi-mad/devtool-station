import React, { useState, useRef, useEffect } from 'react';
import { ToolId } from '../types';
import { ChevronDown, Zap, Github, RefreshCw, FileEdit, Sparkles } from 'lucide-react';
import { TOOLS } from './Sidebar';

interface NavbarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTool, onSelectTool }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolSelect = (id: ToolId) => {
    onSelectTool(id);
    setOpenMenu(null);
  };

  const categoryConfig = [
    { name: 'Converter', icon: RefreshCw },
    { name: 'Formatter', icon: FileEdit },
    { name: 'Generator', icon: Sparkles }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6" ref={navRef}>
            {/* Logo */}
            <button 
              onClick={() => handleToolSelect(ToolId.QUICK_PREVIEW)}
              className="flex items-center gap-2 group mr-2"
            >
              <img 
                src="favicon-32x32.png" 
                alt="DevTool Station Logo" 
                className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform"
              />
              <span className="font-bold text-xl tracking-tight text-slate-900">Dongdong's Tools</span>
            </button>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-1">
                {/* Quick Preview */}
                <button
                    onClick={() => handleToolSelect(ToolId.QUICK_PREVIEW)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all border border-transparent
                        ${activeTool === ToolId.QUICK_PREVIEW
                            ? 'text-brand-600 bg-brand-50/50 border-brand-200' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200'
                        }
                    `}
                >
                    <Zap size={16} className={activeTool === ToolId.QUICK_PREVIEW ? 'text-brand-600' : 'text-slate-400'} />
                    Quick Preview
                </button>

                {/* Category Dropdowns */}
                {categoryConfig.map(({ name, icon: Icon }) => (
                    <div key={name} className="relative">
                        <button
                            onClick={() => setOpenMenu(openMenu === name ? null : name)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all border border-transparent
                                ${openMenu === name 
                                    ? 'bg-slate-100 text-slate-900' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200'
                                }
                                ${TOOLS.some(t => t.category === name && t.id === activeTool) ? 'text-brand-600 bg-brand-50/50 border-brand-200' : ''}
                            `}
                        >
                            <Icon size={16} className={
                                TOOLS.some(t => t.category === name && t.id === activeTool) 
                                    ? 'text-brand-600' 
                                    : openMenu === name ? 'text-slate-700' : 'text-slate-400'
                            } />
                            {name}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${openMenu === name ? 'rotate-180' : ''} opacity-50`} />
                        </button>

                        {openMenu === name && (
                            <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-left overflow-hidden">
                                {TOOLS.filter(t => t.category === name).map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => handleToolSelect(tool.id)}
                                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors
                                            ${activeTool === tool.id ? 'text-brand-600 bg-brand-50/50 border-l-2 border-brand-500' : 'text-slate-700 border-l-2 border-transparent'}
                                        `}
                                    >
                                        <tool.icon size={16} className={activeTool === tool.id ? 'text-brand-600' : 'text-slate-400'} />
                                        <span>{tool.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <a 
              href="https://github.com/xi-mad/devtool-station"
              target="_blank"
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};