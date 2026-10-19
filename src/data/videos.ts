// Every piece of footage on the site, by key.
//
// `mux`        Mux playback ID. The clip streams from Mux and its poster comes from Mux.
// `local`      Stand-in file in /public/media (name without extension), used when there's no Mux ID.
// `muxPortrait` Optional vertical version for phones held upright (hero only).
// `thumbTime`  Second of the video to use for the poster frame (Mux only).
// `film: true` Portfolio piece: appears on /work/ and opens in the player with sound.
//
// A clip with neither `mux` nor `local` shows an empty pitch-green frame, so pages still
// lay out properly while footage is on its way. Films without a source are kept off /work/.
//
// TODO(keegan): send playback IDs with a title and shape (landscape or vertical) and they go here.

export type Category = 'clubs' | 'coaches' | 'players' | 'documentary';

export interface Video {
  title: string;
  sub: string;
  cat: Category;
  ratio: '16:9' | '9:16' | '1:1';
  mux?: string;
  muxPortrait?: string;
  local?: string;
  thumbTime?: number;
  duration?: string; // m:ss
  description?: string; // for search engines (VideoObject)
  uploadDate?: string; // YYYY-MM-DD, for search engines
  film?: boolean;
}

const LONGEST_ROUND = 'PXxbXXPqU2Sm7eXQvErwhrImBv1iJ02ETO5Cuf00FtSDw';

export const videos: Record<string, Video> = {
  // Homepage hero. Stand-in: The Longest Round trailer until there's a Bad At Golf reel.
  reel: {
    title: 'Bad At Golf', sub: 'Golf clubs, coaches, players and brands', cat: 'documentary', ratio: '16:9',
    mux: LONGEST_ROUND, thumbTime: 4,
    description: 'Bad At Golf showreel of golf course, coaching and player films.',
  },
  'longest-round': {
    title: 'The Longest Round', sub: 'Documentary trailer for DAZN', cat: 'documentary', ratio: '16:9',
    mux: LONGEST_ROUND, film: true,
    description: 'Documentary trailer for The Longest Round, a golf challenge filmed for DAZN.',
  },
  'longest-round-social': {
    title: 'The Longest Round x Just Eat', sub: 'Vertical cut for social', cat: 'players', ratio: '9:16',
    mux: '2NzL2q00Rk7XpAkNvU8653oZ02Gz00clJXXo5mGK49dqps', film: true,
    description: 'Vertical social cut from The Longest Round golf documentary, in partnership with Just Eat.',
  },

  // Slots waiting for footage.
  'club-flyover': { title: 'Hole flyover', sub: 'Golf course', cat: 'clubs', ratio: '16:9', film: true },
  'club-promo': { title: 'Club promo film', sub: 'Golf club', cat: 'clubs', ratio: '16:9', film: true },
  'club-social': { title: 'Monthly club content', sub: 'Social clip', cat: 'clubs', ratio: '9:16', film: true },
  'coach-lesson': { title: 'Coaching tip', sub: 'Teaching pro', cat: 'coaches', ratio: '9:16', film: true },
  'coach-promo': { title: 'Academy promo', sub: 'Golf coach', cat: 'coaches', ratio: '16:9', film: true },
  'player-reel': { title: 'Sponsorship reel', sub: 'Player', cat: 'players', ratio: '9:16', film: true },
  'brand-lifestyle': { title: 'Brand film', sub: 'Golf brand', cat: 'players', ratio: '16:9', film: true },
};

export const hasSource = (key: string) => {
  const v = videos[key];
  return !!(v && (v.mux || v.local));
};

const muxPoster = (id: string, t = 1, w = 1600) =>
  `https://image.mux.com/${id}/thumbnail.webp?width=${w}&time=${t}`;

export function poster(key: string, portrait = false): string | undefined {
  const v = videos[key];
  if (!v) throw new Error(`Unknown video key: ${key}`);
  if (portrait && v.muxPortrait) return muxPoster(v.muxPortrait, v.thumbTime);
  if (v.mux) return muxPoster(v.mux, v.thumbTime, v.ratio === '9:16' ? 900 : 1600);
  if (v.local) return `/media/${v.local}.jpg`;
  return undefined;
}

/** Data attributes the footage script reads to pick a source. */
export function sourceAttrs(key: string) {
  const v = videos[key];
  if (!v) throw new Error(`Unknown video key: ${key}`);
  return {
    'data-key': key,
    'data-mux': v.mux || undefined,
    'data-src': !v.mux && v.local ? `/media/${v.local}.mp4` : undefined,
    'data-mux-portrait': v.muxPortrait || undefined,
    'data-poster-portrait': v.muxPortrait ? poster(key, true) : undefined,
  };
}

/** Films with footage, for /work/. */
export const films = Object.entries(videos)
  .filter(([key, v]) => v.film && hasSource(key))
  .map(([key, v]) => ({ key, ...v }));

export const ratioClass = (r: Video['ratio']) => (r === '9:16' ? 'r916' : r === '1:1' ? 'r11' : 'r169');

/** Attributes for an element that swaps a background loop to this clip on hover. */
export function swapAttrs(key: string) {
  return { ...sourceAttrs(key), 'data-poster': poster(key) };
}
