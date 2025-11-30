import React, { useState, useRef, useEffect } from 'react';
import { ToolId, ToolDefinition } from '../types';
import { ChevronDown, Menu, Github, Moon, Sun, Zap } from 'lucide-react';
import { TOOLS } from './Sidebar'; // Re-using the list from Sidebar for now, we will move it later or import it

interface NavbarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTool, onSelectTool }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentTool = TOOLS.find(t => t.id === activeTool) || { name: 'Quick Preview', icon: Zap };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolSelect = (id: ToolId) => {
    onSelectTool(id);
    setIsMenuOpen(false);
  };

  // Group tools for the dropdown
  const categories = ['Converter', 'Formatter', 'Generator'];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <button 
              onClick={() => handleToolSelect(ToolId.QUICK_PREVIEW)}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-slate-800 transition-colors">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Dongdong's Tools</span>
            </button>

            {/* Tool Selector Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all group border border-transparent hover:border-slate-200"
              >
                <currentTool.icon size={18} className="text-slate-500 group-hover:text-slate-800" />
                <span>{activeTool === ToolId.QUICK_PREVIEW ? 'Tools' : currentTool.name}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-left overflow-hidden">
                  <button
                    onClick={() => handleToolSelect(ToolId.QUICK_PREVIEW)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors
                      ${activeTool === ToolId.QUICK_PREVIEW ? 'text-brand-600 bg-brand-50/50' : 'text-slate-700'}
                    `}
                  >
                    <Zap size={16} />
                    Quick Preview
                  </button>
                  
                  <div className="h-px bg-slate-100 my-2" />
                  
                  {categories.map(cat => (
                    <div key={cat}>
                      <div className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {cat}
                      </div>
                      {TOOLS.filter(t => t.category === cat).map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolSelect(tool.id)}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors
                            ${activeTool === tool.id ? 'text-brand-600 bg-brand-50/50' : 'text-slate-700'}
                          `}
                        >
                          <tool.icon size={16} />
                          {tool.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/*
            <a 
              href="#" 
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>
            */}
          </div>
        </div>
      </div>
    </nav>
  );
};