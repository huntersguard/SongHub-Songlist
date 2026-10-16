import React from 'react';
import { Song, PrintSettings } from '../types';
import { getAutoFitStyle } from '../utils/textFit';

interface SongColumnTableProps {
  songs: Song[];
  settings: PrintSettings;
  columnIndex: 1 | 2;
}

export const SongColumnTable: React.FC<SongColumnTableProps> = ({
  songs,
  settings,
  columnIndex,
}) => {
  const rowPaddingClass =
    settings.fontSize === 'xs'
      ? 'py-[2px]'
      : settings.fontSize === 'sm'
      ? 'py-[3px]'
      : 'py-[4px]';

  const baseFontClass =
    settings.fontSize === 'xs'
      ? 'text-[9.5px] leading-snug'
      : settings.fontSize === 'sm'
      ? 'text-[11px] leading-snug'
      : 'text-[12px] leading-normal';

  const headerFontClass =
    settings.fontSize === 'xs'
      ? 'text-[10px] py-1'
      : settings.fontSize === 'sm'
      ? 'text-[11px] py-1.5'
      : 'text-[12px] py-1.5';

  // Number column highlight styles
  const getNumberHighlightClass = (isHeader: boolean, isStriped: boolean) => {
    if (!settings.highlightNumberColumn) {
      return isHeader
        ? 'bg-slate-200 text-slate-900 border-slate-300'
        : isStriped
        ? 'bg-slate-100 text-slate-900 border-slate-200'
        : 'bg-white text-slate-900 border-slate-200';
    }

    switch (settings.numberHighlightTheme) {
      case 'yellow':
        return isHeader
          ? 'bg-yellow-300 text-yellow-950 border-yellow-400 font-black print:bg-yellow-200'
          : isStriped
          ? 'bg-yellow-100/90 text-yellow-950 border-yellow-200 font-extrabold print:bg-yellow-100/80'
          : 'bg-yellow-50 text-yellow-950 border-yellow-200 font-extrabold print:bg-yellow-50';
      case 'slate':
        return isHeader
          ? 'bg-slate-800 text-white border-slate-900 font-black print:bg-slate-300 print:text-black'
          : isStriped
          ? 'bg-slate-200 text-slate-900 border-slate-300 font-bold print:bg-slate-100'
          : 'bg-slate-100 text-slate-900 border-slate-300 font-bold print:bg-slate-50';
      case 'classic':
        return isHeader
          ? 'bg-slate-900 text-white border-black font-black'
          : 'bg-slate-100/90 text-black border-slate-300 font-black';
      case 'amber':
      default:
        return isHeader
          ? 'bg-amber-200 text-amber-950 border-amber-300 font-black print:bg-amber-200 print:text-black'
          : isStriped
          ? 'bg-amber-100/90 text-amber-950 border-amber-200 font-extrabold print:bg-amber-100/70 print:text-black'
          : 'bg-amber-50/90 text-amber-950 border-amber-200 font-extrabold print:bg-amber-50 print:text-black';
    }
  };

  // Increased font size for NO. column as requested
  const numberFontSizeClass = settings.numberFontSizeIncrease
    ? settings.fontSize === 'xs'
      ? 'text-[11.5px] font-black tracking-tight'
      : settings.fontSize === 'sm'
      ? 'text-[12.5px] font-black tracking-tight'
      : 'text-[13.5px] font-black tracking-tight'
    : settings.fontSize === 'xs'
    ? 'text-[10px] font-bold'
    : settings.fontSize === 'sm'
    ? 'text-[11px] font-bold'
    : 'text-[12px] font-bold';

  return (
    <div className="flex-1 w-full min-w-0">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col style={{ width: `${settings.numberColumnWidth}%` }} />
          <col style={{ width: `${settings.titleColumnWidth}%` }} />
          <col style={{ width: `${settings.artistColumnWidth}%` }} />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-slate-900 text-slate-900 font-bold tracking-wider text-left">
            <th
              className={`px-1 font-mono uppercase text-center ${headerFontClass} border-r ${getNumberHighlightClass(
                true,
                false
              )}`}
            >
              NO.
            </th>
            <th className={`px-2 uppercase ${headerFontClass} border-r border-slate-300 bg-slate-100`}>
              TITLE
            </th>
            <th className={`px-2 uppercase ${headerFontClass} bg-slate-100`}>
              ARTIST
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, rowIdx) => {
            const isStriped = settings.rowStriping && rowIdx % 2 === 1;
            const titleText = settings.uppercaseTitle ? song.title.toUpperCase() : song.title;
            const artistText = settings.uppercaseArtist ? song.artist.toUpperCase() : song.artist;

            const titleAutoStyle = getAutoFitStyle(
              titleText,
              'title',
              settings.fontSize,
              settings.titleColumnWidth,
              settings.autoFitLongText
            );

            const artistAutoStyle = getAutoFitStyle(
              artistText,
              'artist',
              settings.fontSize,
              settings.artistColumnWidth,
              settings.autoFitLongText
            );

            return (
              <tr
                key={`${song.id || rowIdx}-${columnIndex}`}
                className={`border-b border-slate-200 transition-colors ${
                  isStriped ? 'bg-slate-50/80' : 'bg-white'
                }`}
              >
                {/* Highlighted & slightly larger font for NO. column */}
                <td
                  className={`px-1 text-center font-mono tabular-nums ${rowPaddingClass} ${numberFontSizeClass} border-r ${getNumberHighlightClass(
                    false,
                    isStriped
                  )}`}
                >
                  {song.no}
                </td>

                {/* Auto-fit font size for Title column without ellipsis ... */}
                <td
                  className={`px-2 font-medium text-slate-900 border-r border-slate-200 ${rowPaddingClass} ${baseFontClass} overflow-hidden`}
                  title={song.title}
                >
                  <span style={titleAutoStyle} className="block leading-none">
                    {titleText}
                  </span>
                </td>

                {/* Auto-fit font size for Artist column without ellipsis ... */}
                <td
                  className={`px-2 text-slate-600 ${rowPaddingClass} ${baseFontClass} overflow-hidden`}
                  title={song.artist}
                >
                  <span style={artistAutoStyle} className="block leading-none">
                    {artistText}
                  </span>
                </td>
              </tr>
            );
          })}

          {/* Fill remaining empty rows if column has fewer items than target */}
          {Array.from({ length: Math.max(0, settings.songsPerColumn - songs.length) }).map(
            (_, emptyIdx) => (
              <tr key={`empty-${columnIndex}-${emptyIdx}`} className="border-b border-slate-100">
                <td
                  className={`px-1 text-center font-mono text-transparent ${rowPaddingClass} ${numberFontSizeClass} border-r border-slate-100 select-none ${
                    settings.highlightNumberColumn ? 'bg-amber-50/30' : ''
                  }`}
                >
                  -
                </td>
                <td className={`px-2 text-transparent ${rowPaddingClass} ${baseFontClass} border-r border-slate-100 select-none`}>
                  -
                </td>
                <td className={`px-2 text-transparent ${rowPaddingClass} ${baseFontClass} select-none`}>
                  -
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
