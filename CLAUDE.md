# Bad At Golf website

Site for Bad At Golf (Bad At Golf Company), the golf video brand run by Keegan Starkey and Sam Fry, and the sister brand of Starkey Productions. Astro (static output), hosted on Netlify, video on Mux. Built on the same framework as keeganstarkey.com (repo KeeganStarkey/starkey-site) with its own look and voice.

## Commands
- `npm run dev` · local dev server
- `npm run build` · builds to `dist/` (Netlify runs this on every push to `main`)

## Where things live
- `src/data/site.ts` · domain, contact details, socials, clients, testimonial, sister brands, nav. Edit here, never in pages. Lines marked `TODO(keegan)` are placeholders.
- `src/data/videos.ts` · every clip by key. Set `mux` to a Mux playback ID to fill a slot. A clip with no `mux` (or `local`) shows an empty fairway-striped frame. `film: true` puts it on /work/ (only once it has footage) and makes it open in the player.
- `src/pages/` · one file per page: home, golf-clubs, golf-coaches, players-and-brands, work, about, contact, privacy, thanks, 404. `robots.txt.ts` builds robots.txt from the domain in site.ts.
- `src/components/` · Clip (framed clip), Footage (background loop), PageHero, Scorecard, Holes (process steps), Enquiry + Direct (form and WhatsApp/email card), Faq, Related, Header, Footer, Lightbox.
- `src/styles/` · `base.css` shared, `home.css` homepage only, `inner.css` every other page.
- `src/scripts/` · `footage.ts` (lazy Mux/HLS loops, frame shape check), `chrome.ts` (header, menu, mobile bar, footer wordmark, hover swap, form), `lightbox.ts` (film player), `filter.ts` (work filters).
- `src/lib/schema.ts` · JSON-LD (business, website, services, FAQ, breadcrumbs, videos).
- `netlify.toml` · redirects, security headers (CSP), caching.

## Design
- Scorecard and leaderboard: pine green `#0F3326`, scorecard paper `#EEF0E4`, flag yellow `#F6CB2F`, pencil red `#B83A24` only for bad scores and leaderboard positions.
- Big Shoulders Display (uppercase headlines), Instrument Sans (everything else), Caveat only for pencilled scores on the scorecard.
- Not the Starkey "Noir" camera-frame styling. No mono labels, no tracked caps labels.
- The scorecard (Keegan and Sam's front nine) is the one running joke. Keep it to the homepage and about page.

## Rules
- Write "Bad At Golf" in copy. The voice is "we": Keegan Starkey and Sam Fry, two videographers and golf mates. Never write it as a one-man business.
- Playful, sounds like a real person. No colons in headlines or quotes.
- No prices anywhere. Pricing questions are answered without numbers.
- No specific turnaround times or video lengths.
- Posting/scheduling is its own service, never "included free".
- Contact is form, WhatsApp and email only. No call booking.
- Footer links back to Starkey Productions (keeganstarkey.com) and Wedding Diaries.
- One H1 per page containing its main search phrase.
- `footage.ts`: check `Hls.isSupported()` BEFORE `canPlayType`, or Chrome fails with "no supported sources". Keep the loadedmetadata check that fixes a frame's shape to the real video.
- The inline script in `Header.astro` is allowed by a sha256 hash in the CSP (`netlify.toml`). If you change it, update the hash.
- The enquiry form is Netlify Forms (`enquiry`). Keep `data-netlify`, the hidden `form-name` and the honeypot.
- Respect `prefers-reduced-motion`: loops don't autoplay for those visitors.
- Test before pushing: build, check desktop and phone widths, run axe.
