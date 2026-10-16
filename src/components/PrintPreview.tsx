import React, { useState } from 'react';
import { Song, SongbookPage, PrintSettings, SortBy } from '../types';
import { SongbookPageItem } from './SongbookPageItem';
import { getAvailableLetters } from '../utils/pagination';
import { ChevronLeft, ChevronRight, Printer, ZoomIn, ZoomOut, Eye, Layers } from 'lucide-react';

interface PrintPreviewProps {
  songs: Song[];
  pages: SongbookPage[];
  settings: PrintSettings;
  sortBy: SortBy;
  onPrint: (range?: { fromPage?: number; toPage?: number }) => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  songs,
  pages,
  settings,
  sortBy,
  onPrint,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pageRangeFrom, setPageRangeFrom] = useState<number>(1);
  const [pageRangeTo, setPageRangeTo] = useState<number>(Math.min(5, pages.length || 1));

  const availableLetters = getAvailableLetters(songs, sortBy);

  const currentPage = pages[currentPageIndex] || pages[0];

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleJumpToLetter = (firstIndex: number) => {
    const songsPerPage = settings.songsPerColumn * 2;
    const targetPage = Math.floor(firstIndex / songsPerPage);
    if (targetPage >= 0 && targetPage < pages.length) {
      setCurrentPageIndex(targetPage);
      if (viewMode === 'all') {
        // Scroll to that page element
        const el = document.getElementById(`songbook-page-${targetPage + 1}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const sortByLabel =
    sortBy === 'title' ? 'Titles' : sortBy === 'artist' ? 'Artists' : 'Numbers';

  return (
    <div className="w-full">
      {/* Control bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-16 z-20 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: View Mode & Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setViewMode('single')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  viewMode === 'single'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Single Page View</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  viewMode === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Pages ({pages.length})</span>
              </button>
            </div>

            {/* Pagination Controls */}
            {viewMode === 'single' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>

                <div className="flex items-center gap-1 text-xs font-mono text-slate-700 font-medium">
                  <span>Page</span>
                  <select
                    value={currentPageIndex}
                    onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-xs font-mono font-semibold text-slate-900"
                  >
                    {pages.map((_, i) => (
                      <option key={i} value={i}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span>of {pages.length}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPageIndex >= pages.length - 1}
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Zoom & Print Range Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] text-slate-700 w-11 text-center font-medium">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="text-[10px] px-1.5 py-0.5 text-slate-500 hover:text-slate-800"
              >
                Reset
              </button>
            </div>

            {/* Quick Print Range Box */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
              <span className="text-slate-500 pl-1 text-[11px]">Print Pgs:</span>
              <input
                type="number"
                min="1"
                max={pages.length}
                value={pageRangeFrom}
                onChange={(e) => setPageRangeFrom(Math.max(1, Math.min(Number(e.target.value), pages.length)))}
                className="w-12 px-1 py-0.5 border border-slate-300 rounded text-center font-mono font-medium text-xs bg-white"
              />
              <span className="text-slate-400">to</span>
              <input
                type="number"
                min={pageRangeFrom}
                max={pages.length}
                value={pageRangeTo}
                onChange={(e) => setPageRangeTo(Math.max(pageRangeFrom, Math.min(Number(e.target.value), pages.length)))}
                className="w-12 px-1 py-0.5 border border-slate-300 rounded text-center font-mono font-medium text-xs bg-white"
              />
              <button
                onClick={() => onPrint({ fromPage: pageRangeFrom, toPage: pageRangeTo })}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-[11px] transition-colors"
                title="Print selected page range"
              >
                <Printer className="w-3 h-3" />
                <span>Go</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alphabet Jump Bar (Only if sorted by Title or Artist) */}
        {availableLetters.length > 0 && (
          <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Jump:
            </span>
            {availableLetters.map(({ letter, count, firstIndex }) => (
              <button
                key={letter}
                onClick={() => handleJumpToLetter(firstIndex)}
                className="px-2 py-0.5 text-xs font-mono font-semibold rounded hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 bg-slate-100 shrink-0 transition-colors"
                title={`Jump to ${letter} (${count} songs)`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pages Canvas */}
      <div className="max-w-7xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
        {pages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600">No songs to display. Please import or add songs to generate pages.</p>
          </div>
        ) : viewMode === 'single' ? (
          /* Single Page Display */
          <div className="flex flex-col items-center">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
              }}
              className="w-full max-w-4xl"
            >
              <div className="screen-paper">
                <SongbookPageItem
                  page={currentPage}
                  settings={settings}
                  sortByLabel={sortByLabel}
                />
              </div>
            </div>
          </div>
        ) : (
          /* All Pages Display (Standard Multi-Page Print Layout) */
          <div
            className="flex flex-col gap-10 print:gap-0 songbook-print-container"
            style={{
              transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              transformOrigin: 'top center',
            }}
          >
            {pages.map((page) => (
              <div
                key={`page-${page.pageNumber}`}
                id={`songbook-page-${page.pageNumber}`}
                className="screen-paper print:shadow-none max-w-4xl mx-auto w-full print:max-w-none"
              >
                <SongbookPageItem
                  page={page}
                  settings={settings}
                  sortByLabel={sortByLabel}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
