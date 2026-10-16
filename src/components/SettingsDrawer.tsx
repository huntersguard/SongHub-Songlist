import React from 'react';
import { PrintSettings, PaperSize } from '../types';
import { X, Sliders, FileText, Type, Layout, Palette } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrintSettings;
  onSettingsChange: (newSettings: PrintSettings) => void;
  onResetSettings: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onResetSettings,
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof PrintSettings>(key: K, value: PrintSettings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end print:hidden">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Print & 2-Column Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          {/* Section 1: Paper & Layout */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Paper & Density
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Paper Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['a4', 'letter', 'legal'] as PaperSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateSetting('paperSize', size)}
                    className={`py-2 px-3 text-xs font-semibold uppercase rounded-lg border transition-all ${
                      settings.paperSize === size
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Rows Per Column
                </label>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {settings.songsPerColumn} rows ({settings.songsPerColumn * 2} songs/page)
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="65"
                step="5"
                value={settings.songsPerColumn}
                onChange={(e) => updateSetting('songsPerColumn', Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>35 (70/page, roomy)</span>
                <span>50 (100/page, standard)</span>
                <span>65 (130/page, ultra-dense)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Font Size & Scale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'xs', label: 'Compact (8pt)' },
                  { id: 'sm', label: 'Standard (9pt)' },
                  { id: 'base', label: 'Comfortable (10pt)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateSetting('fontSize', f.id as any)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      settings.fontSize === f.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Column Widths */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-indigo-600" />
              Column Width Distribution (%)
            </h3>

            <div className="space-y-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 font-mono">Song No. Width:</span>
                  <span className="font-mono font-bold text-slate-900">{settings.numberColumnWidth}%</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="25"
                  value={settings.numberColumnWidth}
                  onChange={(e) => {
                    const newNoWidth = Number(e.target.value);
                    const remaining = 100 - newNoWidth;
                    // Keep Title and Artist proportional
                    const titleRatio = settings.titleColumnWidth / (settings.titleColumnWidth + settings.artistColumnWidth);
                    const newTitleWidth = Math.round(remaining * titleRatio);
                    const newArtistWidth = remaining - newTitleWidth;
                    onSettingsChange({
                      ...settings,
                      numberColumnWidth: newNoWidth,
                      titleColumnWidth: newTitleWidth,
                      artistColumnWidth: newArtistWidth,
                    });
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Song Title Width:</span>
                  <span className="font-mono font-bold text-slate-900">{settings.titleColumnWidth}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="65"
                  value={settings.titleColumnWidth}
                  onChange={(e) => {
                    const newTitleWidth = Number(e.target.value);
                    const newArtistWidth = 100 - settings.numberColumnWidth - newTitleWidth;
                    if (newArtistWidth >= 15) {
                      onSettingsChange({
                        ...settings,
                        titleColumnWidth: newTitleWidth,
                        artistColumnWidth: newArtistWidth,
                      });
                    }
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Artist Width:</span>
                  <span className="font-mono font-bold text-slate-900">{settings.artistColumnWidth}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div style={{ width: `${settings.numberColumnWidth}%` }} className="bg-indigo-500" title="No." />
                  <div style={{ width: `${settings.titleColumnWidth}%` }} className="bg-slate-700" title="Title" />
                  <div style={{ width: `${settings.artistColumnWidth}%` }} className="bg-emerald-500" title="Artist" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Headers & Titles */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              Songbook Headers & Text
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Main Songbook Header
              </label>
              <input
                type="text"
                value={settings.songbookTitle}
                onChange={(e) => updateSetting('songbookTitle', e.target.value)}
                placeholder="e.g. KARAOKE SONGBOOK"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Footer Subtitle
              </label>
              <input
                type="text"
                value={settings.songbookSubtitle}
                onChange={(e) => updateSetting('songbookSubtitle', e.target.value)}
                placeholder="e.g. Master Karaoke Song List"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-700">Show Songbook Header</span>
                <input
                  type="checkbox"
                  checked={settings.showSongbookTitle}
                  onChange={(e) => updateSetting('showSongbookTitle', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-700">Show Section Letter Range (e.g. A - B)</span>
                <input
                  type="checkbox"
                  checked={settings.showCategoryHeader}
                  onChange={(e) => updateSetting('showCategoryHeader', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-700">Show Page Numbers (Page X of Y)</span>
                <input
                  type="checkbox"
                  checked={settings.showPageNumbers}
                  onChange={(e) => updateSetting('showPageNumbers', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Visual Polish */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              Styling & Print Polish
            </h3>

            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Auto-Fit Long Titles & Artists</span>
                  <span className="text-[11px] text-slate-500 block">Shrinks font for long text to fit without &ldquo;...&rdquo;</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoFitLongText}
                  onChange={(e) => updateSetting('autoFitLongText', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Highlight NO. Column</span>
                  <span className="text-[11px] text-slate-500 block">Tint the entire song number column for easy singing lookup</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highlightNumberColumn}
                  onChange={(e) => updateSetting('highlightNumberColumn', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 shrink-0"
                />
              </label>

              {settings.highlightNumberColumn && (
                <div className="pl-2 pt-1 pb-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Number Highlight Shade
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'amber', label: 'Amber Gold', bg: 'bg-amber-100 border-amber-300' },
                      { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-100 border-yellow-300' },
                      { id: 'slate', label: 'Slate', bg: 'bg-slate-200 border-slate-400' },
                      { id: 'classic', label: 'Classic', bg: 'bg-slate-100 border-slate-300' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => updateSetting('numberHighlightTheme', theme.id as any)}
                        className={`p-1.5 text-[10px] font-medium rounded border text-center transition-all ${theme.bg} ${
                          settings.numberHighlightTheme === theme.id ? 'ring-2 ring-indigo-600 font-bold' : ''
                        }`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs text-slate-700 block">Enlarge Song Number Font Size</span>
                  <span className="text-[10px] text-slate-400 block">Makes song numbers slightly larger & bold</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.numberFontSizeIncrease}
                  onChange={(e) => updateSetting('numberFontSizeIncrease', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-700">Vertical Divider Line Between Columns</span>
                <input
                  type="checkbox"
                  checked={settings.columnLine}
                  onChange={(e) => updateSetting('columnLine', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-700">Alternating Row Striping</span>
                <input
                  type="checkbox"
                  checked={settings.rowStriping}
                  onChange={(e) => updateSetting('rowStriping', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-700">Uppercase All Song Titles</span>
                <input
                  type="checkbox"
                  checked={settings.uppercaseTitle}
                  onChange={(e) => updateSetting('uppercaseTitle', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-700">Uppercase All Artist Names</span>
                <input
                  type="checkbox"
                  checked={settings.uppercaseArtist}
                  onChange={(e) => updateSetting('uppercaseArtist', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetSettings}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
