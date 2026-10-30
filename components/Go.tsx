'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { href, PREVIEW, type PageKey } from '@/lib/site';

// An internal link. On the live site it navigates without a reload, so the
// page transition plays and the sound keeps going.
export default function Go({ to, hash, className, children, current }: {
  to: PageKey; hash?: string; className?: string; children: ReactNode; current?: boolean;
}) {
  const props = { className, 'aria-current': current ? ('page' as const) : undefined };
  if (PREVIEW) return <a href={href(to, hash)} {...props}>{children}</a>;
  return <Link href={href(to, hash)} {...props}>{children}</Link>;
}
