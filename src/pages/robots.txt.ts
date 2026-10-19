// robots.txt, built from the site address in src/data/site.ts so it never points at the wrong domain.
import { site } from '../data/site';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
