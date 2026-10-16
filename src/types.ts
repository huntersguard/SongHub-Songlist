export interface Song {
  id: string;
  no: string;
  title: string;
  artist: string;
}

export type SortBy = 'title' | 'artist' | 'no';
export type SortOrder = 'asc' | 'desc';

export type PaperSize = 'a4' | 'letter' | 'legal';
export type PageOrientation = 'portrait'; // Karaoke songbooks are standard portrait 2-column

export interface PrintSettings {
  paperSize: PaperSize;
  songsPerColumn: number; // e.g. 45, 50, 55, 60
  fontSize: 'xs' | 'sm' | 'base'; // 8pt, 9pt, 10pt equivalent
  showPageNumbers: boolean;
  showSongbookTitle: boolean;
  songbookTitle: string;
  songbookSubtitle: string;
  showCategoryHeader: boolean; // e.g. "SONGS BY TITLE (A - C)"
  columnLine: boolean; // vertical divider line between the two columns
  compactPadding: boolean;
  rowStriping: boolean;
  twoColumnLayout: boolean; // Always true by default
  uppercaseTitle: boolean;
  uppercaseArtist: boolean;
  titleColumnWidth: number; // percentage (e.g. 52%)
  numberColumnWidth: number; // percentage (e.g. 18%)
  artistColumnWidth: number; // percentage (e.g. 30%)
  autoFitLongText: boolean; // dynamically scale down font size for long title/artist text to fit within fixed cell width
  highlightNumberColumn: boolean; // highlight the entire NO. column for easy scanning
  numberHighlightTheme: 'amber' | 'yellow' | 'slate' | 'classic'; // highlight color
  numberFontSizeIncrease: boolean; // increase font size of song number slightly for maximum visibility
}

export interface SongbookPage {
  pageNumber: number;
  totalPages: number;
  categoryRange: string; // e.g. "A - B" or "ARTISTS: A - C"
  col1Songs: Song[];
  col2Songs: Song[];
}
