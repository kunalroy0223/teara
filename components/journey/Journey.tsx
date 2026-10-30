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
  { h: 'We grew up with these tea gardens.', t: 'For anyone from the hills around Siliguri, Darjeeling tea is part of daily life. It is work for thousands of families and a name known around the world. We wanted to build something from here, using what is already here.' },
  { h: 'Not every leaf ends up in a cup.', t: 'Processing tea leaves a lot of leaf behind. Some of it goes to low-value uses and some is simply thrown away, even though it comes from the same carefully grown plants.' },
  { h: 'We are doing the slow part properly.', t: 'Right now we are comparing ways to extract useful material from the leaf, and learning how to keep that extract stable. We would rather take the time than rush a product out.', link: ['from-leaf', 'See the process'] },
  { h: 'A serum, still being made.', t: 'Our first product will be a facial serum built around an extract of Darjeeling tea leaves. It does not exist yet. You can follow along and tell us what you would want from it.', link: ['serum', 'About the serum'] },
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
  const [gl, setGl] = useState<boolean | null>(null);
  const [live, setLive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const shared = useRef<Shared>({ prog, ui, reduced: false });

  useEffect(() => {
    setGl(webglOK());
    const r = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(r);
    shared.current.reduced = r;
  }, []);

  useEffect(() => {
    if (!gl || !section.current) return;
    const trig = ScrollTrigger.create({
      trigger: section.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { prog.current = self.progress; },
    });
    prog.current = trig.progress;
    const io = new IntersectionObserver(([e]) => { setLive(e.isIntersecting); sound.engine(e.isIntersecting); }, { rootMargin: '10% 0px' });
    io.observe(section.current);
    return () => { trig.kill(); io.disconnect(); sound.engine(false); };
  }, [gl]);

  const goTo = (p: number) => {
    const el = section.current;
    if (!el) return;
    const y = el.offsetTop + p * (el.offsetHeight - innerHeight);
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(y, { duration: 2.6 }); else scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  };

  const set = (k: string) => (el: HTMLElement | null) => { ui.current[k] = el; };

  // Without WebGL, the same story reads as a plain page.
  if (gl === false) {
    return (
      <section className="journey-flat wrap" aria-label="The Teara journey, in four stations">
        <div className="hero"><Hero /></div>
        {COPY.map((c, i) => <Card key={i} i={i} c={c} />)}
        <p className="quote">Give the leftover leaf a <em>second life.</em></p>
      </section>
    );
  }

  return (
    <section className="journey" ref={section} aria-label="The Teara journey, in four stations">
      <div className="j-stage">
        {gl && (
          <Canvas className="j-canvas" shadows="soft" dpr={[1, 1.75]} frameloop={live ? 'always' : 'never'}
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
          <p className="j-quote quote" ref={set('quote')}>Give the leftover leaf a <em>second life.</em></p>
          <div className="j-outro" ref={set('outro')}>
            <p className="eyebrow">End of the line, for now</p>
            <p className="j-outro-t">Made <em>for you.</em></p>
            <p className="j-outro-s">From Darjeeling, from leaf that was left behind.</p>
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
      <p className="eyebrow">Darjeeling tea, a second life</p>
      <h1>Some leaves have more to give.</h1>
      <p className="lede">Teara takes tea leaf left over after processing in Darjeeling and turns it into skincare. We are a young company from Siliguri, and our first serum is in research now.</p>
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
