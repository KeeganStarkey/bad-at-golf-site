// Business details used across the site. Edit here, not in the pages.
//
// TODO(keegan): anything marked TODO is a placeholder until you confirm it.

export const site = {
  name: 'Bad At Golf',
  legalName: 'Bad At Golf Company',
  // Used by the sitemap, robots.txt and every canonical link.
  url: 'https://www.badatgolf.co.uk',
  owner: 'Keegan Starkey',
  partner: 'Sam Fry',
  team: 'Keegan Starkey and Sam Fry',
  town: 'Milton Keynes',
  region: 'Buckinghamshire',
  country: 'GB',
  email: 'bad.at.golf.company@gmail.com',
  // International format without + or spaces, for wa.me links.
  // TODO(keegan): this is the Starkey Productions number. Swap it if Bad At Golf has its own.
  whatsapp: '447816516875',
  phoneDisplay: '07816 516875',
  replyTime: 'one working day',
};

export const whatsappLink = (text = "Hi Bad At Golf, I'd like to talk about some golf content.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject = 'Golf video enquiry') =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

// Only profiles with a URL are shown.
// TODO(keegan): add the Bad At Golf Instagram, YouTube and TikTok links.
export const socials: { name: string; url: string }[] = [
  { name: 'Instagram', url: '' },
  { name: 'YouTube', url: '' },
  { name: 'TikTok', url: '' },
];

// "Played with" row on the homepage. Hidden while empty.
// TODO(keegan): add clubs, coaches and brands you're happy to name.
export const clients: { name: string; logo?: string }[] = [];

// Homepage quote. Leave `text` empty to hide the section.
export const testimonial = { text: '', name: '', role: '' };

// Footer links to the sister brands. Shown as plain text until there's a URL.
export const sisterBrands = [
  { name: 'Starkey Productions', tag: 'Commercial video for businesses and events', url: 'https://www.keeganstarkey.com' },
  // TODO(keegan): add the Wedding Diaries web address.
  { name: 'Wedding Diaries', tag: 'Documentary-style wedding films', url: '' },
];

// The two people behind Bad At Golf. Shown on the about page and in the search-engine data.
// TODO(keegan): add Sam's photo (portrait, roughly 4:5) to /public/images/about/ and set `photo`.
// TODO(keegan): check both bios read right, Sam's especially.
export const team: { name: string; first: string; role: string; bio: string; photo?: string; photoAlt?: string }[] = [
  {
    name: 'Keegan Starkey', first: 'Keegan', role: 'Videographer and co-founder',
    bio: "Keegan also runs Starkey Productions, a video production company for businesses and events. His golf work includes The Longest Round, a documentary filmed for DAZN. Owns a lot of golf balls, briefly.",
    photo: '/images/about/keegan-2.jpg', photoAlt: 'Keegan Starkey holding a cinema camera on a shoot',
  },
  {
    name: 'Sam Fry', first: 'Sam', role: 'Videographer and co-founder',
    bio: "Sam is a videographer and Keegan's golf buddy, usually found on the second camera or looking for his ball in the trees on the left. Between them they've got every angle covered, except the fairway.",
  },
];

export const nav = [
  { label: 'Golf clubs', href: '/golf-clubs/', key: 'clubs' },
  { label: 'Coaches', href: '/golf-coaches/', key: 'coaches' },
  { label: 'Players & brands', href: '/players-and-brands/', key: 'players' },
  { label: 'Work', href: '/work/', key: 'work' },
  { label: 'About', href: '/about/', key: 'about' },
];

export const areas = ['Milton Keynes', 'Bedfordshire', 'Northamptonshire', 'Buckinghamshire', 'Hertfordshire', 'Oxfordshire', 'London'];
