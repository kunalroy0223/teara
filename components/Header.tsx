'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Go from './Go';
import SoundToggle from './SoundToggle';
import { PAGES, asset, keyFromPath } from '@/lib/site';

export default function Header() {
  const current = keyFromPath(usePathname() || '/');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); }, [current]);
  useEffect(() => { document.body.classList.toggle('menu-open', open); }, [open]);

  return (
    <header className={`site-head${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap">
        <Go to="home" className="brand"><img src={asset('brand/wordmark-forest.svg')} alt="teara, home" width={104} height={35} /></Go>
        <div className="head-right">
          <SoundToggle />
          <button className="menu-btn" type="button" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
        <nav className="nav" id="nav" aria-label="Main">
          {PAGES.map((p, i) => (
            <Go key={p.key} to={p.key} current={p.key === current}>
              <span className="nav-n" aria-hidden="true">0{i + 1}</span>{p.label}
            </Go>
          ))}
        </nav>
      </div>
    </header>
  );
}
