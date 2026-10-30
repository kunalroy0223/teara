'use client';
// The 3D part of the Home journey. Runs inside the <Canvas> in Journey.tsx.
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  C, TRACK_LEN, track, groundHeight, leafGeometry, makeMist, makeRails, makeRanges, makeSky,
  makeStation, makeTea, makeTerrain, makeTrees, rng, softTexture,
} from '@/lib/journey/world';
import { BOTTLE, KEYS, SHOW, STATIONS, opacityFor, smooth, stationAt, trainU, type V } from '@/lib/journey/timeline';
import { sound } from '@/lib/sound';
import { PREVIEW, asset } from '@/lib/site';

export type Shared = {
  prog: MutableRefObject<number>;
  ui: MutableRefObject<Record<string, HTMLElement | null>>;
  reduced: boolean;
};

// What every part of the scene reads each frame, worked out once by the Director.
type State = {
  p: number; s: number; ds: number; speed: number; t: number;
  engine: THREE.Object3D; wagons: THREE.Object3D[];
};

const UP = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _m = new THREE.Matrix4(), _left = new THREE.Vector3(), _up = new THREE.Vector3(), _f = new THREE.Vector3();

// A point at arc length s along the line, carrying straight on past either end.
function pointAtS(s: number, out: THREE.Vector3) {
  if (s <= 0) { track.getPointAt(0, out); return out.addScaledVector(track.getTangentAt(0, _f), s); }
  if (s >= TRACK_LEN) { track.getPointAt(1, out); return out.addScaledVector(track.getTangentAt(1, _f), s - TRACK_LEN); }
  return track.getPointAt(s / TRACK_LEN, out);
}

// Put a car on the rails: its two bogies sit on the line, `half` either side of its centre.
function placeCar(obj: THREE.Object3D, s: number, half: number) {
  pointAtS(s + half, _a);
  pointAtS(s - half, _b);
  obj.position.addVectors(_a, _b).multiplyScalar(0.5);
  _f.subVectors(_a, _b).normalize();
  _left.crossVectors(UP, _f).normalize();
  _up.crossVectors(_f, _left).normalize();
  _m.makeBasis(_left, _up, _f);
  obj.quaternion.setFromRotationMatrix(_m);
}

const ENGINE_HALF = 0.6;
const W1 = -1.88, W2 = -3.33; // wagon centres behind the engine, along the line
const RAIL_TOP = 0.035;

// ---------------------------------------------------------------- the static world
function Land({ mobile }: { mobile: boolean }) {
  const { scene } = useThree();
  const world = useMemo(() => {
    const g = new THREE.Group();
    g.add(makeSky(), makeRanges(), makeTerrain(mobile), makeTea(mobile), makeTrees(mobile), makeRails());
    STATIONS.forEach((st, i) => g.add(makeStation(st.u, st.name, i + 1)));
    const mist = makeMist(softTexture('rgba(255,255,255,0.9)', 'rgba(255,255,255,0)'), mobile);
    g.add(mist);
    return { g, mist };
  }, [mobile]);
  useEffect(() => {
    scene.fog = new THREE.Fog(C.horizon, 22, 200);
    return () => { scene.fog = null; };
  }, [scene]);
  useEffect(() => () => {
    world.g.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      (Array.isArray(m.material) ? m.material : m.material ? [m.material] : []).forEach((x) => { (x as THREE.MeshStandardMaterial).map?.dispose(); x.dispose(); });
    });
  }, [world]);
  useFrame((_, dt) => {
    world.mist.children.forEach((s) => { s.position.x += (s.userData.drift as number) * dt; });
  });
  return <primitive object={world.g} />;
}

// ---------------------------------------------------------------- the train
function makeWagon(seed: number) {
  const r = rng(seed);
  const g = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: '#2B4A35', roughness: 0.6, metalness: 0.2 });
  const iron = new THREE.MeshStandardMaterial({ color: '#1A1C1A', roughness: 0.55, metalness: 0.6 });
  const plank = new THREE.MeshStandardMaterial({ color: '#3A5A43', roughness: 0.7, metalness: 0.1 });
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };
  const L = 1.28, Wd = 0.64, floor = 0.24;
  add(new THREE.BoxGeometry(Wd * 0.8, 0.08, L), iron, 0, floor - 0.06, 0);
  add(new THREE.BoxGeometry(Wd, 0.04, L), body, 0, floor, 0);
  add(new THREE.BoxGeometry(0.035, 0.3, L), body, Wd / 2, floor + 0.15, 0);
  add(new THREE.BoxGeometry(0.035, 0.3, L), body, -Wd / 2, floor + 0.15, 0);
  add(new THREE.BoxGeometry(Wd, 0.3, 0.035), body, 0, floor + 0.15, L / 2);
  add(new THREE.BoxGeometry(Wd, 0.3, 0.035), body, 0, floor + 0.15, -L / 2);
  for (let i = -2; i <= 2; i++) {
    add(new THREE.BoxGeometry(0.045, 0.31, 0.03), plank, Wd / 2 + 0.01, floor + 0.15, i * 0.28);
    add(new THREE.BoxGeometry(0.045, 0.31, 0.03), plank, -Wd / 2 - 0.01, floor + 0.15, i * 0.28);
  }
  add(new THREE.BoxGeometry(Wd + 0.06, 0.03, 0.05), iron, 0, floor + 0.3, L / 2);
  add(new THREE.BoxGeometry(Wd + 0.06, 0.03, 0.05), iron, 0, floor + 0.3, -L / 2);
  // couplers
  add(new THREE.BoxGeometry(0.06, 0.05, 0.12), iron, 0, floor - 0.05, L / 2 + 0.06);
  add(new THREE.BoxGeometry(0.06, 0.05, 0.12), iron, 0, floor - 0.05, -L / 2 - 0.06);
  const wheels: THREE.Mesh[] = [];
  const wGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.04, 18).rotateZ(Math.PI / 2);
  [-0.4, 0.4].forEach((z) => [-0.15, 0.15].forEach((x) => { wheels.push(add(wGeo, iron, x, 0.085 + RAIL_TOP - 0.01, z)); }));
  // a heap of leftover leaf
  const N = 150;
  const leaf = leafGeometry(0.075);
  const tones = ['#6B6A3A', '#7D7445', '#5D6B3C', '#8A8A52', '#4C6E4F', '#5F7A46'].map((x) => new THREE.Color(x));
  const cargo = new THREE.InstancedMesh(leaf, new THREE.MeshStandardMaterial({ roughness: 0.75, side: THREE.DoubleSide }), N);
  cargo.castShadow = true;
  const heap: THREE.Matrix4[] = [];
  const q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const x = (r() - 0.5) * (Wd - 0.1), z = (r() - 0.5) * (L - 0.12);
    const mound = 0.3 * (1 - (x / 0.34) ** 2 * 0.6 - (z / 0.66) ** 2 * 0.6);
    v.set(x, floor + 0.04 + r() * Math.max(0.04, mound), z);
    e.set(r() * 6.28, r() * 6.28, r() * 6.28); q.setFromEuler(e);
    const sc = 0.8 + r() * 0.6; s.set(sc, sc, sc);
    const m4 = new THREE.Matrix4().compose(v, q, s);
    heap.push(m4); cargo.setMatrixAt(i, m4);
    cargo.setColorAt(i, tones[Math.floor(r() * tones.length)]);
  }
  g.add(cargo);
  return { g, wheels, cargo, heap };
}

function labelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const draw = () => {
    const g = c.getContext('2d')!;
    g.fillStyle = '#C9D1B5'; g.fillRect(0, 0, 1024, 256);
    g.fillStyle = '#1B3022';
    g.textAlign = 'center';
    g.font = '112px "Rozha One", Georgia, serif';
    g.fillText('teara', 256, 150);
    g.font = 'italic 34px "Cormorant Garamond", Georgia, serif';
    g.fillText('N° 01 · in the making', 256, 205);
  };
  draw();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  document.fonts?.ready.then(() => { draw(); t.needsUpdate = true; });
  return t;
}

function makeBottle(env: THREE.Texture | null) {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.12, 0], [0.145, 0.015], [0.152, 0.05], [0.152, 0.3], [0.142, 0.34], [0.09, 0.372], [0.058, 0.388], [0.058, 0.43], [0, 0.43]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#F2F6EA', roughness: 0.05, metalness: 0, transmission: 1, thickness: 0.3, ior: 1.46,
    envMap: env, envMapIntensity: 1.3, clearcoat: 1, clearcoatRoughness: 0.05,
  });
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), glass);
  g.add(body);
  const liq = new THREE.Mesh(
    new THREE.LatheGeometry([[0, 0.012], [0.135, 0.012], [0.14, 0.04], [0.14, 0.25], [0, 0.25]].map(([x, y]) => new THREE.Vector2(x, y)), 48),
    new THREE.MeshPhysicalMaterial({ color: '#A3AE6A', roughness: 0.15, transmission: 0.55, thickness: 0.2, envMap: env }),
  );
  g.add(liq);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.06, 32), new THREE.MeshStandardMaterial({ color: '#B39A62', metalness: 0.9, roughness: 0.25, envMap: env }));
  collar.position.y = 0.455;
  g.add(collar);
  const bulb = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.08, 6, 20), new THREE.MeshStandardMaterial({ color: '#1B3022', roughness: 0.55, envMap: env }));
  bulb.position.y = 0.55;
  g.add(bulb);
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1545, 0.1545, 0.13, 64, 1, true, -Math.PI * 0.55, Math.PI * 1.1),
    new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.85, side: THREE.FrontSide }),
  );
  (label.material as THREE.MeshStandardMaterial).map!.repeat.set(2, 1);
  (label.material as THREE.MeshStandardMaterial).map!.offset.set(-0.5 + 0.25, 0);
  (label.material as THREE.MeshStandardMaterial).map!.wrapS = THREE.RepeatWrapping;
  label.position.y = 0.17;
  g.add(label);
  g.traverse((o) => { (o as THREE.Mesh).castShadow = true; });
  return g;
}

function Train({ st, env, url }: { st: MutableRefObject<State>; env: THREE.Texture | null; url: string }) {
  const gltf = useGLTF(url, false, true);
  const parts = useMemo(() => {
    const model = gltf.scene;
    model.scale.setScalar(0.1);
    model.position.set(0, 0.498 + RAIL_TOP, 0.02);
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true; m.receiveShadow = true;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat.name === 'Material') { mat.color.set('#1E4A31'); mat.roughness = 0.42; mat.metalness = 0.35; }
      if (mat.name === 'Material.003' || mat.name === 'Material.002') { mat.color.set('#121412'); mat.roughness = 0.6; mat.metalness = 0.5; }
      mat.envMap = env; mat.envMapIntensity = 0.7;
      mat.needsUpdate = true;
    });
    const engine = new THREE.Group();
    engine.add(model);
    const wheels = ['W F_21', 'W R_22'].map((n) => model.getObjectByName(n)).filter(Boolean) as THREE.Object3D[];
    // headlamp glow
    const lamp = new THREE.PointLight('#FFE6B0', 0.0, 4, 2);
    lamp.position.set(0, 0.42, 1.0);
    engine.add(lamp);
    const w1 = makeWagon(3), w2 = makeWagon(8);
    const bottle = makeBottle(env);
    bottle.scale.setScalar(0.0001);
    w1.g.add(bottle);
    const glow = new THREE.PointLight('#FFF1CC', 0, 2.2, 2);
    glow.position.set(0, 0.85, 0);
    w1.g.add(glow);
    return { engine, model, wheels, w1, w2, bottle, glow, lamp };
  }, [gltf, env]);

  useEffect(() => {
    st.current.engine = parts.engine;
    st.current.wagons = [parts.w1.g, parts.w2.g];
  }, [parts, st]);

  // steam from the chimney
  const steam = useMemo(() => {
    const tex = softTexture('rgba(255,255,255,0.95)', 'rgba(255,255,255,0)', 128);
    const pool = Array.from({ length: 90 }, () => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: '#EFF0EA', transparent: true, opacity: 0, depthWrite: false }));
      s.userData = { age: 9, life: 1, vel: new THREE.Vector3(), size: 0.2, spin: 0 };
      s.visible = false;
      return s;
    });
    const g = new THREE.Group();
    pool.forEach((s) => g.add(s));
    return { g, pool, acc: 0, next: 0 };
  }, []);
  const chimney = useMemo(() => new THREE.Vector3(0, 6.1, 7.15), []);
  const emitAt = useMemo(() => new THREE.Vector3(), []);
  const leafM = useMemo(() => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), t: new THREE.Vector3() }), []);

  useFrame((state, dt) => {
    const S = st.current;
    placeCar(parts.engine, S.s, ENGINE_HALF);
    placeCar(parts.w1.g, S.s + W1, 0.42);
    placeCar(parts.w2.g, S.s + W2, 0.42);
    // wheels turn with the distance travelled
    parts.wheels.forEach((w) => { w.rotation.x += S.ds / 0.1; });
    [...parts.w1.wheels, ...parts.w2.wheels].forEach((w) => { w.rotation.x += S.ds / 0.085; });
    // a little rocking on the narrow gauge while moving
    parts.model.rotation.z = Math.sin(S.t * 9.0) * 0.004 * S.speed;
    parts.model.position.y = 0.498 + RAIL_TOP + Math.abs(Math.sin(S.t * 13)) * 0.003 * S.speed;
    parts.lamp.intensity = 0.6 + S.speed * 0.6;

    // steam
    parts.model.localToWorld(emitAt.copy(chimney));
    const rate = 3 + S.speed * 34;
    steam.acc += dt * rate;
    while (steam.acc >= 1) {
      steam.acc -= 1;
      const sp = steam.pool[steam.next = (steam.next + 1) % steam.pool.length];
      const u = sp.userData;
      u.age = 0; u.life = 2.2 + Math.random() * 1.6; u.size = 0.12 + Math.random() * 0.06; u.spin = (Math.random() - 0.5) * 0.6;
      u.vel.set((Math.random() - 0.5) * 0.12, 0.55 + Math.random() * 0.35 + S.speed * 0.4, (Math.random() - 0.5) * 0.12);
      sp.position.copy(emitAt);
      sp.visible = true;
    }
    steam.pool.forEach((sp) => {
      const u = sp.userData;
      if (u.age > u.life) { sp.visible = false; return; }
      u.age += dt;
      const k = u.age / u.life;
      u.vel.y *= 1 - dt * 0.45;
      u.vel.x += dt * 0.08; // the breeze takes it
      sp.position.addScaledVector(u.vel, dt);
      const size = u.size + k * 1.5;
      sp.scale.set(size, size, 1);
      (sp.material as THREE.SpriteMaterial).opacity = Math.min(1, u.age * 6) * Math.pow(1 - k, 1.6) * 0.62;
      (sp.material as THREE.SpriteMaterial).rotation += u.spin * dt;
    });

    // the leaf in the first wagon becomes the serum
    const k = smooth(BOTTLE[0], BOTTLE[1], S.p);
    const cargo = parts.w1.cargo;
    const N = cargo.count;
    const L = leafM;
    for (let i = 0; i < N; i++) {
      const d = (i / N) * 0.55;
      const tt = Math.min(1, Math.max(0, (k - d) / 0.45));
      parts.w1.heap[i].decompose(L.p, L.q, L.s);
      if (tt > 0) {
        const e = tt * tt * (3 - 2 * tt);
        const a = i * 2.4 + e * 7;
        const rad = (1 - e) * 0.32;
        L.t.set(Math.cos(a) * rad, 0.42 + e * 0.12 + Math.sin(e * Math.PI) * 0.3, Math.sin(a) * rad);
        L.p.lerp(L.t, e);
        L.s.multiplyScalar(1 - e);
      }
      L.m.compose(L.p, L.q, L.s);
      cargo.setMatrixAt(i, L.m);
    }
    cargo.instanceMatrix.needsUpdate = true;
    const b = smooth(0.4, 1, k);
    parts.bottle.scale.setScalar(Math.max(0.0001, b * 0.95));
    parts.bottle.position.y = 0.2 + b * 0.18;
    parts.bottle.rotation.y = state.clock.elapsedTime * 0.25 + 0.6;
    parts.glow.intensity = Math.sin(k * Math.PI) * 2.2 + b * 0.5;
  });

  return (
    <>
      <primitive object={parts.engine} />
      <primitive object={parts.w1.g} />
      <primitive object={parts.w2.g} />
      <primitive object={steam.g} />
    </>
  );
}
const MODEL = asset('models/dhr-b-green.glb');
if (typeof window !== 'undefined' && !PREVIEW) useGLTF.preload(MODEL, false, true);

// The shareable preview can only host text files, so there the model comes
// as base64 inside a JSON file and is turned back into a file in the browser.
function useModelUrl() {
  const [url, setUrl] = useState<string | null>(PREVIEW ? null : MODEL);
  useEffect(() => {
    if (!PREVIEW) return;
    let gone = false;
    fetch(asset('models/dhr-b-green.json')).then((r) => r.json()).then(({ glb }: { glb: string }) => {
      const bin = Uint8Array.from(atob(glb), (c) => c.charCodeAt(0));
      if (!gone) setUrl(URL.createObjectURL(new Blob([bin], { type: 'model/gltf-binary' })));
    });
    return () => { gone = true; };
  }, []);
  return url;
}

// ---------------------------------------------------------------- the camera and the story
function Director({ shared, st, sun }: { shared: Shared; st: MutableRefObject<State>; sun: MutableRefObject<THREE.DirectionalLight | null> }) {
  const { camera, size } = useThree();
  const tmp = useMemo(() => ({
    eng: new THREE.Object3D(), start: track.getPointAt(0), pos: new THREE.Vector3(), look: new THREE.Vector3(),
    a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), d: new THREE.Vector3(),
    camPos: new THREE.Vector3(), camLook: new THREE.Vector3(), first: true, station: -2, ptr: { x: 0, y: 0, sx: 0, sy: 0 },
    right: new THREE.Vector3(), fwd: new THREE.Vector3(), up: new THREE.Vector3(),
  }), []);

  useEffect(() => {
    const on = (e: PointerEvent) => { tmp.ptr.x = e.clientX / innerWidth * 2 - 1; tmp.ptr.y = e.clientY / innerHeight * 2 - 1; };
    addEventListener('pointermove', on, { passive: true });
    return () => removeEventListener('pointermove', on);
  }, [tmp]);

  const narrow = size.width < 760;
  const resolve = (v: V, out: THREE.Vector3, look = false) => {
    if (v.s === 'w') return out.copy(tmp.start).add(_a.set(v.v[0], v.v[1], v.v[2]));
    let [x, y, z] = v.v;
    // on a phone the words sit below, so frame the train centred and higher up
    if (look && narrow) { z = z + (-1.6 - z) * 0.65; y -= 0.7; }
    return out.copy(tmp.eng.position).addScaledVector(tmp.right, x).addScaledVector(UP, y).addScaledVector(tmp.fwd, z);
  };

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const S = st.current;
    const target = shared.prog.current;
    S.p = shared.reduced || (window as unknown as { __tearaSnap?: boolean }).__tearaSnap ? target : THREE.MathUtils.damp(S.p, target, 2.4, dt);
    if (Math.abs(S.p - target) < 1e-5) S.p = target;
    const s = trainU(S.p) * TRACK_LEN;
    S.ds = s - S.s;
    S.s = s;
    S.t = state.clock.elapsedTime;
    const v = Math.abs(S.ds) / Math.max(dt, 1e-3);
    S.speed = THREE.MathUtils.damp(S.speed, Math.min(1, v / 7), 4, dt);

    // the engine's frame, for camera offsets
    placeCar(tmp.eng, s, ENGINE_HALF);
    tmp.fwd.set(0, 0, 1).applyQuaternion(tmp.eng.quaternion);
    tmp.right.crossVectors(tmp.fwd, UP).normalize();

    // camera between the two nearest keys
    let i = 0;
    while (i < KEYS.length - 2 && S.p > KEYS[i + 1].p) i++;
    const k0 = KEYS[i], k1 = KEYS[i + 1];
    const f = smooth(k0.p, k1.p, S.p);
    resolve(k0.pos, tmp.a); resolve(k1.pos, tmp.b); tmp.pos.lerpVectors(tmp.a, tmp.b, f);
    resolve(k0.look, tmp.c, true); resolve(k1.look, tmp.d, true); tmp.look.lerpVectors(tmp.c, tmp.d, f);
    const fov = THREE.MathUtils.lerp(k0.fov ?? 36, k1.fov ?? 36, f) + (size.width < 760 ? 14 : 0);

    // a hand-held drift, and the pointer nudges the view
    const P = tmp.ptr;
    P.sx = THREE.MathUtils.damp(P.sx, shared.reduced ? 0 : P.x, 2, dt);
    P.sy = THREE.MathUtils.damp(P.sy, shared.reduced ? 0 : P.y, 2, dt);
    if (!shared.reduced) {
      tmp.pos.x += Math.sin(S.t * 0.31) * 0.05 + P.sx * 0.25;
      tmp.pos.y += Math.sin(S.t * 0.23 + 1) * 0.04 - P.sy * 0.15;
    }
    // never inside a hillside
    const gh = groundHeight(tmp.pos.x, tmp.pos.z) + 0.35;
    if (tmp.pos.y < gh) tmp.pos.y = gh;

    if (tmp.first || shared.reduced || (window as unknown as { __tearaSnap?: boolean }).__tearaSnap) { tmp.camPos.copy(tmp.pos); tmp.camLook.copy(tmp.look); tmp.first = false; }
    tmp.camPos.lerp(tmp.pos, 1 - Math.exp(-dt * 6));
    tmp.camLook.lerp(tmp.look, 1 - Math.exp(-dt * 6));
    camera.position.copy(tmp.camPos);
    camera.lookAt(tmp.camLook);
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = THREE.MathUtils.damp(cam.fov, fov, 4, dt); cam.updateProjectionMatrix(); }

    // the sun follows along so the train always has a crisp shadow
    const L = sun.current;
    if (L) {
      L.target.position.copy(tmp.eng.position);
      L.position.copy(tmp.eng.position).add(_b.set(-14, 22, -18));
      L.target.updateMatrixWorld();
    }

    // words on screen
    const ui = shared.ui.current;
    (Object.keys(SHOW) as (keyof typeof SHOW)[]).forEach((key) => {
      const el = ui[key];
      if (!el) return;
      const o = opacityFor(SHOW[key], S.p);
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - o) * (S.p > (SHOW[key][1] + SHOW[key][2]) / 2 ? -24 : 24)).toFixed(1)}px, 0)`;
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
    });
    if (ui.map) ui.map.style.setProperty('--prog', String(Math.min(1, Math.max(0, (trainU(S.p) - 0.012) / (STATIONS[3].u - 0.012)))));
    if (ui.map) {
      const here = stationAt(S.p);
      ui.map.querySelectorAll('[data-i]').forEach((d) => d.classList.toggle('here', Number((d as HTMLElement).dataset.i) === here));
      ui.map.querySelectorAll('[data-i]').forEach((d) => d.classList.toggle('past', trainU(S.p) >= STATIONS[Number((d as HTMLElement).dataset.i)].u - 0.001));
    }

    // sound: chuffs follow the speed, a whistle on leaving and arriving
    sound.train(S.speed);
    const here = stationAt(S.p);
    if (here !== tmp.station) {
      if (tmp.station !== -2 && Math.abs(S.p - target) < 0.2) sound.whistle(here === -1);
      tmp.station = here;
    }
  }, -1);
  return null;
}

// ---------------------------------------------------------------- everything together
export default function Scene({ shared }: { shared: Shared }) {
  const { gl, size } = useThree();
  const mobile = size.width < 760;
  const sun = useRef<THREE.DirectionalLight>(null);
  const modelUrl = useModelUrl();
  const st = useRef<State>({ p: 0, s: 0, ds: 0, speed: 0, t: 0, engine: new THREE.Object3D(), wagons: [] });
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return tex;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  useEffect(() => {
    if (sun.current) { const L = sun.current; L.shadow.camera.left = -6; L.shadow.camera.right = 6; L.shadow.camera.top = 6; L.shadow.camera.bottom = -6; L.shadow.camera.updateProjectionMatrix(); }
  }, []);

  return (
    <>
      <hemisphereLight args={['#F2F3E4', '#4C6E4F', 1.15]} />
      <directionalLight ref={sun} color="#FFEFD2" intensity={2.6} castShadow
        shadow-mapSize-width={mobile ? 1024 : 2048} shadow-mapSize-height={mobile ? 1024 : 2048}
        shadow-camera-near={1} shadow-camera-far={80} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <Land mobile={mobile} />
      <Suspense fallback={null}>
        {modelUrl && <Train st={st} env={env} url={modelUrl} />}
      </Suspense>
      <Director shared={shared} st={st} sun={sun} />
    </>
  );
}
