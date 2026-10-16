import React from 'react';
import { SongbookPage, PrintSettings } from '../types';
import { SongColumnTable } from './SongColumnTable';

interface SongbookPageItemProps {
  page: SongbookPage;
  settings: PrintSettings;
  sortByLabel: string;
}

export const SongbookPageItem: React.FC<SongbookPageItemProps> = ({
  page,
  settings,
  sortByLabel,
}) => {
  // Dimension ratios for screen preview
  const paperRatioClass =
    settings.paperSize === 'legal'
      ? 'min-h-[1250px]'
      : settings.paperSize === 'a4'
      ? 'min-h-[1120px]'
      : 'min-h-[1100px]';

  return (
    <article
      className={`songbook-page bg-white relative flex flex-col justify-between ${paperRatioClass} p-4 sm:p-6 print:p-0 print:min-h-0 print:h-auto border border-slate-200 print:border-0 rounded-xs print:rounded-none`}
    >
      {/* Page Header */}
      <div className="border-b-2 border-slate-900 pb-2 mb-2 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3 min-w-0">
          {settings.showSongbookTitle && (
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 uppercase">
              {settings.songbookTitle || 'KARAOKE SONGBOOK'}
            </span>
          )}
          {settings.showCategoryHeader && page.categoryRange && (
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {sortByLabel}: <span className="text-indigo-600 font-bold">{page.categoryRange}</span>
            </span>
          )}
        </div>

        {settings.showPageNumbers && (
          <div className="text-xs font-mono font-semibold text-slate-700 shrink-0">
            PAGE {page.pageNumber} OF {page.totalPages}
          </div>
        )}
      </div>

      {/* 2-Column Content Grid */}
      <div className="flex-1 flex gap-4 sm:gap-6 relative min-h-0">
        {/* Column 1 */}
        <SongColumnTable
          songs={page.col1Songs}
          settings={settings}
          columnIndex={1}
        />

        {/* Vertical Divider Line between columns */}
        {settings.columnLine && (
          <div
            className="w-[1px] bg-slate-300 print:bg-slate-400 shrink-0 self-stretch my-1"
            aria-hidden="true"
          />
        )}

        {/* Column 2 */}
        <SongColumnTable
          songs={page.col2Songs}
          settings={settings}
          columnIndex={2}
        />
      </div>

      {/* Page Footer */}
      <div className="border-t border-slate-300 pt-1.5 mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>
          {settings.songbookSubtitle || '2-Column Karaoke Song List'}
        </span>
        <span>
          {page.col1Songs.length + page.col2Songs.length} songs on this page
        </span>
        {settings.showPageNumbers && (
          <span>P. {page.pageNumber}</span>
        )}
      </div>
    </article>
  );
};
