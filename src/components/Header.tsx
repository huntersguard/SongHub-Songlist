import React from 'react';
import { Printer, BookOpen, ListMusic, Upload, Sliders } from 'lucide-react';

interface HeaderProps {
  currentView: 'preview' | 'manager';
  onViewChange: (view: 'preview' | 'manager') => void;
  onOpenImport: () => void;
  onOpenSettings: () => void;
  onPrint: () => void;
  totalSongs: number;
  totalPages: number;
  onLoadFull47k: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenImport,
  onOpenSettings,
  onPrint,
  totalSongs,
  totalPages,
  onLoadFull47k,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">
                Karaoke Songbook
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-semibold text-slate-700">{totalSongs.toLocaleString()}</span> songs · <span className="font-semibold text-slate-700">{totalPages}</span> pages
              </p>
            </div>
          </div>

          {/* Navigation & View switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => onViewChange('preview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                currentView === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>2-Column Print Preview</span>
            </button>
            <button
              onClick={() => onViewChange('manager')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                currentView === 'manager'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Song Manager</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {totalSongs < 40000 && (
              <button
                onClick={onLoadFull47k}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-2xs transition-colors"
                title="Populate full 47,000+ song collection"
              >
                <span>⚡ Load 47,000 Songs</span>
              </button>
            )}

            <button
              onClick={onOpenImport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Import or Paste more songs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Import Songs</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Configure 2-column page layout, font size, margins"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Page Settings</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
