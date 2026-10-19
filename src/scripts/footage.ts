// Footage: lazy-loaded muted loops. Sources come from Mux (HLS) when a playback ID is set,
// otherwise from a stand-in MP4 in /media. A loop loads when it nears the screen and only
// plays while it's actually on screen. Nothing autoplays for people who prefer reduced motion.

type Footage = {
  v: HTMLVideoElement;
  near: boolean;
  onScreen: boolean;
  loaded: boolean;
  hls?: { destroy(): void };
};

declare global {
  interface Window {
    __hold?: boolean;
    BAG?: { footage: Map<HTMLVideoElement, Footage>; swap: (v: HTMLVideoElement, from: HTMLElement) => void; attach: typeof attach };
  }
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const portrait = innerWidth <= 760 && innerHeight > innerWidth;
let hlsMod: Promise<any> | null = null;
const getHls = () => (hlsMod ||= import('hls.js/light').then((m) => m.default));

export function attach(v: HTMLVideoElement, mux: string | undefined, src: string | undefined, opts: { full?: boolean } = {}) {
  return new Promise<{ destroy(): void } | undefined>((resolve) => {
    if (mux) {
      const url = `https://stream.mux.com/${mux}.m3u8`;
      // Check Hls.isSupported() BEFORE canPlayType(). Some Chromium builds claim (falsely)
      // to play application/vnd.apple.mpegurl, which sets a raw .m3u8 as the src and fails
      // with "no supported sources". hls.js first, native HLS (Safari/iOS) as the fallback.
      getHls().then((Hls) => {
        if (Hls.isSupported()) {
          const h = new Hls(opts.full
            ? { capLevelToPlayerSize: true }
            : { capLevelToPlayerSize: true, maxBufferLength: 10, maxMaxBufferLength: 20 });
          h.loadSource(url);
          h.attachMedia(v);
          resolve(h);
        } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
          v.src = url; resolve(undefined);
        } else {
          resolve(undefined);
        }
      });
    } else if (src) {
      v.src = src;
      resolve(undefined);
    } else resolve(undefined);
  });
}

const F = new Map<HTMLVideoElement, Footage>();

function load(f: Footage) {
  if (f.loaded) return;
  const d = f.v.dataset;
  const mux = (portrait && d.muxPortrait) || d.mux;
  const src = d.src;
  if (!mux && !src) return; // empty slot, waiting for footage
  f.loaded = true;
  if (portrait && d.posterPortrait) f.v.poster = d.posterPortrait;
  f.v.muted = true;
  f.v.preload = 'auto';
  attach(f.v, mux, src).then((h) => { f.hls = h; sync(f); });
}

function sync(f: Footage) {
  const want = f.loaded && f.onScreen && !reduce && !window.__hold && !f.v.closest('[hidden]');
  if (want && f.v.paused) { const p = f.v.play(); if (p && p.catch) p.catch(() => {}); }
  else if (!want && !f.v.paused) f.v.pause();
}

function swap(v: HTMLVideoElement, from: HTMLElement) {
  const f = F.get(v);
  if (!f) return;
  const d = from.dataset;
  if (v.dataset.key === d.key || (!d.mux && !d.src)) return;
  f.hls?.destroy(); f.hls = undefined;
  v.dataset.key = d.key || '';
  v.dataset.mux = d.mux || '';
  v.dataset.src = d.src || '';
  if (d.poster) v.poster = d.poster;
  f.loaded = false;
  load(f);
}

document.querySelectorAll<HTMLVideoElement>('video.footage').forEach((v) => {
  F.set(v, { v, near: false, onScreen: false, loaded: false });
  // Match the frame to the clip's real shape, in case it was filed under the wrong ratio.
  const frame = v.closest<HTMLElement>('.clip-v');
  if (frame) v.addEventListener('loadedmetadata', () => {
    if (!v.videoWidth || !v.videoHeight) return;
    const tall = v.videoHeight > v.videoWidth;
    if (tall === frame.classList.contains('r916')) return;
    frame.classList.toggle('r916', tall);
    frame.classList.toggle('r169', !tall);
    frame.closest<HTMLElement>('.clip')?.classList.toggle('is-tall', tall);
  });
});

// Load a little before it scrolls in; play only while at least a third of it is showing.
const nearIO = new IntersectionObserver((es) => es.forEach((e) => {
  const f = F.get(e.target as HTMLVideoElement);
  if (f) { f.near = e.isIntersecting; if (f.near) load(f); }
}), { rootMargin: '400px 0px' });
const seenIO = new IntersectionObserver((es) => es.forEach((e) => {
  const f = F.get(e.target as HTMLVideoElement);
  if (f) { f.onScreen = e.isIntersecting; sync(f); }
}), { threshold: 0.33 });
F.forEach((_, v) => { nearIO.observe(v); seenIO.observe(v); });

document.addEventListener('visibilitychange', () => {
  F.forEach((f) => (document.hidden ? f.v.pause() : sync(f)));
});

window.BAG = { footage: F, swap, attach };
export const resync = () => F.forEach(sync);
