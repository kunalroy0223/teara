'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Mode = 'story' | 'leaf' | 'serum' | 'seal' | 'people';

// The 3D layer behind an inner page. With `stage`, the object sits in the
// right half of the screen and the page text keeps to the left.
export default function PageScene({ mode, stage = false }: { mode: Mode; stage?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);
  useEffect(() => {
    let stop: (() => void) | undefined;
    let dead = false;
    document.body.classList.toggle('has-stage', stage);
    document.body.dataset.scene = mode;
    import('@/lib/pageScene').then(({ mountScene }) => {
      if (!dead && canvas.current) stop = mountScene(canvas.current, mode);
    });
    return () => { dead = true; stop?.(); document.body.classList.remove('has-stage'); };
  }, [mode, stage, host]);
  // rendered straight into <body> so the page transition never moves it
  if (!host) return null;
  return createPortal(
    <>
      <canvas id="scene" ref={canvas} aria-hidden="true" />
      {stage && <div className="stage" id="stage" aria-hidden="true" />}
    </>,
    host,
  );
}
