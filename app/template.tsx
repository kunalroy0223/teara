'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Every page arrives the same way: a forest-green veil lifts off a page
// that is already rising into place.
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o: object) => void } }).lenis;
    if (!location.hash) lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <>
      <motion.div className="veil" aria-hidden="true"
        initial={{ scaleY: 1 }} animate={{ scaleY: 0 }}
        transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }} />
      <motion.main id="main" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}>
        {children}
      </motion.main>
    </>
  );
}
