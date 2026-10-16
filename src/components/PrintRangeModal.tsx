import React, { useState } from 'react';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface PrintRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  currentPageNumber: number;
  onConfirmPrint: (fromPage: number, toPage: number) => void;
}

export const PrintRangeModal: React.FC<PrintRangeModalProps> = ({
  isOpen,
  onClose,
  totalPages,
  currentPageNumber,
  onConfirmPrint,
}) => {
  const [printOption, setPrintOption] = useState<'all' | 'current' | 'range'>('all');
  const [fromPage, setFromPage] = useState<number>(1);
  const [toPage, setToPage] = useState<number>(Math.min(25, totalPages));

  if (!isOpen) return null;

  const handlePrint = () => {
    if (printOption === 'all') {
      onConfirmPrint(1, totalPages);
    } else if (printOption === 'current') {
      onConfirmPrint(currentPageNumber, currentPageNumber);
    } else {
      onConfirmPrint(fromPage, toPage);
    }
    onClose();
  };

  const getPageCountToPrint = () => {
    if (printOption === 'all') return totalPages;
    if (printOption === 'current') return 1;
    return Math.max(1, toPage - fromPage + 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Print Songbook
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <p className="text-xs text-slate-600">
            Every page will be printed with <strong>2 columns</strong> and the <strong>NO. TITLE ARTIST</strong> header repeated at the top of both columns.
          </p>

          <div className="space-y-2.5">
            <label
              onClick={() => setPrintOption('all')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                printOption === 'all'
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="printOption"
                checked={printOption === 'all'}
                onChange={() => setPrintOption('all')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-xs">Print All Pages</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Complete songbook document ({totalPages} pages, 2 columns per page)
                </div>
              </div>
            </label>

            <label
              onClick={() => setPrintOption('current')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                printOption === 'current'
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="printOption"
                checked={printOption === 'current'}
                onChange={() => setPrintOption('current')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-xs">
                  Print Current Page Only (Page {currentPageNumber})
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Prints single sheet for quick reference or testing
                </div>
              </div>
            </label>

            <label
              onClick={() => setPrintOption('range')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                printOption === 'range'
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="printOption"
                checked={printOption === 'range'}
                onChange={() => setPrintOption('range')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-xs">Print Specific Page Range</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Useful for printing in smaller batches or specific letter volumes
                </div>
                {printOption === 'range' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-indigo-100">
                    <span className="text-xs text-slate-600">From Page:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={fromPage}
                      onChange={(e) => setFromPage(Math.max(1, Math.min(Number(e.target.value), totalPages)))}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-mono font-semibold"
                    />
                    <span className="text-xs text-slate-600">to</span>
                    <input
                      type="number"
                      min={fromPage}
                      max={totalPages}
                      value={toPage}
                      onChange={(e) => setToPage(Math.max(fromPage, Math.min(Number(e.target.value), totalPages)))}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-mono font-semibold"
                    />
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 flex items-center justify-between border border-slate-200">
            <span>Pages to be printed:</span>
            <span className="font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {getPageCountToPrint()} {getPageCountToPrint() === 1 ? 'page' : 'pages'}
            </span>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Open Print Dialog</span>
          </button>
        </div>
      </div>
    </div>
  );
};
