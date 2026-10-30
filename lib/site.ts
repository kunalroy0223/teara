// Pages, links and contact details shared by every page.

export const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === '1';

export type PageKey = 'home' | 'about' | 'from-leaf' | 'serum' | 'questions' | 'people';

export const PAGES: { key: PageKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About Us' },
  { key: 'from-leaf', label: 'From Leaf' },
  { key: 'serum', label: 'The Serum' },
  { key: 'questions', label: 'Questions' },
  { key: 'people', label: 'People' },
];

// The live site uses clean routes ("/about"). The offline preview is a
// folder of plain files, so it links to "about.html" instead.
export function href(key: PageKey, hash = '') {
  if (PREVIEW) return (key === 'home' ? 'index.html' : `${key}.html`) + hash;
  return (key === 'home' ? '/' : `/${key}`) + hash;
}

// Files in public/ are linked relative to the page, which works for both.
export function asset(path: string) {
  return PREVIEW ? path : `/${path}`;
}

export function keyFromPath(path: string): PageKey {
  const clean = path.replace(/\/$/, '').replace(/\.html$/, '').split('/').pop() || '';
  return (PAGES.find((p) => p.key === clean)?.key ?? 'home');
}

export const CONTACT = {
  email: 'contact@teara.in',
  phone: '+91 98834 25303',
  tel: '+919883425303',
};

export const SOCIAL = [
  { kind: 'mail', label: 'Email Teara', url: 'mailto:contact@teara.in' },
  { kind: 'instagram', label: 'Teara on Instagram', url: 'https://www.instagram.com/teara.india' },
  { kind: 'facebook', label: 'Teara on Facebook', url: 'https://www.facebook.com/people/Teara/61593785191489/' },
  { kind: 'linkedin', label: 'Teara on LinkedIn', url: 'https://www.linkedin.com/company/teara-darjeeling/' },
] as const;
