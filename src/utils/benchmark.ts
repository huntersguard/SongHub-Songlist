import { Song } from '../types';
import { RAW_SAMPLE_SONGS } from '../data/initialSongs';

const EXTRA_LONG_TITLES = [
  '(There\'s No Place Like) Home for the Holidays',
  '110 Percent If You\'re Never Gonna Move',
  'A Dream Is a Wish Your Heart Makes (From Cinderella)',
  'A Nightingale Sang in Berkeley Square',
  'Ain\'t No Love in the Heart of the City',
  'All I Want for Christmas Is My Two Front Teeth',
  'Could I Have This Kiss Forever (Duet Version)',
  'Don\'t You Wish You Had the Answers to Life',
  'Every Time Two Fools Collide When Love Breaks',
  'Give Me Just One More Last Chance Before Tomorrow',
  'Have Yourself a Merry Little Christmas (Live Orchestra)',
  'I Don\'t Know Why You Love Me When I Am Lonely',
  'I Still Haven\'t Found What I\'m Looking For',
  'It\'s Beginning to Look a Lot Like Christmas Worldwide',
  'Please Don\'t Tell Me How the Story Ends Tonight',
  'You\'re the Best Thing That Ever Happened to Me in This Life',
  'Nothing\'s Gonna Change My Love for You (Acoustic Unplugged)',
];

const EXTRA_LONG_ARTISTS = [
  'Mike Will Made It ft. Miley Cyrus, Wiz Khalifa & Juicy J',
  'Gottaluvej, Swkeith, Jthekidd, Rendz, Micosuabe, Swmag & Yp',
  'Skusta Clee, Flow G, Emcee Rhenn, Brando & King Badger',
  'Earth, Wind & Fire feat. The Emotions & Friends',
  'The Smashing Pumpkins feat. Special Guest Artists',
  'Dionne Warwick & The Spinners Orchestra',
  'Spongecola feat. Yeng Constantino & Chito Miranda',
  'Peter, Paul and Mary with Special Guests',
  'The London Symphony Orchestra & Royal Philharmonic',
];

/**
 * Generates an expanded dataset up to 47,000+ songs based on real karaoke patterns
 * for seamless verification of the 2-column print engine and auto-fit text sizing.
 */
export function generateExpandedSonglist(targetCount: number = 47000): Song[] {
  const songs: Song[] = [];
  const baseLen = RAW_SAMPLE_SONGS.length;
  const longTitlesLen = EXTRA_LONG_TITLES.length;
  const longArtistsLen = EXTRA_LONG_ARTISTS.length;

  for (let i = 0; i < targetCount; i++) {
    // Pick base song
    const base = RAW_SAMPLE_SONGS[i % baseLen];
    const no = (i + 1001).toString();

    let title = base.title;
    let artist = base.artist;

    // Every 8th song has an extra long title to test auto-fit font resizing
    if (i % 8 === 3) {
      title = EXTRA_LONG_TITLES[i % longTitlesLen];
    } else if (i >= baseLen) {
      const cycle = Math.floor(i / baseLen);
      title = `${base.title} [Vol. ${cycle + 1}]`;
    }

    // Every 12th song has an extra long artist to test auto-fit font resizing
    if (i % 12 === 7) {
      artist = EXTRA_LONG_ARTISTS[i % longArtistsLen];
    }

    songs.push({
      id: `song-${i + 1}-${no}`,
      no,
      title,
      artist,
    });
  }

  return songs;
}
