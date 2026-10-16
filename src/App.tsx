import React, { useState, useMemo } from 'react';
import { Song, SortBy, SortOrder, PrintSettings } from './types';
import { getInitialSongs } from './data/initialSongs';
import { sortSongs, paginateSongs } from './utils/pagination';
import { generateExpandedSonglist } from './utils/benchmark';
import { Header } from './components/Header';
import { PrintPreview } from './components/PrintPreview';
import { SongTableManager } from './components/SongTableManager';
import { ImportModal } from './components/ImportModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import { PrintRangeModal } from './components/PrintRangeModal';
import { SongbookPageItem } from './components/SongbookPageItem';

const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  paperSize: 'letter',
  songsPerColumn: 50, // 50 per column = 100 songs per page
  fontSize: 'sm', // clean 9pt
  showPageNumbers: true,
  showSongbookTitle: true,
  songbookTitle: 'KARAOKE SONGBOOK',
  songbookSubtitle: 'Master 2-Column Song Collection',
  showCategoryHeader: true,
  columnLine: true,
  compactPadding: true,
  rowStriping: true,
  twoColumnLayout: true,
  uppercaseTitle: false,
  uppercaseArtist: false,
  titleColumnWidth: 52,
  numberColumnWidth: 18,
  artistColumnWidth: 30,
  autoFitLongText: true,
  highlightNumberColumn: true,
  numberHighlightTheme: 'amber',
  numberFontSizeIncrease: true,
};

export default function App() {
  const [songs, setSongs] = useState<Song[]>(() => getInitialSongs());
  const [sortBy, setSortBy] = useState<SortBy>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentView, setCurrentView] = useState<'preview' | 'manager'>('preview');

  // Modals
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintRangeOpen, setIsPrintRangeOpen] = useState(false);

  // Print settings
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_PRINT_SETTINGS);
  const [printRange, setPrintRange] = useState<{ fromPage: number; toPage: number } | null>(null);

  // Sort songs
  const sortedSongs = useMemo(() => {
    return sortSongs(songs, sortBy, sortOrder);
  }, [songs, sortBy, sortOrder]);

  // Paginate songs into 2-column pages
  const pages = useMemo(() => {
    return paginateSongs(sortedSongs, printSettings, sortBy);
  }, [sortedSongs, printSettings, sortBy]);

  // Sort order toggle handler
  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Add / Edit / Delete song handlers
  const handleAddSong = (newSongData: Omit<Song, 'id'>) => {
    const newSong: Song = {
      ...newSongData,
      id: `song-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };
    setSongs((prev) => [newSong, ...prev]);
  };

  const handleUpdateSong = (updatedSong: Song) => {
    setSongs((prev) => prev.map((s) => (s.id === updatedSong.id ? updatedSong : s)));
  };

  const handleDeleteSong = (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
  };

  const handleImportSongs = (importedSongs: Song[], replace: boolean) => {
    if (replace) {
      setSongs(importedSongs);
    } else {
      setSongs((prev) => [...prev, ...importedSongs]);
    }
  };

  const handleResetDefault = () => {
    setSongs(getInitialSongs());
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all songs from the list?')) {
      setSongs([]);
    }
  };

  const handleLoadBenchmark = (count: number) => {
    if (count <= 2500) {
      setSongs(getInitialSongs());
    } else {
      const generated = generateExpandedSonglist(count);
      setSongs(generated);
    }
  };

  // Print trigger
  const handlePrintRequest = (range?: { fromPage?: number; toPage?: number }) => {
    if (range && range.fromPage && range.toPage) {
      setPrintRange({ fromPage: range.fromPage, toPage: range.toPage });
      setTimeout(() => {
        window.print();
      }, 100);
    } else {
      setIsPrintRangeOpen(true);
    }
  };

  const handleConfirmPrint = (fromPage: number, toPage: number) => {
    setPrintRange({ fromPage, toPage });
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Filter pages for print output if range is set
  const printablePages = useMemo(() => {
    if (!printRange) return pages;
    return pages.filter(
      (p) => p.pageNumber >= printRange.fromPage && p.pageNumber <= printRange.toPage
    );
  }, [pages, printRange]);

  const sortByLabel =
    sortBy === 'title' ? 'Titles' : sortBy === 'artist' ? 'Artists' : 'Numbers';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPrint={() => handlePrintRequest()}
        totalSongs={songs.length}
        totalPages={pages.length}
        onLoadFull47k={() => handleLoadBenchmark(47000)}
      />

      {/* 47,000 Song notice bar if viewing sample */}
      {songs.length < 40000 && (
        <div className="bg-indigo-900 text-indigo-100 text-xs px-4 py-2 border-b border-indigo-800 flex items-center justify-between print:hidden">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Currently displaying <strong>{songs.length.toLocaleString()} songs</strong> ({pages.length} pages). Ready for your complete 47,000+ song list?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLoadBenchmark(47000)}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded shadow-2xs transition-colors shrink-0"
              >
                ⚡ Load All 47,000 Songs (470 Pages)
              </button>
              <button
                onClick={() => setIsImportOpen(true)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors shrink-0"
              >
                Upload File (.csv / .tsv / .txt)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Interactive Views */}
      <main className="flex-1 pb-16 print:hidden">
        {currentView === 'preview' ? (
          <PrintPreview
            songs={sortedSongs}
            pages={pages}
            settings={printSettings}
            sortBy={sortBy}
            onPrint={handlePrintRequest}
          />
        ) : (
          <SongTableManager
            songs={songs}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onAddSong={handleAddSong}
            onUpdateSong={handleUpdateSong}
            onDeleteSong={handleDeleteSong}
            onResetDefault={handleResetDefault}
            onClearAll={handleClearAll}
          />
        )}
      </main>

      {/* Print-Only Target: Completely replaces screen view during window.print() */}
      <div className="hidden print:block w-full">
        {printablePages.map((page) => (
          <SongbookPageItem
            key={`print-page-${page.pageNumber}`}
            page={page}
            settings={printSettings}
            sortByLabel={sortByLabel}
          />
        ))}
      </div>

      {/* Modals & Drawers */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportSongs}
        onLoadBenchmarkDataset={handleLoadBenchmark}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={printSettings}
        onSettingsChange={setPrintSettings}
        onResetSettings={() => setPrintSettings(DEFAULT_PRINT_SETTINGS)}
      />

      <PrintRangeModal
        isOpen={isPrintRangeOpen}
        onClose={() => setIsPrintRangeOpen(false)}
        totalPages={pages.length}
        currentPageNumber={1}
        onConfirmPrint={handleConfirmPrint}
      />
    </div>
  );
}
