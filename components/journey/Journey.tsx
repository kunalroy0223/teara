'use client';
// Home: the scroll journey. A tall section holds a screen-sized stage that
// stays put while you scroll; the scroll drives the train and the camera.
import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import type { Shared } from './Scene';
import Go from '../Go';
import { Arrow } from '../Icons';
import { STATIONS } from '@/lib/journey/timeline';
import { sound } from '@/lib/sound';
import type { PageKey } from '@/lib/site';

// the 3D scene loads after the words, so the first screen appears at once
const Scene = dynamic(() => import('./Scene'), { ssr: false });


const COPY: { h: string; t: string; link?: [PageKey, string] }[] = [
  {
    h: 'Some places never leave you.',
    t: 'In the mist that settles over the gardens, in the first light touching the slopes, and in the hands that have tended them for generations. The hills carry stories of their own, woven into the lives and memories of those who call them home.',
  },
  {
    h: 'Not every story reaches the cup.',
    t: 'When the harvest has passed, much of the leaf is left behind. Some finds little purpose, some simply fades from sight. Yet it comes from the same carefully nurtured gardens, holding possibilities still waiting to be discovered.',
  },
  {
    h: 'The best things reveal themselves slowly.',
    t: 'Some discoveries ask for patience. We are exploring what these Darjeeling tea leaves hold, comparing extraction methods and studying how to preserve their useful compounds. There is no need to hurry what deserves to be understood.',
    link: ['from-leaf', 'Follow the process'],
  },
  {
    h: 'Something meaningful is taking shape.',
    t: 'A first expression is beginning to emerge: a facial serum built around Darjeeling tea leaf extracts. Still in research, its story is far from finished. Because what it becomes should be shaped by more than what nature offers.',
    link: ['serum', 'Discover the serum'],
  },
];

// scroll positions (0 to 1) where each station is centred, for the route map
const STOP_AT = [0.222, 0.397, 0.595, 0.79];

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

function Loader() {
  const { progress, active } = useProgress();
  const [gone, setGone] = useState(false);
  useEffect(() => { if (!active && progress >= 100) { const id = setTimeout(() => setGone(true), 400); return () => clearTimeout(id); } }, [active, progress]);
  return (
    <div className={`j-loader${!active && progress >= 100 ? ' done' : ''}`} hidden={gone} aria-hidden="true">
      <span className="j-loader-line" style={{ transform: `scaleX(${progress / 100})` }} />
      <span className="j-loader-t">Bringing the train up the hill</span>
    </div>
  );
}

export default function Journey() {
  const section = useRef<HTMLElement>(null);
  const prog = useRef(0);
  const ui = useRef<Record<string, HTMLElement | null>>({});
  const invalidate = useRef<(() => void) | null>(null);
  const active = useRef(true);
  const [gl, setGl] = useState<boolean | null>(null);
  const [live, setLive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const shared = useRef<Shared>({ prog, ui, reduced: false, invalidate, active });

  useEffect(() => {
    setGl(webglOK());
    const r = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(r);
    shared.current.reduced = r;
  }, []);

  useEffect(() => {
    if (!gl || !section.current) return;
    active.current = true;
    const trig = ScrollTrigger.create({
      trigger: section.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        prog.current = self.progress;
        if (active.current) invalidate.current?.();
      },
    });
    prog.current = trig.progress;
    const io = new IntersectionObserver(([e]) => {
      active.current = e.isIntersecting;
      setLive(e.isIntersecting);
      sound.engine(e.isIntersecting);
      if (e.isIntersecting) invalidate.current?.();
    }, { rootMargin: '10% 0px' });
    io.observe(section.current);
    return () => { trig.kill(); io.disconnect(); active.current = false; sound.engine(false); };
  }, [gl]);

  // Keep the ambient scene alive at a modest frame rate while it is visible.
  // During scrolling, ScrollTrigger invalidates the canvas on every Lenis tick.
  // This avoids rendering the full 3D world at 60+ FPS while the page is idle.
  useEffect(() => {
    if (!gl || !live) return;
    const id = window.setInterval(() => invalidate.current?.(), 1000 / 24);
    return () => window.clearInterval(id);
  }, [gl, live]);

  const goTo = (p: number) => {
    const el = section.current;
    if (!el) return;
    const y = el.offsetTop + p * (el.offsetHeight - innerHeight);
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(y, { duration: 3.0 }); else scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  };

  const set = (k: string) => (el: HTMLElement | null) => { ui.current[k] = el; };

  // Without WebGL, the same story reads as a plain page.
  if (gl === false) {
    return (
      <section className="journey-flat wrap" aria-label="The Teara journey, in four stations">
        <div className="hero"><Hero /></div>
        {COPY.map((c, i) => <Card key={i} i={i} c={c} />)}
        <p className="quote">Give the leftover leaf a<em>second life.</em></p>
      </section>
    );
  }

  return (
    <section className="journey" ref={section} aria-label="The Teara journey, in four stations">
      <div className="j-stage">
        {gl && (
          <Canvas className="j-canvas" shadows="soft" dpr={[1, 1.35]} frameloop="demand"
            gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.02 }}
            camera={{ fov: 38, near: 0.05, far: 2000, position: [0, 20, 40] }} aria-hidden="true">
            <Scene shared={shared.current} />
          </Canvas>
        )}
        <div className="j-shade" aria-hidden="true" />
        <div className="j-ui">
          <div className="j-hero" ref={set('hero')}><Hero /></div>
          {COPY.map((c, i) => (
            <div className={`j-card j-card-${i}`} key={i} ref={set(`st${i}`)}><Card i={i} c={c} /></div>
          ))}
          <p className="j-quote quote" ref={set('quote')}>The leaves had another <em>story to tell.</em></p>
          <div className="j-outro" ref={set('outro')}>
            <p className="eyebrow">Where every creation begins with understanding.</p>
            <p className="j-outro-t">Made <em>for you.</em></p>
            <p className="j-outro-s">From the heart of Darjeeling.</p>
          </div>
        </div>
        <nav className="j-map" ref={set('map') as (el: HTMLElement | null) => void} aria-label="Stations">
          <span className="j-map-line" aria-hidden="true"><span /></span>
          {STATIONS.map((s, i) => (
            <button type="button" key={s.name} data-i={i} onClick={() => goTo(STOP_AT[i])}>
              <span className="dot" aria-hidden="true" /><span className="lbl">{s.name}</span>
            </button>
          ))}
        </nav>
        <div className="j-cue" aria-hidden="true" ref={set('cue')}><span>Scroll to ride</span><i /></div>
        {gl && <Loader />}
      </div>
    </section>
  );
}


function Hero() {
  return (
    <div className="stack">
      <p className="eyebrow">Darjeeling · Beyond the familiar</p>
      <h1>The mountains have stories yet untold.</h1>
      <p className="lede">
        Every season, Darjeeling sends its tea into the world. Yet beyond the familiar journey from leaf to cup, another chapter waits in what remains. We began looking closer, curious about what the leaves might still hold.
      </p>
    </div>
  );
}


function Card({ i, c }: { i: number; c: (typeof COPY)[number] }) {
  return (
    <article className="panel stack-sm" aria-labelledby={`st-${i}`}>
      <p className="eyebrow">Station {i + 1} · {STATIONS[i].name}</p>
      <h2 id={`st-${i}`}>{c.h}</h2>
      <p>{c.t}</p>
      {c.link && <p><Go to={c.link[0]} className="btn ghost">{c.link[1]} <Arrow /></Go></p>}
    </article>
  );
}
