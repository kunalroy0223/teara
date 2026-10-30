// Teara 3D layer for the inner pages. One fixed WebGL canvas behind the page;
// each page picks a scene: story | leaf | serum | seal | people.
// mountScene() returns a function that stops and frees everything.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { T_GLYPH } from './tglyph.js';

const SAGE = new THREE.Color('#C9D1B5');
const FOREST = new THREE.Color('#1B3022');
const DEEP = new THREE.Color('#1B5638');
const LEAF_TONES = ['#1B5638', '#2F5A3F', '#4C6E4F', '#6E8A5E', '#8E9F74', '#1B3022'];

export function mountScene(canvas, mode) {
const offs = [];
const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); offs.push(() => target.removeEventListener(type, fn, opts)); };
let alive = true;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  return () => {};
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);

// ---------- shared input ----------
const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
on(window, 'pointermove', (e) => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });

function scrollProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
}
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// Small deterministic random so scenes look the same on every load.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// ---------- textures ----------
function radialTexture(inner, outer, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const dotTexture = radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 64);
const mistTexture = radialTexture('rgba(243,245,233,0.9)', 'rgba(243,245,233,0)', 256);

// ---------- tea leaf geometry ----------
function leafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, -1);
  s.bezierCurveTo(0.62, -0.72, 0.58, 0.42, 0, 1.08);
  s.bezierCurveTo(-0.58, 0.42, -0.62, -0.72, 0, -1);
  const g = new THREE.ShapeGeometry(s, 14);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    // cupped along the midrib, slight curl toward the tip
    p.setZ(i, 0.42 * x * x + 0.12 * (y + 1) * (y + 1) * 0.5);
  }
  g.computeVertexNormals();
  return g;
}

function makeLeaves(count, spread, seed = 7) {
  const r = rng(seed);
  const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.72, metalness: 0.0 });
  const mesh = new THREE.InstancedMesh(leafGeometry(), mat, count);
  const data = [];
  const col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    data.push({
      p: new THREE.Vector3((r() - 0.5) * spread.x, (r() - 0.5) * spread.y, (r() - 0.5) * spread.z + spread.cz),
      rot: new THREE.Euler(r() * 6.28, r() * 6.28, r() * 6.28),
      spin: new THREE.Vector3((r() - 0.5) * 0.6, (r() - 0.5) * 0.6, (r() - 0.5) * 0.4),
      drift: new THREE.Vector3(0.25 + r() * 0.35, -0.1 - r() * 0.25, (r() - 0.5) * 0.1),
      s: 0.32 + r() * 0.42,
      ph: r() * 6.28,
    });
    col.set(LEAF_TONES[Math.floor(r() * LEAF_TONES.length)]);
    mesh.setColorAt(i, col);
  }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
  mesh.userData.update = (t, dt, extra = {}) => {
    const wind = extra.wind ?? 1;
    for (let i = 0; i < count; i++) {
      const d = data[i];
      if (!reduced) {
        d.p.x += d.drift.x * dt * wind;
        d.p.y += (d.drift.y + Math.sin(t * 0.7 + d.ph) * 0.15) * dt * wind;
        d.p.z += d.drift.z * dt;
        d.rot.x += d.spin.x * dt; d.rot.y += d.spin.y * dt; d.rot.z += d.spin.z * dt;
        if (d.p.x > spread.x / 2) d.p.x -= spread.x;
        if (d.p.y < -spread.y / 2) d.p.y += spread.y;
      }
      q.setFromEuler(d.rot);
      sc.setScalar(d.s);
      m4.compose(d.p, q, sc);
      mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  mesh.userData.update(0, 0);
  return mesh;
}

function softLights(target) {
  target.add(new THREE.HemisphereLight(0xf3f5e9, 0x3b5240, 1.6));
  const key = new THREE.DirectionalLight(0xfffbea, 1.6);
  key.position.set(6, 10, 8);
  target.add(key);
}

// ---------- Darjeeling ridges ----------
function ridgeLayer(i, total, seed) {
  const r = rng(seed);
  const ph = [r() * 10, r() * 10, r() * 10, r() * 10];
  const shape = new THREE.Shape();
  const W = 260, steps = 220;
  const amp = 3 + i * 2.4;
  const base = -12 + i * 3.6;
  const h = (x) => base
    + amp * (0.55 * Math.sin(x * 0.035 + ph[0]) + 0.3 * Math.sin(x * 0.083 + ph[1])
      + 0.12 * Math.sin(x * 0.21 + ph[2]) + 0.05 * Math.sin(x * 0.53 + ph[3]));
  shape.moveTo(-W / 2, -80);
  for (let k = 0; k <= steps; k++) {
    const x = -W / 2 + (W * k) / steps;
    shape.lineTo(x, h(x));
  }
  shape.lineTo(W / 2, -80);
  shape.closePath();
  const g = new THREE.ShapeGeometry(shape, 1);
  const tone = new THREE.Color().copy(FOREST).lerp(SAGE, Math.pow(i / (total - 1), 0.8) * 0.92);
  const m = new THREE.MeshBasicMaterial({ color: tone, fog: true });
  const mesh = new THREE.Mesh(g, m);
  mesh.position.z = -14 - i * 16;
  return mesh;
}

function addMist(group, count, area, seed) {
  const r = rng(seed);
  const mists = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTexture, transparent: true, opacity: 0.35 + r() * 0.35, depthWrite: false }));
    const s = 30 + r() * 50;
    m.scale.set(s * 2.2, s * 0.55, 1);
    m.position.set((r() - 0.5) * area.x, area.y0 + r() * area.y, area.z0 - r() * area.z);
    m.userData.v = 0.4 + r() * 0.8;
    group.add(m);
    mists.push(m);
  }
  return (dt) => {
    if (reduced) return;
    for (const m of mists) {
      m.position.x += m.userData.v * dt;
      if (m.position.x > area.x / 2) m.position.x -= area.x;
    }
  };
}

function buildRidges(opts) {
  scene.fog = new THREE.Fog(SAGE, 20, 140);
  softLights(scene);
  const layers = 6;
  for (let i = 0; i < layers; i++) scene.add(ridgeLayer(i, layers, 11 + i * 3));
  const mist = addMist(scene, 16, { x: 260, y0: -2, y: 16, z0: -10, z: 90 }, 5);
  const leaves = makeLeaves(opts.leaves, { x: 60, y: 34, z: 26, cz: 4 }, opts.seed);
  scene.add(leaves);

  return (t, dt) => {
    const p = ease(scrollProgress());
    // Rise out of the valley into the mist as the story is read.
    const camY = lerp(opts.y0, opts.y1, p);
    const camZ = lerp(opts.z0, opts.z1, p);
    camera.position.set(pointer.sx * 2.2, camY - pointer.sy * 1.2, camZ);
    camera.lookAt(pointer.sx * 1.2, camY + lerp(opts.look0, opts.look1, p), camZ - 60);
    leaves.position.y = camY - 4;
    leaves.position.z = camZ - 22;
    mist(dt);
    leaves.userData.update(t, dt);
  };
}

// ---------- particle morph (From Leaf) ----------
function sampleShapes(N) {
  const r = rng(42);
  const gauss = () => (r() + r() + r() - 1.5) * 0.6;
  const sets = [];
  const make = (fn) => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const v = fn(i);
      a[i * 3] = v[0]; a[i * 3 + 1] = v[1]; a[i * 3 + 2] = v[2];
    }
    sets.push(a);
  };
  const leafWidth = (y) => { const u = (y + 1) / 2.08; return 0.6 * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 0.85) * (1 - 0.18 * u); };
  // 1 tea estates: a single leaf with its veins
  make((i) => {
    let x, y;
    if (i % 5 === 0) { y = -1 + r() * 2.06; x = 0; }
    else if (i % 5 === 1) {
      const y0 = -0.8 + Math.floor(r() * 8) * 0.22, side = r() < 0.5 ? -1 : 1, t = r();
      x = side * t * leafWidth(y0) * 0.95; y = y0 + t * 0.32;
    } else {
      do { x = (r() - 0.5) * 1.3; y = -1 + r() * 2.08; } while (Math.abs(x) > leafWidth(y));
    }
    const s = 4.6;
    return [x * s * 1.25, y * s, (0.42 * x * x) * s + gauss() * 0.06];
  });
  // 2 biomass: a loose heap of fragments
  make(() => {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 6.2;
    const hgt = Math.pow(1 - d / 6.2, 1.6) * 3.6 * (0.4 + r() * 0.6);
    return [Math.cos(a) * d, -3.2 + hgt, Math.sin(a) * d * 0.55];
  });
  // 3 sourcing: a stream carried from the estates
  make(() => {
    const x = -8 + r() * 16;
    return [x, Math.sin(x * 0.55) * 1.6 + gauss() * 0.35, Math.cos(x * 0.35) * 1.4 + gauss() * 0.35];
  });
  // 4 extraction: a double helix
  make((i) => {
    const t = r(), a = t * Math.PI * 7 + (i % 2) * Math.PI, rad = 2.2;
    if (i % 7 === 0) { const k = r(); return [lerp(Math.cos(a) * rad, Math.cos(a + Math.PI) * rad, k), -5.4 + t * 10.8, lerp(Math.sin(a) * rad, Math.sin(a + Math.PI) * rad, k)]; }
    return [Math.cos(a) * rad + gauss() * 0.12, -5.4 + t * 10.8, Math.sin(a) * rad + gauss() * 0.12];
  });
  // 5 actives: linked six-sided rings, the polyphenol motif
  const rings = [[-2.6, -1.2], [0, 0.3], [2.6, -1.2], [0, 3.3]];
  make(() => {
    const [cx, cy] = rings[Math.floor(r() * rings.length)];
    const k = Math.floor(r() * 6), t = r(), R = 1.5;
    const a0 = (k / 6) * Math.PI * 2 + Math.PI / 6, a1 = ((k + 1) / 6) * Math.PI * 2 + Math.PI / 6;
    return [cx + lerp(Math.cos(a0), Math.cos(a1), t) * R + gauss() * 0.05, cy + lerp(Math.sin(a0), Math.sin(a1), t) * R + gauss() * 0.05, gauss() * 0.25];
  });
  // 6 skincare: a single drop
  make(() => {
    const t = Math.acos(1 - 2 * r()), ph = r() * Math.PI * 2;
    const rad = 2.6 * Math.sin(t) * Math.pow((1 - Math.cos(t)) / 2, 0.75);
    return [Math.cos(ph) * rad, Math.cos(t) * 3.6 + 0.4, Math.sin(ph) * rad];
  });
  // 7 new value: a closed loop
  make(() => {
    const a = r() * Math.PI * 2, rr = 4.6 + gauss() * 0.3;
    return [Math.cos(a) * rr, Math.sin(a) * rr, gauss() * 0.5];
  });
  return sets;
}

function buildParticles() {
  const N = innerWidth < 700 ? 3400 : 6000;
  const sets = sampleShapes(N);
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  pos.set(sets[0]);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const cols = new Float32Array(N * 3);
  const r = rng(3), c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    c.copy(FOREST).lerp(DEEP, r()).lerp(new THREE.Color('#6E8A5E'), r() * 0.35);
    cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({ size: 0.11, map: dotTexture, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true });
  const pts = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(pts);
  scene.add(group);
  const jitter = new Float32Array(N);
  for (let i = 0; i < N; i++) jitter[i] = r() * 6.28;

  const steps = [...document.querySelectorAll('[data-step]')];
  let shown = 0;
  const label = document.querySelector('[data-step-label]');

  function target() {
    if (!steps.length) return 0;
    const mid = scrollY + innerHeight * 0.5;
    const centers = steps.map((el) => { const b = el.getBoundingClientRect(); return b.top + scrollY + b.height / 2; });
    if (mid <= centers[0]) return 0;
    for (let i = 0; i < centers.length - 1; i++) {
      if (mid < centers[i + 1]) {
        const f = (mid - centers[i]) / (centers[i + 1] - centers[i]);
        return i + ease(Math.min(1, Math.max(0, (f - 0.3) / 0.4)));
      }
    }
    return centers.length - 1;
  }

  return (t, dt) => {
    const goal = target();
    shown = reduced ? goal : lerp(shown, goal, Math.min(1, dt * 4));
    const i0 = Math.min(sets.length - 1, Math.floor(shown)), i1 = Math.min(sets.length - 1, i0 + 1), f = shown - i0;
    const A = sets[i0], B = sets[i1];
    const amp = reduced ? 0 : 0.05;
    for (let i = 0; i < N; i++) {
      // stagger so the change ripples through the cloud instead of snapping
      const k = Math.min(1, Math.max(0, f * 1.6 - (i / N) * 0.6));
      const e = ease(k);
      const w = Math.sin(t * 1.3 + jitter[i]) * amp + Math.sin(k * Math.PI) * 0.6 * Math.sin(jitter[i] * 3.0);
      pos[i * 3] = lerp(A[i * 3], B[i * 3], e) + w;
      pos[i * 3 + 1] = lerp(A[i * 3 + 1], B[i * 3 + 1], e) + Math.cos(t + jitter[i]) * amp;
      pos[i * 3 + 2] = lerp(A[i * 3 + 2], B[i * 3 + 2], e) + w * 0.5;
    }
    geo.attributes.position.needsUpdate = true;
    if (label) label.textContent = String(Math.round(shown) + 1).padStart(2, '0');
    group.rotation.y = (reduced ? 0 : Math.sin(t * 0.2) * 0.35) + pointer.sx * 0.4;
    group.rotation.x = pointer.sy * 0.15;
    placeAtStage(group, 15);
    camera.position.set(0, 0, 26);
    camera.lookAt(0, 0, 0);
  };
}

// Put an object where the page's #stage box sits on screen.
const stageEl = document.getElementById('stage');
const _v = new THREE.Vector3();
function placeAtStage(obj, unitsTall) {
  if (!stageEl) return;
  const b = stageEl.getBoundingClientRect();
  const cx = ((b.left + b.width / 2) / innerWidth) * 2 - 1;
  const cy = -(((b.top + b.height / 2) / innerHeight) * 2 - 1);
  const dist = camera.position.length();
  const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
  _v.set(cx * visH * camera.aspect / 2, cy * visH / 2, 0);
  obj.position.copy(_v);
  const fit = Math.min(b.height / innerHeight, (b.width / innerWidth) * camera.aspect * 1.1) * visH;
  obj.scale.setScalar(Math.max(0.2, fit / unitsTall));
}

// ---------- Serum bottle ----------
function envMap() {
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  return tex;
}

function labelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  drawLabel(c);
  // redraw once the web fonts arrive so the label type is right
  document.fonts?.ready.then(() => { drawLabel(c); t.needsUpdate = true; });
  return t;
}
function drawLabel(c) {
  const g = c.getContext('2d');
  g.fillStyle = '#F3F2EA';
  g.fillRect(0, 0, c.width, c.height);
  // uncoated paper fibre
  const r = rng(9);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(27,48,34,${r() * 0.05})`; g.fillRect(r() * 1024, r() * 512, 1 + r() * 2, 1); }
  g.save();
  g.translate(512 - 34, 300);
  g.scale(2.2, 2.2);
  g.translate(-17.3, -2);
  g.fillStyle = '#1B3022';
  g.fill(new Path2D(T_GLYPH));
  g.restore();
  g.fillStyle = '#1B3022';
  g.textAlign = 'center';
  g.font = '300 30px Urbanist, sans-serif';
  g.letterSpacing = '6px';
  g.fillText('TEA-EXTRACT FACIAL SERUM', 512, 380);
  g.font = 'italic 400 34px "Cormorant Garamond", serif';
  g.letterSpacing = '0px';
  g.fillText('N° 01, in the making', 512, 438);
}

function buildSerum() {
  scene.environment = envMap();
  softLights(scene);
  const group = new THREE.Group();

  const prof = [
    [0, 0], [0.92, 0], [1.08, 0.08], [1.14, 0.3], [1.14, 2.55], [1.08, 2.85], [0.86, 3.08], [0.5, 3.22], [0.44, 3.3], [0.44, 3.62], [0, 3.62],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#E6ECD8', roughness: 0.22, metalness: 0, transmission: 1, thickness: 0.8, ior: 1.5,
    attenuationColor: new THREE.Color('#B9C6A0'), attenuationDistance: 3.5, clearcoat: 0.3, clearcoatRoughness: 0.4,
  });
  const bottle = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), glass);
  group.add(bottle);

  const liq = [[0, 0.1], [0.98, 0.1], [1.02, 0.25], [1.02, 2.15], [0, 2.15]].map(([x, y]) => new THREE.Vector2(x, y));
  const liquid = new THREE.Mesh(new THREE.LatheGeometry(liq, 64), new THREE.MeshPhysicalMaterial({
    color: '#B49B48', roughness: 0.15, transmission: 0.55, thickness: 1, transparent: true, opacity: 0.92,
  }));
  group.add(liquid);

  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(1.152, 1.152, 1.25, 96, 1, true, -0.95, 1.9),
    new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.95, side: THREE.FrontSide }),
  );
  label.position.y = 1.32;
  group.add(label);

  const forestMat = new THREE.MeshStandardMaterial({ color: FOREST, roughness: 0.55, metalness: 0.1 });
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.55, 64), forestMat);
  collar.position.y = 3.86;
  group.add(collar);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.035, 12, 64), new THREE.MeshStandardMaterial({ color: '#C9D1B5', roughness: 0.4, metalness: 0.5 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 4.12;
  group.add(ring);
  const bulbP = [[0, 4.13], [0.42, 4.13], [0.44, 4.3], [0.4, 4.7], [0.36, 5.0], [0.3, 5.25], [0.16, 5.38], [0, 5.4]].map(([x, y]) => new THREE.Vector2(x, y));
  group.add(new THREE.Mesh(new THREE.LatheGeometry(bulbP, 64), new THREE.MeshStandardMaterial({ color: '#22382A', roughness: 0.85 })));
  const pipette = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 3.0, 24), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, roughness: 0.1, thickness: 0.2 }));
  pipette.position.y = 2.1;
  group.add(pipette);

  group.children.forEach((m) => { m.position.y -= 2.7; });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: radialTexture('rgba(27,48,34,0.35)', 'rgba(27,48,34,0)'), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.72;
  group.add(shadow);

  const leaves = makeLeaves(14, { x: 16, y: 12, z: 6, cz: -4 }, 21);
  scene.add(leaves);
  scene.add(group);

  return (t, dt) => {
    const p = scrollProgress();
    camera.position.set(0, 0.6, 16);
    camera.lookAt(0, 0, 0);
    placeAtStage(group, 6.6);
    group.rotation.y = (reduced ? 0.5 : t * 0.18) + p * Math.PI * 1.5 + pointer.sx * 0.35;
    group.rotation.x = 0.08 + pointer.sy * 0.08;
    group.rotation.z = Math.sin(t * 0.4) * 0.02;
    leaves.position.copy(group.position);
    leaves.userData.update(t, dt, { wind: 0.4 });
  };
}

// ---------- The "t" seal ----------
function buildSeal() {
  scene.environment = envMap();
  softLights(scene);
  const group = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.34, 128), new THREE.MeshStandardMaterial({ color: FOREST, roughness: 0.42, metalness: 0.25 }));
  disc.rotation.x = Math.PI / 2;
  group.add(disc);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.22, 0.035, 16, 128), new THREE.MeshStandardMaterial({ color: '#C9D1B5', roughness: 0.3, metalness: 0.6 }));
  rim.position.z = 0.18;
  group.add(rim);

  const shapes = SVGLoader.createShapes({ subPaths: new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${T_GLYPH}"/></svg>`).paths[0].subPaths, userData: { style: { fillRule: 'nonzero' } } });
  const tg = new THREE.ExtrudeGeometry(shapes, { depth: 6, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.5, bevelSegments: 3, curveSegments: 18 });
  tg.translate(-17.3, 30.7, 0);
  const tMesh = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ color: '#D6DBBE', roughness: 0.5, metalness: 0.15 }));
  const s = 2.9 / 62.5;
  tMesh.scale.set(s, -s, s);
  tMesh.position.z = 0.17;
  group.add(tMesh);
  const back = tMesh.clone();
  back.rotation.y = Math.PI; back.position.z = -0.17;
  group.add(back);
  scene.add(group);

  // leaves on slow orbits around the seal
  const orbit = new THREE.Group();
  const leaves = makeLeaves(26, { x: 0.01, y: 0.01, z: 0.01, cz: 0 }, 33);
  orbit.add(leaves);
  group.add(orbit);
  const r = rng(77);
  const orbits = Array.from({ length: 26 }, () => ({ rad: 3.3 + r() * 1.6, a: r() * 6.28, sp: 0.12 + r() * 0.12, tilt: (r() - 0.5) * 0.9, y: (r() - 0.5) * 1.2, s: 0.26 + r() * 0.2, rot: new THREE.Euler(r() * 6, r() * 6, r() * 6) }));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3();

  return (t, dt) => {
    camera.position.set(0, 0, 18);
    camera.lookAt(0, 0, 0);
    placeAtStage(group, 11);
    const p = scrollProgress();
    group.rotation.y = (reduced ? -0.35 : Math.sin(t * 0.35) * 0.55) + p * Math.PI * 2 + pointer.sx * 0.4;
    group.rotation.x = pointer.sy * 0.2;
    orbits.forEach((o, i) => {
      if (!reduced) { o.a += o.sp * dt; o.rot.x += dt * 0.3; o.rot.z += dt * 0.2; }
      v.set(Math.cos(o.a) * o.rad, o.y + Math.sin(o.a) * o.rad * o.tilt, Math.sin(o.a) * o.rad);
      q.setFromEuler(o.rot); sc.setScalar(o.s);
      m4.compose(v, q, sc);
      leaves.setMatrixAt(i, m4);
    });
    leaves.instanceMatrix.needsUpdate = true;
  };
}

// ---------- People: quiet leaf field ----------
function buildPeople() {
  scene.fog = new THREE.Fog(SAGE, 18, 60);
  softLights(scene);
  addMist(scene, 6, { x: 120, y0: -10, y: 20, z0: -10, z: 30 }, 2);
  const leaves = makeLeaves(46, { x: 50, y: 30, z: 20, cz: -8 }, 51);
  scene.add(leaves);
  return (t, dt) => {
    const p = scrollProgress();
    camera.position.set(pointer.sx * 1.5, -p * 4 - pointer.sy, 18);
    camera.lookAt(0, -p * 4, 0);
    leaves.userData.update(t, dt, { wind: 0.6 });
  };
}

// ---------- boot ----------
const builders = {
  ridges: () => buildRidges({ leaves: 70, seed: 7, y0: 2, y1: 16, z0: 34, z1: 22, look0: 3, look1: 40 }),
  story: () => buildRidges({ leaves: 34, seed: 12, y0: 3, y1: 12, z0: 40, z1: 4, look0: 4, look1: 30 }),
  leaf: buildParticles,
  serum: buildSerum,
  seal: buildSeal,
  people: buildPeople,
};
const tick = (builders[mode] || builders.ridges)();

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < 700 ? 52 : 40;
  camera.updateProjectionMatrix();
}
on(window, 'resize', resize);
resize();

const clock = new THREE.Clock();
let running = true;
on(document, 'visibilitychange', () => { running = alive && !document.hidden; if (running) { clock.getDelta(); loop(); } });
function loop() {
  if (!running) return;
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  pointer.sx = lerp(pointer.sx, reduced ? 0 : pointer.x, 0.04);
  pointer.sy = lerp(pointer.sy, reduced ? 0 : pointer.y, 0.04);
  tick(t, dt);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
document.fonts?.ready.then(() => document.documentElement.classList.add('fonts-ready'));
loop();
document.documentElement.classList.add('has-3d');

return () => {
  alive = false;
  running = false;
  offs.forEach((off) => off());
  scene.traverse((o) => {
    o.geometry?.dispose?.();
    const m = o.material;
    (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); });
  });
  renderer.dispose();
  document.documentElement.classList.remove('has-3d');
};
}
