'use client';
import { usePathname } from 'next/navigation';
import Go from './Go';
import { IconLink } from './Icons';
import { CONTACT, PAGES, SOCIAL, asset, keyFromPath } from '@/lib/site';

export default function Footer() {
  const current = keyFromPath(usePathname() || '/');
  const i = PAGES.findIndex((p) => p.key === current);
  const next = PAGES[(i + 1) % PAGES.length];
  return (
    <footer className="site-foot">
      <div className="wrap">

        <div className="foot-row">
          <img src={asset('brand/lockup-sage.svg')} alt="teara, Made For You" width={220} height={89} />
          <div className="foot-contact">
            <p><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br /><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></p>
            <div className="icons">{SOCIAL.map((s) => <IconLink key={s.kind} {...s} />)}</div>
          </div>
        </div>
        <p className="fine credit">
          Train model: &ldquo;<a href="https://sketchfab.com/3d-models/darjeeling-class-b-locomotives-fbaec6d99aa74878983ba1761c285934" target="_blank" rel="noopener">Darjeeling Class B locomotives</a>&rdquo; by <a href="https://sketchfab.com/smsouvikmondal425" target="_blank" rel="noopener">drelephantes</a>, <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>, simplified for the web. Sounds are generated in your browser.
        </p>
      </div>
    </footer>
  );
}
