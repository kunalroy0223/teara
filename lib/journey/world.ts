// The Home page world: a narrow-gauge line climbing through Darjeeling tea
// hills, with snow peaks behind. Everything is generated here from code, so
// there are no image or terrain files to download, only the train model.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const C = {
  sage: new THREE.Color('#C9D1B5'),
  sageLight: new THREE.Color('#EEF2DF'),
  horizon: new THREE.Color('#E4E9D3'),
  zenith: new THREE.Color('#AEBF9F'),
  forest: new THREE.Color('#1B3022'),
  deep: new THREE.Color('#1B5638'),
  paper: new THREE.Color('#F3F2EA'),
};

// ---------------------------------------------------------------- noise
function hash(x: number, y: number) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x: number, y: number, oct = 5) {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { s += vnoise(x * f, y * f) * amp; norm += amp; amp *= 0.5; f *= 2.03; }
  return s / norm;
}
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------------------------------------------------------------- the line
// Control points for the track, climbing from the valley (south) towards the
// high ground in the north, the way the hill railway zig-zags up to Darjeeling.
const CTRL: [number, number, number][] = [
  [-52, -1, 46], [-38, -0.6, 34], [-22, 0, 28], [-8, 0.8, 20], [2, 1.5, 8], [2, 2.2, -6],
  [-8, 2.9, -16], [-22, 3.5, -22], [-30, 4.2, -36], [-22, 4.9, -50], [-4, 5.5, -56],
  [14, 6.1, -50], [22, 6.7, -36], [34, 7.3, -26], [50, 7.9, -30], [58, 8.5, -46],
  [52, 9.1, -62], [36, 9.5, -72], [18, 9.8, -76],
];
export const track = new THREE.CatmullRomCurve3(CTRL.map((v) => new THREE.Vector3(...v)), false, 'centripetal');
export const TRACK_LEN = track.getLength();

// Dense samples of the line, used to shape the ground around it.
const NS = 520;
const SX = new Float32Array(NS + 1), SY = new Float32Array(NS + 1), SZ = new Float32Array(NS + 1);
for (let i = 0; i <= NS; i++) { const p = track.getPointAt(i / NS); SX[i] = p.x; SY[i] = p.y; SZ[i] = p.z; }

export function nearestTrack(x: number, z: number) {
  let best = Infinity, bi = 0;
  for (let i = 0; i <= NS; i += 4) { const dx = SX[i] - x, dz = SZ[i] - z, d = dx * dx + dz * dz; if (d < best) { best = d; bi = i; } }
  const lo = Math.max(0, bi - 4), hi = Math.min(NS, bi + 4);
  for (let i = lo; i <= hi; i++) { const dx = SX[i] - x, dz = SZ[i] - z, d = dx * dx + dz * dz; if (d < best) { best = d; bi = i; } }
  return { d: Math.sqrt(best), y: SY[bi], u: bi / NS };
}

// Ground height. Near the line the hill is cut into a level shelf; further
// out it rises and falls into ridges and valleys.
export function groundHeight(x: number, z: number) {
  const n = nearestTrack(x, z);
  const big = fbm(x * 0.016 + 3.1, z * 0.016 - 1.7);
  const small = fbm(x * 0.07 + 11, z * 0.07 + 5, 3);
  const north = Math.max(0, -z - 50) * 0.22;           // the land keeps climbing to the north
  const natural = n.y + (big - 0.45) * 38 + (small - 0.5) * 3.5 + north;
  const k = smooth(1.5, 12, n.d);
  return n.y - 0.1 + (natural - (n.y - 0.1)) * k;
}

// ---------------------------------------------------------------- frames along the line
const UP = new THREE.Vector3(0, 1, 0);
export type Frame = { pos: THREE.Vector3; fwd: THREE.Vector3; right: THREE.Vector3; up: THREE.Vector3 };
export function frameAt(u: number, out?: Frame): Frame {
  const f = out ?? { pos: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3() };
  const uu = Math.min(1, Math.max(0, u));
  track.getPointAt(uu, f.pos);
  track.getTangentAt(uu, f.fwd).normalize();
  f.right.crossVectors(f.fwd, UP).normalize();
  f.up.crossVectors(f.right, f.fwd).normalize();
  return f;
}
// world point from (right, up, forward) offsets in a frame
export function toWorld(f: Frame, r: number, u: number, fw: number, out = new THREE.Vector3()) {
  return out.copy(f.pos).addScaledVector(f.right, r).addScaledVector(UP, u).addScaledVector(f.fwd, fw);
}

// ---------------------------------------------------------------- sky
export function makeSky() {
  const geo = new THREE.SphereGeometry(900, 32, 16);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: {
      top: { value: C.zenith.clone() }, horizon: { value: C.horizon.clone() },
      sun: { value: new THREE.Vector3(-0.45, 0.28, -0.85).normalize() },
    },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 sun; varying vec3 vDir;
      void main(){
        float h = clamp(vDir.y, 0.0, 1.0);
        vec3 c = mix(horizon, top, pow(h, 0.5));
        float s = max(dot(normalize(vDir), sun), 0.0);
        c += vec3(1.0, 0.94, 0.80) * (pow(s, 18.0) * 0.32 + pow(s, 3.0) * 0.06);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = -10;
  return m;
}

// ---------------------------------------------------------------- distant ranges
// Rings of mountains around the world, drawn flat and pale like layers of
// haze. The far ring carries snow, highest to the north like Kangchenjunga.
function ring(radius: number, height: (a: number) => number, low: THREE.Color, high: THREE.Color, snow: number | null, seed: number) {
  const seg = 720, rows = 14;
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const cx = 2, cz = -14;
  const c = new THREE.Color();
  const snowC = new THREE.Color('#F7F8F1'), shadowC = new THREE.Color('#C9D3D3');
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const H = height(a);
    const rr = radius + (fbm(i * 0.05 + seed, seed) - 0.5) * radius * 0.08;
    for (let j = 0; j <= rows; j++) {
      const v = j / rows;
      const y = -30 + (H + 30) * Math.pow(v, 0.85);
      pos.push(cx + Math.cos(a) * rr, y, cz + Math.sin(a) * rr);
      c.copy(low).lerp(high, v);
      if (snow !== null && y > snow) {
        const streak = fbm(a * 60 + seed, y * 0.06 + seed) * 0.7 + fbm(a * 240, y * 0.2) * 0.3;
        c.copy(streak > 0.55 ? shadowC : snowC).lerp(high, 0.12);
      }
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rows; j++) {
    const a = i * (rows + 1) + j, b = a + rows + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide, toneMapped: false }));
  m.renderOrder = -5;
  return m;
}

export function makeRanges() {
  const group = new THREE.Group();
  const north = -Math.PI / 2;
  const gap = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
  const ridged = (a: number, f: number, s: number) => 1 - Math.abs(fbm(a * f + s, s * 0.3, 4) * 2 - 1);
  group.add(ring(520, (a) => {
    const g = gap(a, north + 0.12);
    const massif = Math.exp(-(g * g) / 0.04) * 95 + Math.exp(-((gap(a, north - 0.35)) ** 2) / 0.02) * 45;
    return 55 + ridged(a, 9, 2) * 70 + massif;
  }, new THREE.Color('#BFCBC6'), new THREE.Color('#DCE3DD'), 95, 4));
  group.add(ring(330, (a) => 30 + ridged(a, 14, 7) * 34, new THREE.Color('#A8B8A2'), new THREE.Color('#BCC8B4'), null, 9));
  group.add(ring(230, (a) => 14 + ridged(a, 22, 13) * 22, new THREE.Color('#8FA48C'), new THREE.Color('#A7B89F'), null, 15));
  return group;
}

// ---------------------------------------------------------------- terrain
export function makeTerrain(mobile: boolean) {
  const W = 260, D = 240, cx = 0, cz = -20;
  const seg = mobile ? 150 : 230;
  const g = new THREE.PlaneGeometry(W, D, seg, seg);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  const tea = new THREE.Color('#5F8150'), teaDark = new THREE.Color('#3F6141'), earth = new THREE.Color('#7E7A5C'),
    ballast = new THREE.Color('#8A8270'), high = new THREE.Color('#355238'), meadow = new THREE.Color('#8FA06B');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + cx, z = p.getZ(i) + cz;
    const h = groundHeight(x, z);
    p.setXYZ(i, x, h, z);
  }
  g.computeVertexNormals();
  const nrm = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), y = p.getY(i);
    const n = nearestTrack(x, z);
    const slope = 1 - nrm.getY(i);
    const v = fbm(x * 0.12, z * 0.12, 3);
    c.copy(meadow).lerp(tea, smooth(0.3, 0.6, v));
    c.lerp(teaDark, smooth(0.5, 0.8, fbm(x * 0.03 + 7, z * 0.03)));
    c.lerp(high, smooth(n.y + 6, n.y + 22, y));
    c.lerp(earth, smooth(0.18, 0.45, slope));
    c.lerp(ballast, 1 - smooth(0.9, 2.2, n.d));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
  m.receiveShadow = true;
  return m;
}

// Tea bushes in rows that follow the contours, as on the estates.
export function makeTea(mobile: boolean) {
  const r = rng(11);
  const spacing = mobile ? 0.46 : 0.34;
  const pts: number[] = [];
  const maxN = mobile ? 22000 : 60000;
  for (let x = -110; x < 110 && pts.length / 4 < maxN; x += spacing) {
    for (let z = -130; z < 90 && pts.length / 4 < maxN; z += spacing) {
      const jx = x + (r() - 0.5) * spacing * 0.5, jz = z + (r() - 0.5) * spacing * 0.5;
      const n = nearestTrack(jx, jz);
      if (n.d < 2.2 || n.d > 24) continue;
      const h = groundHeight(jx, jz);
      const hx = groundHeight(jx + 0.6, jz), hz = groundHeight(jx, jz + 0.6);
      const slope = Math.hypot(hx - h, hz - h) / 0.6;
      if (slope > 1.1) continue;
      // keep bands along the contour: these are the terrace rows
      const band = ((h * 2.6) % 1 + 1) % 1;
      if (band > 0.62) continue;
      if (fbm(jx * 0.05 + 40, jz * 0.05) < 0.26) continue; // clearings
      pts.push(jx, h, jz, r());
    }
  }
  const count = pts.length / 4;
  const geo = new THREE.IcosahedronGeometry(0.17, 0);
  geo.scale(1.15, 0.6, 1);
  geo.translate(0, 0.05, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3(), e = new THREE.Euler();
  const tones = ['#4F7A45', '#5E8A4E', '#46703F', '#6C9358', '#3D6439'].map((x) => new THREE.Color(x));
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const k = pts[i * 4 + 3];
    v.set(pts[i * 4], pts[i * 4 + 1], pts[i * 4 + 2]);
    e.set(0, k * 6.28, 0); q.setFromEuler(e);
    const sc = 0.8 + k * 0.55;
    s.set(sc * (1 + (k - 0.5) * 0.3), sc, sc);
    m4.compose(v, q, s);
    mesh.setMatrixAt(i, m4);
    c.copy(tones[Math.floor(k * 997) % tones.length]).offsetHSL(0, 0, (k - 0.5) * 0.06);
    mesh.setColorAt(i, c);
  }
  mesh.receiveShadow = true;
  return mesh;
}

// Tall cryptomeria on the ridges and a few shade trees over the tea.
export function makeTrees(mobile: boolean) {
  const r = rng(5);
  const group = new THREE.Group();
  const cone = mergeGeometries([
    new THREE.CylinderGeometry(0.06, 0.09, 1.2, 5).translate(0, 0.6, 0),
    new THREE.ConeGeometry(0.75, 2.4, 7).translate(0, 1.9, 0),
    new THREE.ConeGeometry(0.55, 1.8, 7).translate(0, 2.9, 0),
  ].map((g) => (g.index ? g.toNonIndexed() : g)));
  const shade = mergeGeometries([
    new THREE.CylinderGeometry(0.035, 0.06, 2.0, 5).translate(0, 1.0, 0),
    new THREE.IcosahedronGeometry(0.8, 1).scale(1.4, 0.35, 1.2).translate(0.15, 2.05, 0),
    new THREE.IcosahedronGeometry(0.55, 1).scale(1.3, 0.35, 1.2).translate(-0.45, 1.85, 0.2),
  ].map((g) => (g.index ? g.toNonIndexed() : g)));
  const place = (geo: THREE.BufferGeometry, n: number, color: string, test: (d: number, h: number, ty: number) => boolean, scale: [number, number]) => {
    const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.95, flatShading: true }), n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3();
    let k = 0, tries = 0;
    while (k < n && tries < n * 40) {
      tries++;
      const x = -120 + r() * 240, z = -135 + r() * 220;
      const nt = nearestTrack(x, z);
      if (nt.d < 5) continue;
      if (Math.hypot(x + 42, z - 72) < 30) continue; // clear view for the opening shot
      const h = groundHeight(x, z);
      if (!test(nt.d, h, nt.y)) continue;
      const sc = scale[0] + r() * (scale[1] - scale[0]);
      v.set(x, h - 0.1, z); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6.28); s.set(sc, sc * (0.9 + r() * 0.3), sc);
      m4.compose(v, q, s); mesh.setMatrixAt(k++, m4);
    }
    mesh.count = k;
    mesh.castShadow = false;
    group.add(mesh);
  };
  place(cone, mobile ? 700 : 1500, '#2A4732', (d, h, ty) => h > ty + 5 || d > 30, [0.55, 1.25]);
  place(shade, mobile ? 70 : 140, '#5A7A4D', (d, h, ty) => d > 3 && d < 26 && h < ty + 8, [0.5, 0.75]);
  return group;
}

// Soft mist banks that sit in the valleys.
export function makeMist(texture: THREE.Texture, mobile: boolean) {
  const r = rng(21);
  const group = new THREE.Group();
  const n = mobile ? 26 : 44;
  for (let i = 0; i < n; i++) {
    const u = r();
    const p = track.getPointAt(u);
    const side = new THREE.Vector3((r() - 0.5) * 2, 0, (r() - 0.5) * 2).normalize().multiplyScalar(10 + r() * 50);
    const mat = new THREE.SpriteMaterial({ map: texture, color: '#F5F6EC', transparent: true, opacity: 0.32 + r() * 0.25, depthWrite: false, fog: true });
    const s = new THREE.Sprite(mat);
    s.position.set(p.x + side.x, p.y - 7 + r() * 6, p.z + side.z);
    const sc = 28 + r() * 40;
    s.scale.set(sc, sc * 0.38, 1);
    s.userData.drift = (r() - 0.5) * 0.6;
    group.add(s);
  }
  // a bank of mist where the line begins, so the train comes out of it
  const start = track.getPointAt(0.0);
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: '#F5F6EC', transparent: true, opacity: 0.55, depthWrite: false }));
    s.position.set(start.x - 4 + r() * 10, start.y + 0.5 + r() * 2, start.z + r() * 6);
    s.scale.set(16, 6, 1);
    s.userData.drift = 0.2;
    group.add(s);
  }
  return group;
}

// ---------------------------------------------------------------- rails
export const GAUGE = 0.3;
export function makeRails() {
  const group = new THREE.Group();
  const N = 1400;
  const left: THREE.Vector3[] = [], right: THREE.Vector3[] = [];
  const f = frameAt(0);
  for (let i = 0; i <= N; i++) {
    frameAt(i / N, f);
    left.push(toWorld(f, -GAUGE / 2, 0.035, 0));
    right.push(toWorld(f, GAUGE / 2, 0.035, 0));
  }
  const steel = new THREE.MeshStandardMaterial({ color: '#6F6A62', metalness: 0.85, roughness: 0.35 });
  [left, right].forEach((pts) => {
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 2, 0.018, 5, false);
    const m = new THREE.Mesh(tube, steel);
    m.castShadow = true;
    group.add(m);
  });
  // wooden sleepers
  const step = 0.2;
  const count = Math.floor(TRACK_LEN / step);
  const geo = new THREE.BoxGeometry(0.56, 0.04, 0.09);
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: '#4A3C2E', roughness: 1 }), count);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3();
  const look = new THREE.Matrix4(), back = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    frameAt(i / count, f);
    v.copy(f.pos);
    look.makeBasis(f.right, f.up, back.copy(f.fwd).negate());
    q.setFromRotationMatrix(look);
    m4.compose(v, q, s);
    mesh.setMatrixAt(i, m4);
  }
  mesh.receiveShadow = true;
  group.add(mesh);
  // ballast bed
  const bed: number[] = [], idx: number[] = [];
  const BN = 900;
  for (let i = 0; i <= BN; i++) {
    frameAt(i / BN, f);
    const a = toWorld(f, -0.42, -0.05, 0), b = toWorld(f, -0.3, -0.005, 0), c = toWorld(f, 0.3, -0.005, 0), d = toWorld(f, 0.42, -0.05, 0);
    bed.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, d.x, d.y, d.z);
    if (i < BN) { const o = i * 4; for (let k = 0; k < 3; k++) idx.push(o + k, o + k + 4, o + k + 1, o + k + 4, o + k + 5, o + k + 1); }
  }
  const bg = new THREE.BufferGeometry();
  bg.setAttribute('position', new THREE.Float32BufferAttribute(bed, 3));
  bg.setIndex(idx);
  bg.computeVertexNormals();
  const ballast = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: '#7D7568', roughness: 1, side: THREE.DoubleSide }));
  ballast.receiveShadow = true;
  group.add(ballast);
  return group;
}

// ---------------------------------------------------------------- stations
function boardTexture(name: string, n: number) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const draw = () => {
    const g = c.getContext('2d')!;
    g.fillStyle = '#F3F2EA'; g.fillRect(0, 0, 1024, 256);
    g.strokeStyle = '#1B3022'; g.lineWidth = 10; g.strokeRect(14, 14, 996, 228);
    g.fillStyle = '#1B5638';
    g.font = 'italic 40px "Cormorant Garamond", Georgia, serif';
    g.textAlign = 'center';
    g.fillText(`Station ${n}`, 512, 82);
    g.fillStyle = '#1B3022';
    g.font = '96px "Rozha One", Georgia, serif';
    g.fillText(name, 512, 190);
  };
  draw();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  document.fonts?.ready.then(() => { draw(); t.needsUpdate = true; });
  return t;
}

export function makeStation(u: number, name: string, n: number) {
  const f = frameAt(u);
  const group = new THREE.Group();
  // right-handed: x = right of travel, y = up, z = backwards along the line
  const basis = new THREE.Matrix4().makeBasis(f.right, UP, new THREE.Vector3().crossVectors(f.right, UP));
  group.position.copy(f.pos);
  group.quaternion.setFromRotationMatrix(basis);
  const cream = new THREE.MeshStandardMaterial({ color: '#EDE8D6', roughness: 0.9 });
  const forest = new THREE.MeshStandardMaterial({ color: '#1B3022', roughness: 0.7 });
  const stone = new THREE.MeshStandardMaterial({ color: '#A69F8B', roughness: 1 });
  const roofM = new THREE.MeshStandardMaterial({ color: '#7E4A3A', roughness: 0.85 });
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, shadow = true) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true; group.add(m); return m;
  };
  // platform on the left of the line
  add(new THREE.BoxGeometry(1.1, 0.26, 4.6), stone, -0.98, 0.0, 0);
  add(new THREE.BoxGeometry(0.06, 0.02, 4.6), new THREE.MeshStandardMaterial({ color: '#E8D9A0' }), -0.48, 0.135, 0, false);
  // a small station building, cream walls and a red tin roof
  add(new THREE.BoxGeometry(0.9, 0.62, 1.5), cream, -1.15, 0.44, -0.8);
  const roof = add(new THREE.CylinderGeometry(0.62, 0.62, 1.75, 3, 1), roofM, -1.15, 0.86, -0.8);
  roof.rotation.x = Math.PI / 2; roof.rotation.y = Math.PI / 2; roof.scale.set(1, 1, 0.45);
  for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.02, 0.28, 0.2), forest, -0.69, 0.42, -1.25 + i * 0.45, false);
  // lamp post
  add(new THREE.CylinderGeometry(0.018, 0.024, 1.1, 6), forest, -0.62, 0.68, 1.4);
  const lamp = add(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshStandardMaterial({ color: '#FFF2C8', emissive: '#FFE3A0', emissiveIntensity: 0.8 }), -0.62, 1.25, 1.4, false);
  lamp.castShadow = false;
  // name board on two posts, facing the line
  add(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6), forest, -0.86, 0.55, 0.15);
  add(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6), forest, -0.86, 0.55, 1.05);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.27), new THREE.MeshStandardMaterial({ map: boardTexture(name, n), roughness: 0.8 }));
  board.position.set(-0.85, 0.92, 0.6);
  board.rotation.y = Math.PI / 2;
  group.add(board);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.31), forest);
  back.position.set(-0.86, 0.92, 0.6); back.rotation.y = -Math.PI / 2;
  group.add(back);
  // a bench and some sacks of leaf waiting on the platform
  add(new THREE.BoxGeometry(0.22, 0.04, 0.6), new THREE.MeshStandardMaterial({ color: '#5A4532' }), -1.2, 0.3, 0.9);
  const sack = new THREE.MeshStandardMaterial({ color: '#B9A47A', roughness: 1 });
  [[-1.3, -2.0], [-1.1, -2.1], [-1.22, -1.8]].forEach(([x, z], i) => {
    const s = add(new THREE.SphereGeometry(0.13, 10, 8), sack, x, 0.24 + (i === 2 ? 0.14 : 0), z);
    s.scale.set(1, 1.2, 0.85);
  });
  return group;
}

// ---------------------------------------------------------------- a tea leaf
export function leafGeometry(size = 1) {
  const s = new THREE.Shape();
  s.moveTo(0, -1);
  s.bezierCurveTo(0.62, -0.72, 0.58, 0.42, 0, 1.08);
  s.bezierCurveTo(-0.58, 0.42, -0.62, -0.72, 0, -1);
  const g = new THREE.ShapeGeometry(s, 8);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    p.setZ(i, x * x * 0.55 + (y > 0 ? y * y * 0.12 : 0));
  }
  g.computeVertexNormals();
  g.scale(size, size, size);
  return g;
}

export function softTexture(inner: string, outer: string, size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.45, inner.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.55})`));
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
