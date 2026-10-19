// JSON-LD for search engines. Every page gets the business and website; pages add their own.
import { site, socials, sisterBrands, team } from '../data/site';
import { videos, poster } from '../data/videos';

const abs = (p: string) => (p.startsWith('http') ? p : site.url + p);
const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();

export const areaServed = [
  { '@type': 'City', name: 'Milton Keynes' },
  ...['Buckinghamshire', 'Bedfordshire', 'Northamptonshire', 'Hertfordshire', 'Oxfordshire'].map((name) => ({ '@type': 'AdministrativeArea', name })),
  { '@type': 'Country', name: 'United Kingdom' },
];

export const business = {
  '@type': 'ProfessionalService',
  '@id': site.url + '/#business',
  name: site.name,
  legalName: site.legalName,
  url: site.url + '/',
  image: site.url + '/og.png',
  logo: site.url + '/icon-512.png',
  description: 'Golf video production for golf clubs and courses, golf coaches, players and golf brands: course flyovers, club promos, coaching content, sponsorship reels and monthly social media content.',
  email: site.email,
  telephone: '+' + site.whatsapp,
  founder: team.map((t) => ({ '@type': 'Person', name: t.name, jobTitle: 'Videographer' })),
  address: { '@type': 'PostalAddress', addressLocality: site.town, addressRegion: site.region, addressCountry: site.country },
  areaServed,
  knowsAbout: ['Golf video production', 'Golf course flyovers', 'Golf coaching videos', 'Golf social media content'],
  sameAs: socials.filter((s) => s.url).map((s) => s.url),
};

export const website = {
  '@type': 'WebSite',
  '@id': site.url + '/#website',
  url: site.url + '/',
  name: site.name,
  publisher: { '@id': site.url + '/#business' },
};

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path),
    })),
  };
}

export function faq(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
  };
}

export function service(o: { name: string; serviceType: string; description: string; path: string; audience?: string; offers?: string[] }) {
  return {
    '@type': 'Service',
    name: o.name,
    serviceType: o.serviceType,
    description: o.description,
    url: abs(o.path),
    provider: { '@id': site.url + '/#business' },
    areaServed,
    ...(o.audience ? { audience: { '@type': 'Audience', audienceType: o.audience } } : {}),
    ...(o.offers ? {
      hasOfferCatalog: { '@type': 'OfferCatalog', name: o.name, itemListElement: o.offers.map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })) },
    } : {}),
  };
}

/** VideoObject for films hosted on Mux. Clips without a Mux ID are skipped. */
export function videoObjects(keys: string[]) {
  const seen = new Set<string>();
  return keys.flatMap((k) => {
    const v = videos[k];
    if (!v?.mux || seen.has(v.mux)) return [];
    seen.add(v.mux);
    return [{
      '@type': 'VideoObject',
      name: v.title,
      description: v.description || `${v.title}, ${v.sub}`,
      thumbnailUrl: poster(k),
      uploadDate: v.uploadDate || '2026-10-19',
      contentUrl: `https://stream.mux.com/${v.mux}.m3u8`,
      ...(v.duration ? { duration: 'PT' + v.duration.replace(':', 'M') + 'S' } : {}),
      publisher: { '@id': site.url + '/#business' },
    }];
  });
}
