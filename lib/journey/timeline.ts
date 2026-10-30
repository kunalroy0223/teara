// How the Home journey unfolds over the scroll: where the train is, where the
// camera is, and which words are on screen. p runs from 0 (top) to 1 (end).

export const STATIONS = [
  { name: 'The Hills', u: 0.2 },
  { name: 'The Leftovers', u: 0.41 },
  { name: 'Research', u: 0.62 },
  { name: 'The Serum', u: 0.84 },
];

// [p, u] pairs: the train waits wherever two neighbours share the same u.
const MOVES: [number, number][] = [
  [0.0, 0.012], [0.075, 0.012],
  [0.18, STATIONS[0].u], [0.265, STATIONS[0].u],
  [0.355, STATIONS[1].u], [0.44, STATIONS[1].u],
  [0.555, STATIONS[2].u], [0.635, STATIONS[2].u],
  [0.725, STATIONS[3].u], [1.0, STATIONS[3].u],
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function trainU(p: number) {
  if (p <= MOVES[0][0]) return MOVES[0][1];
  for (let i = 0; i < MOVES.length - 1; i++) {
    const [p0, u0] = MOVES[i], [p1, u1] = MOVES[i + 1];
    if (p <= p1) return u0 + (u1 - u0) * ease((p - p0) / (p1 - p0));
  }
  return MOVES[MOVES.length - 1][1];
}

// Which station the train is standing at, or -1 while it moves.
export function stationAt(p: number) {
  const dwell: [number, number][] = [[0.18, 0.265], [0.355, 0.44], [0.555, 0.635], [0.725, 1.01]];
  return dwell.findIndex(([a, b]) => p >= a - 0.004 && p < b);
}

// Camera keys. "r" values are offsets from the engine in its own frame
// (right, up, forward); "w" values are offsets from where the line begins.
export type V = { s: 'r' | 'w'; v: [number, number, number] };
export type Key = { p: number; pos: V; look: V; fov?: number };
const r = (a: number, b: number, c: number): V => ({ s: 'r', v: [a, b, c] });
const w = (a: number, b: number, c: number): V => ({ s: 'w', v: [a, b, c] });

export const KEYS: Key[] = [
  // the hills before the train: looking out to the snows
  { p: 0.0, pos: w(10, 16, 26), look: w(30, 22, -160), fov: 38 },
  { p: 0.035, pos: w(10, 13, 22), look: w(22, 12, -120), fov: 38 },
  // the camera finds the train coming out of the mist
  { p: 0.085, pos: r(-6.5, 3.4, 8.5), look: r(0, 0.5, -1.2), fov: 34 },
  // following along behind
  { p: 0.13, pos: r(-4.6, 2.3, -8.5), look: r(0, 0.6, 2.5), fov: 36 },
  // Station 1, seen across the line with the platform beyond
  { p: 0.19, pos: r(8.5, 2.2, 0.5), look: r(0, 0.6, -4.3), fov: 34 },
  { p: 0.26, pos: r(7.8, 2.6, 1.6), look: r(0, 0.6, -4.1), fov: 32 },
  // down at the wheels as it pulls away
  { p: 0.305, pos: r(1.5, 0.35, 6.2), look: r(0, 0.55, 0), fov: 40 },
  // Station 2, from above, looking into the leaf wagons
  { p: 0.37, pos: r(4.6, 4.8, -2.4), look: r(0, 0.3, -5.2), fov: 34 },
  { p: 0.435, pos: r(5.0, 4.2, -1.2), look: r(0, 0.3, -5.0), fov: 32 },
  // high over the valley for the line between chapters
  { p: 0.5, pos: r(-12, 13, -18), look: r(0, 2, 26), fov: 42 },
  // Station 3, close on the leaves
  { p: 0.57, pos: r(2.6, 2.0, -0.4), look: r(0, 0.3, -3.9), fov: 30 },
  { p: 0.63, pos: r(2.2, 1.7, -0.9), look: r(0, 0.3, -3.7), fov: 28 },
  // running beside the train through the tea
  { p: 0.68, pos: r(4.4, 0.75, 0.8), look: r(0, 0.5, -1.2), fov: 38 },
  // Station 4, the first wagon, then around it as the bottle rises
  { p: 0.74, pos: r(3.8, 1.6, -1.0), look: r(0, 0.8, -4.3), fov: 32 },
  { p: 0.8, pos: r(3.4, 2.0, -3.4), look: r(0, 0.85, -4.2), fov: 30 },
  { p: 0.86, pos: r(2.2, 1.7, -5.8), look: r(0, 0.9, -3.0), fov: 30 },
  // and up, out over the hills to the snows
  { p: 0.93, pos: r(-3, 6, -12), look: r(0, 4, 24), fov: 38 },
  { p: 1.0, pos: r(-2, 20, -24), look: w(70, 60, -560), fov: 42 },
];

// Words on screen: [fade in start, fully in, start fading, gone].
export const SHOW = {
  hero: [-1, -1, 0.03, 0.065],
  cue: [-1, -1, 0.006, 0.02],
  st0: [0.17, 0.195, 0.255, 0.28],
  st1: [0.345, 0.37, 0.43, 0.455],
  quote: [0.465, 0.49, 0.525, 0.55],
  st2: [0.545, 0.57, 0.625, 0.65],
  st3: [0.735, 0.76, 0.86, 0.885],
  outro: [0.91, 0.94, 2, 2],
} as const;

export function opacityFor(win: readonly number[], p: number) {
  const [a, b, c, d] = win;
  if (p < a || p > d) return 0;
  if (p < b) return smooth(a, b, p);
  if (p > c) return 1 - smooth(c, d, p);
  return 1;
}

// The leaf cargo turns into the bottle over this stretch.
export const BOTTLE = [0.775, 0.85] as const;
