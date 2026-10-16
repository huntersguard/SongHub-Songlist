import React, { useState, useMemo } from 'react';
import { Song, SortBy, SortOrder } from '../types';
import { getCategoryLetter, sortSongs } from '../utils/pagination';
import { exportToCSV, exportToTSV } from '../utils/parser';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Download,
  ArrowUpDown,
  RotateCcw,
  Music,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';

interface SongTableManagerProps {
  songs: Song[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (field: SortBy) => void;
  onAddSong: (song: Omit<Song, 'id'>) => void;
  onUpdateSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  onResetDefault: () => void;
  onClearAll: () => void;
}

export const SongTableManager: React.FC<SongTableManagerProps> = ({
  songs,
  sortBy,
  sortOrder,
  onSortChange,
  onAddSong,
  onUpdateSong,
  onDeleteSong,
  onResetDefault,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ no: string; title: string; artist: string }>({
    no: '',
    title: '',
    artist: '',
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newSong, setNewSong] = useState<{ no: string; title: string; artist: string }>({
    no: '',
    title: '',
    artist: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Filter and sort
  const filteredSongs = useMemo(() => {
    let result = songs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.no.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q)
      );
    }

    if (selectedLetter !== 'ALL') {
      result = result.filter((s) => {
        const letter = getCategoryLetter(s, sortBy);
        return letter === selectedLetter;
      });
    }

    return sortSongs(result, sortBy, sortOrder);
  }, [songs, searchQuery, selectedLetter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredSongs.length / pageSize) || 1;
  const pagedSongs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSongs.slice(start, start + pageSize);
  }, [filteredSongs, currentPage]);

  const handleStartEdit = (song: Song) => {
    setEditingId(song.id);
    setEditForm({ no: song.no, title: song.title, artist: song.artist });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.title.trim()) return;
    onUpdateSong({
      id,
      no: editForm.no.trim() || '0000',
      title: editForm.title.trim(),
      artist: editForm.artist.trim() || 'Unknown',
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title.trim()) return;
    onAddSong({
      no: newSong.no.trim() || (songs.length + 1).toString(),
      title: newSong.title.trim(),
      artist: newSong.artist.trim() || 'Unknown',
    });
    setNewSong({ no: '', title: '', artist: '' });
    setIsAdding(false);
  };

  const handleDownloadCSV = () => {
    const csv = exportToCSV(songs);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karaoke_songlist_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTSV = () => {
    const tsv = exportToTSV(songs);
    const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karaoke_songlist_${new Date().toISOString().slice(0, 10)}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const alphabet = ['ALL', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search and Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, artist, or song number..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Single Song</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="Download CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleDownloadTSV}
              className="flex items-center gap-1 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="Download TSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export TSV</span>
            </button>

            <button
              onClick={onResetDefault}
              className="flex items-center gap-1 px-2.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors"
              title="Reset to default sample list"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2.5 py-2 border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-medium transition-colors"
              title="Clear all songs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Alphabet Filter Tabs */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                setSelectedLetter(letter);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md shrink-0 transition-colors ${
                selectedLetter === letter
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Song Form Modal / Inline */}
      {isAdding && (
        <form
          onSubmit={handleCreateSong}
          className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 mb-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Add New Song to List
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Song Number
              </label>
              <input
                type="text"
                placeholder="e.g. 7421"
                required
                value={newSong.no}
                onChange={(e) => setNewSong({ ...newSong, no: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white font-mono"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Song Title
              </label>
              <input
                type="text"
                placeholder="e.g. Bohemian Rhapsody"
                required
                value={newSong.title}
                onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Artist Name
              </label>
              <input
                type="text"
                placeholder="e.g. Queen"
                required
                value={newSong.artist}
                onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Save Song
            </button>
          </div>
        </form>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Table summary */}
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-900">{filteredSongs.length.toLocaleString()}</span> of{' '}
            <span className="font-semibold text-slate-900">{songs.length.toLocaleString()}</span> songs
            {searchQuery && (
              <span>
                {' '}
                matching &ldquo;<span className="text-slate-900 font-medium">{searchQuery}</span>&rdquo;
              </span>
            )}
          </div>
          <div>
            Sort by: <span className="font-semibold text-slate-800 capitalize">{sortBy}</span> ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th
                  onClick={() => onSortChange('no')}
                  className="py-3 px-4 w-32 cursor-pointer bg-amber-200 text-amber-950 font-black border-r border-amber-300 hover:bg-amber-300 transition-colors select-none font-mono"
                >
                  <div className="flex items-center gap-1">
                    <span>No.</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-amber-800" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('title')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Title</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => onSortChange('artist')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Artist</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pagedSongs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Music className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No songs found matching your search.
                  </td>
                </tr>
              ) : (
                pagedSongs.map((song, index) => {
                  const globalIndex = (currentPage - 1) * pageSize + index + 1;
                  const isEditing = editingId === song.id;

                  if (isEditing) {
                    return (
                      <tr key={song.id} className="bg-amber-50/70">
                        <td className="py-2.5 px-4 text-xs font-mono text-slate-400 text-center">
                          {globalIndex}
                        </td>
                        <td className="py-2.5 px-4 font-mono">
                          <input
                            type="text"
                            value={editForm.no}
                            onChange={(e) => setEditForm({ ...editForm, no: e.target.value })}
                            className="w-full px-2 py-1 text-xs font-mono border border-amber-300 rounded bg-white"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white font-medium"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={editForm.artist}
                            onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
                            className="w-full px-2 py-1 text-xs border border-amber-300 rounded bg-white"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(song.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                              title="Save changes"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-slate-400 hover:bg-slate-200 rounded transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={song.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-2.5 px-4 text-xs font-mono text-slate-400 text-center">
                        {globalIndex}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-black text-amber-950 bg-amber-100/70 border-r border-amber-200 text-sm tabular-nums">
                        {song.no}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        {song.title}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {song.artist}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(song)}
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit song"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteSong(song.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete song"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <div>
              Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
