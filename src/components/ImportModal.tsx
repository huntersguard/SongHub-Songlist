import React, { useState } from 'react';
import { parseSongList } from '../utils/parser';
import { Song } from '../types';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (songs: Song[], replace: boolean) => void;
  onLoadBenchmarkDataset: (count: number) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onLoadBenchmarkDataset,
}) => {
  const [inputText, setInputText] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [parsedPreview, setParsedPreview] = useState<Song[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (text.trim().length > 10) {
      // Parse a quick slice for preview
      const lines = text.split(/\r?\n/).slice(0, 15).join('\n');
      const preview = parseSongList(lines);
      setParsedPreview(preview);
    } else {
      setParsedPreview([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleTextChange(content);
      }
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const allSongs = parseSongList(inputText);
      onImport(allSongs, importMode === 'replace');
      setIsProcessing(false);
      onClose();
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Import Karaoke Song List
              </h2>
              <p className="text-xs text-slate-500">
                Paste your tab-separated or comma-separated list of up to 50,000+ songs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* File upload prompt */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-400 hover:bg-indigo-50/20 transition-colors">
            <input
              type="file"
              id="file-upload"
              accept=".txt,.tsv,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <FileText className="w-7 h-7 text-indigo-500 mb-1" />
              <span className="text-xs font-semibold text-indigo-600 hover:underline">
                Upload .TSV, .CSV, or .TXT file
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Supports standard tab-separated and CSV formats
              </span>
            </label>
          </div>

          {/* Paste area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="paste-area" className="text-xs font-bold text-slate-800">
                Or Paste Songs Text
              </label>
              <span className="text-[11px] text-slate-500">
                Format: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">NO.[tab]TITLE[tab]ARTIST</code>
              </span>
            </div>
            <textarea
              id="paste-area"
              rows={7}
              placeholder={`NO.\tTITLE\tARTIST\n7421\t3:00 AM\tKate Nash\n35001\t3\tBritney Spears\n38538\t4\tBamboo\n...`}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full font-mono text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50"
            />
          </div>

          {/* Preview of detected songs */}
          {parsedPreview.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Detected Sample Rows (First {parsedPreview.length})</span>
              </div>
              <div className="max-h-32 overflow-y-auto text-[11px] divide-y divide-slate-200">
                {parsedPreview.map((s, idx) => (
                  <div key={idx} className="py-1 flex items-baseline gap-2 font-mono">
                    <span className="w-16 text-indigo-700 font-bold shrink-0">{s.no}</span>
                    <span className="font-semibold text-slate-800 truncate flex-1">{s.title}</span>
                    <span className="text-slate-500 truncate w-36 text-right shrink-0">{s.artist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Mode: Replace vs Append */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Import Destination:</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-800">Replace current list</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-800">Append to list</span>
              </label>
            </div>
          </div>

          {/* 47,000 benchmark / sample buttons */}
          <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Need test data?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onLoadBenchmarkDataset(2500);
                  onClose();
                }}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
              >
                Reset to 2,400+ Songs
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoadBenchmarkDataset(10000);
                  onClose();
                }}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
              >
                Load 10,000 Songs Test
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoadBenchmarkDataset(47000);
                  onClose();
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors border border-indigo-200"
              >
                Load 47,000 Songs (Full Stress Test)
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {inputText.trim() ? `${inputText.split('\n').filter(Boolean).length} lines entered` : ''}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!inputText.trim() || isProcessing}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Apply Songs'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
