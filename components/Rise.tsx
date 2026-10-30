'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Content that eases up into place the first time it scrolls into view.
export default function Rise({ children, className, delay = 0, as = 'div' }: {
  children: ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'ol' | 'ul' | 'dl';
}) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </M>
  );
}
