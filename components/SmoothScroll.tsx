'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// One Lenis instance drives scrolling, on GSAP's clock, so ScrollTrigger
// and the 3D scenes all read the same smoothed position.
export default function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // in-page anchors scroll smoothly too
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const id = a?.getAttribute('href');
      if (!a || !id || !id.startsWith('#') || id.length < 2) return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -90 }); }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);
  return null;
}
