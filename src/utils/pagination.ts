import { Song, SortBy, SortOrder, SongbookPage, PrintSettings } from '../types';

/**
 * Sorts songs based on selected column and direction
 */
export function sortSongs(songs: Song[], sortBy: SortBy, sortOrder: SortOrder): Song[] {
  return [...songs].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'no') {
      const numA = parseInt(a.no.replace(/\D/g, ''), 10);
      const numB = parseInt(b.no.replace(/\D/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        comparison = numA - numB;
      } else {
        comparison = a.no.localeCompare(b.no, undefined, { numeric: true, sensitivity: 'base' });
      }
    } else if (sortBy === 'title') {
      // Clean leading quotes or symbols for natural A-Z sorting
      const cleanA = a.title.replace(/^["'`#(\s]+/, '');
      const cleanB = b.title.replace(/^["'`#(\s]+/, '');
      comparison = cleanA.localeCompare(cleanB, undefined, { sensitivity: 'base' });
    } else if (sortBy === 'artist') {
      const cleanA = a.artist.replace(/^["'`#(\s]+/, '');
      const cleanB = b.artist.replace(/^["'`#(\s]+/, '');
      comparison = cleanA.localeCompare(cleanB, undefined, { sensitivity: 'base' });
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Determines the category or letter of a song based on sort mode
 */
export function getCategoryLetter(song: Song, sortBy: SortBy): string {
  const target = sortBy === 'artist' ? song.artist : song.title;
  const clean = target.replace(/^["'`#(\s]+/, '').trim().toUpperCase();
  if (!clean) return '#';
  const first = clean.charAt(0);
  if (/[A-Z]/.test(first)) {
    return first;
  }
  if (/[0-9]/.test(first)) {
    return '#';
  }
  return '#';
}

/**
 * Splits the song list into 2-column physical pages according to PrintSettings.
 */
export function paginateSongs(
  songs: Song[],
  settings: PrintSettings,
  sortBy: SortBy
): SongbookPage[] {
  if (songs.length === 0) return [];

  const songsPerPage = settings.songsPerColumn * 2;
  const totalPages = Math.ceil(songs.length / songsPerPage);
  const pages: SongbookPage[] = [];

  for (let p = 0; p < totalPages; p++) {
    const startIdx = p * songsPerPage;
    const pageSongs = songs.slice(startIdx, startIdx + songsPerPage);

    const col1Songs = pageSongs.slice(0, settings.songsPerColumn);
    const col2Songs = pageSongs.slice(settings.songsPerColumn, songsPerPage);

    // Calculate category range for page header (e.g., "A - B")
    const firstSong = col1Songs[0];
    const lastSong = col2Songs[col2Songs.length - 1] || col1Songs[col1Songs.length - 1];

    let categoryRange = '';
    if (firstSong && lastSong) {
      if (sortBy === 'no') {
        categoryRange = `#${firstSong.no} - #${lastSong.no}`;
      } else {
        const catFirst = getCategoryLetter(firstSong, sortBy);
        const catLast = getCategoryLetter(lastSong, sortBy);
        categoryRange = catFirst === catLast ? catFirst : `${catFirst} - ${catLast}`;
      }
    }

    pages.push({
      pageNumber: p + 1,
      totalPages,
      categoryRange,
      col1Songs,
      col2Songs,
    });
  }

  return pages;
}

/**
 * Returns available alphabetical jump letters present in the dataset
 */
export function getAvailableLetters(songs: Song[], sortBy: SortBy): { letter: string; count: number; firstIndex: number }[] {
  const letterMap = new Map<string, { count: number; firstIndex: number }>();

  songs.forEach((song, idx) => {
    const letter = getCategoryLetter(song, sortBy);
    if (!letterMap.has(letter)) {
      letterMap.set(letter, { count: 1, firstIndex: idx });
    } else {
      const current = letterMap.get(letter)!;
      current.count += 1;
    }
  });

  const sortedLetters = Array.from(letterMap.entries()).sort((a, b) => {
    if (a[0] === '#') return -1;
    if (b[0] === '#') return 1;
    return a[0].localeCompare(b[0]);
  });

  return sortedLetters.map(([letter, data]) => ({
    letter,
    count: data.count,
    firstIndex: data.firstIndex,
  }));
}
