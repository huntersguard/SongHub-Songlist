import { Song } from '../types';

/**
 * Parses user input in TSV, CSV, or pipe-delimited format into structured Song items.
 */
export function parseSongList(rawText: string): Song[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split(/\r?\n/);
  const songs: Song[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if it's the header row
    const lower = line.toLowerCase();
    if (
      (lower.includes('no') || lower.includes('number') || lower.includes('#')) &&
      lower.includes('title') &&
      lower.includes('artist')
    ) {
      continue;
    }

    // Try Tab separated first (most common for this karaoke list)
    if (line.includes('\t')) {
      const parts = line.split('\t').map(cleanCell);
      if (parts.length >= 3) {
        songs.push({
          id: `song-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          no: parts[0] || '',
          title: parts[1] || '',
          artist: parts.slice(2).join(' ') || '',
        });
        continue;
      } else if (parts.length === 2) {
        // e.g. No and Title, or Title and Artist
        songs.push({
          id: `song-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          no: parts[0] || '',
          title: parts[1] || '',
          artist: 'Unknown',
        });
        continue;
      }
    }

    // Pipe separated: 1234 | Title | Artist
    if (line.includes('|')) {
      const parts = line.split('|').map(cleanCell);
      if (parts.length >= 3) {
        songs.push({
          id: `song-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          no: parts[0] || '',
          title: parts[1] || '',
          artist: parts.slice(2).join(' ') || '',
        });
        continue;
      }
    }

    // CSV format (comma separated, handling quotes)
    const csvParts = parseCSVLine(line).map(cleanCell);
    if (csvParts.length >= 3) {
      songs.push({
        id: `song-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        no: csvParts[0] || '',
        title: csvParts[1] || '',
        artist: csvParts.slice(2).join(' ') || '',
      });
      continue;
    }

    // Semicolon separated
    if (line.includes(';')) {
      const parts = line.split(';').map(cleanCell);
      if (parts.length >= 3) {
        songs.push({
          id: `song-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          no: parts[0] || '',
          title: parts[1] || '',
          artist: parts.slice(2).join(' ') || '',
        });
        continue;
      }
    }

    // Fallback: Number followed by rest of string
    const match = line.match(/^(\d+)\s+(.+)$/);
    if (match) {
      const no = match[1];
      const remainder = match[2];
      // Check if remainder has a dash or " - " or by
      const byMatch = remainder.split(/\s+-\s+|\s+by\s+|\s+ft\.?\s+/i);
      if (byMatch.length >= 2) {
        songs.push({
          id: `song-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          no,
          title: cleanCell(byMatch[0]),
          artist: cleanCell(byMatch.slice(1).join(' - ')),
        });
        continue;
      } else {
        songs.push({
          id: `song-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          no,
          title: cleanCell(remainder),
          artist: 'Unknown',
        });
        continue;
      }
    }
  }

  return songs;
}

function cleanCell(cell: string): string {
  if (!cell) return '';
  let str = cell.trim();
  // Strip surrounding quotes
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }
  return str.replace(/\\"/g, '"');
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function exportToCSV(songs: Song[]): string {
  const header = 'NO.,TITLE,ARTIST\n';
  const rows = songs.map((s) => {
    const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
    return `${escape(s.no)},${escape(s.title)},${escape(s.artist)}`;
  });
  return header + rows.join('\n');
}

export function exportToTSV(songs: Song[]): string {
  const header = 'NO.\tTITLE\tARTIST\n';
  const rows = songs.map((s) => `${s.no}\t${s.title}\t${s.artist}`);
  return header + rows.join('\n');
}
