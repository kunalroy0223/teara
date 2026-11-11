
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Go from './Go';
import SoundToggle from './SoundToggle';
import { PAGES, asset, keyFromPath } from '@/lib/site';

type WindowWithLenis = Window & {
  lenis?: {
    stop: () => void;
    start: () => void;
  };
};

export default function Header() {
  const pathname = usePathname() || '/';
  const current = keyFromPath(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Track page scroll position.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Close menu when navigating to another page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scrolling while menu is open.
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const lenis = (window as WindowWithLenis).lenis;

    html.classList.add('menu-open');
    body.classList.add('menu-open');

    lenis?.stop();

    // Close menu using Escape.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      html.classList.remove('menu-open');
      body.classList.remove('menu-open');

      window.removeEventListener('keydown', onKeyDown);

      // Resume scrolling without resetting page position.
      lenis?.start();
    };
  }, [open]);

  return (
    <header className={`site-head${scrolled ? ' scrolled' : ''}`}>

      <div className="wrap">

        <Go to="home" className="brand">
          <img
            src={asset('brand/wordmark-forest.svg')}
            alt="teara, home"
            width={104}
            height={35}
          />
        </Go>

        <div className="head-right">

          <SoundToggle />


          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="nav"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>


        </div>

        <nav
          className="nav"
          id="nav"
          aria-label="Main navigation"
          onClick={(event) => {
            const target = event.target;

            if (
              target instanceof Element &&
              target.closest('a')
            ) {
              setOpen(false);
            }
          }}
        >

          {PAGES.map((page, index) => (
            <Go
              key={page.key}
              to={page.key}
              current={page.key === current}
            >
              <span className="nav-n" aria-hidden="true">
                0{index + 1}
              </span>

              {page.label}
            </Go>
          ))}

        </nav>

      </div>

    </header>
  );
}
