# Teara homepage scroll performance audit

## Executive summary

The homepage's scroll stutter is most likely caused by the combined cost of a continuously rendered, high-density Three.js scene and multiple layers of scroll/camera easing. This is not primarily a large-model-download problem: the active train model in `public/models/dhr-b-green.glb` is approximately 640 KB. The project generates most of the 3D world in JavaScript at runtime.

This is a source-code audit, not a measured browser profile. The code exposes the following concrete pressure points; the exact contribution of CPU, GPU, compositing, and the visitor's hardware still needs confirmation with a Chrome Performance recording on the target machine.

## Findings in the uploaded version

### 1. The 3D scene rendered continuously during the full homepage journey

`components/journey/Journey.tsx` originally set the Canvas `frameloop` to `always` whenever the 10.5-viewport `.journey` section intersected the viewport. Since the stage is sticky for almost the entire journey, this meant a full-screen WebGL render continued even when the visitor had stopped scrolling.

The scene is not lightweight:

- Desktop tea field: up to 60,000 instances of an icosahedron with 20 faces each (about 1.2 million instance triangles before other scene geometry).
- Desktop trees: up to 1,500 large tree instances.
- Terrain: 230 × 230 subdivisions on desktop.
- Mountain ranges, track geometry, stations, two wagons, a train model, mist sprites and steam sprites.
- Desktop shadow map: 2048 × 2048, with a directional light that follows the train.
- Canvas pixel ratio: up to 1.75, with antialiasing enabled.

That is a substantial, continuously rendered scene to run alongside document scrolling.

### 2. Scroll progress was smoothed more than once

The original scroll path had three successive easing stages:

1. Lenis document interpolation (`lerp: 0.085`) in `components/SmoothScroll.tsx`.
2. A second progress damper (`THREE.MathUtils.damp(..., 2.4, dt)`) in `Director` in `components/journey/Scene.tsx`.
3. Camera position/look interpolation at a factor of 6, plus FOV damping at 4.

This compounds latency. The document, train, copy, and camera can appear to chase one another, especially when reversing scroll direction. It is a direct source-level explanation for the feeling that the 3D scene is behind the user's scroll.

### 3. Per-frame JavaScript work was higher than necessary

In the original `Director` frame callback, the station map used `querySelectorAll()` twice on every frame and toggled classes repeatedly. The train frame callback also allocated a new combined wheel array on every frame and rewrote all 150 cargo instance matrices even when the leaf-to-serum animation was not changing.

These are not as expensive as the main WebGL workload, but they add avoidable main-thread and garbage-collection work during scrolling.

### 4. Initial scene generation also does significant main-thread work

`lib/journey/world.ts` builds terrain, tea instances, trees, rails, and mountain geometry synchronously. This can contribute to a long initial scene setup. It is a separate issue from the steady-state scroll stutter, but can make the first interaction feel delayed while the world is being constructed.

### 5. Secondary compositor items worth profiling later

`app/globals.css` has a fixed full-viewport grain overlay using an SVG `feTurbulence` filter and `mix-blend-mode: multiply`. The scrolled header also applies a 14px `backdrop-filter` blur. These may add compositing cost on some GPUs, but I would not remove the visual treatment without checking a browser trace first.

## Changes applied in the optimized source

- Changed the R3F Canvas to demand rendering. Lenis/ScrollTrigger requests frames while scroll position changes; an idle 24 FPS pulse preserves ambient motion while the journey is visible; rendering stops when the section leaves the viewport.
- Increased Lenis interpolation from `0.085` to `0.12` for a more responsive scroll feel.
- Removed the second progress damper. The camera keeps a faster, shorter interpolation so the 3D camera remains composed without visibly trailing document scroll.
- Capped Canvas pixel ratio at `1.35`.
- Reduced the directional shadow map from 2048² to 1024² desktop / 512² mobile.
- Reduced tea instances to 42,000 desktop / 16,000 mobile; trees to 1,200 / 560; terrain subdivisions to 190 / 128; mist and steam particle counts were reduced moderately.
- Cached station DOM elements and update their state only when the station/past-state changes.
- Cached the combined wagon wheel list rather than allocating it each frame.
- Recompute the cargo instance buffer only while the leaf-to-serum transition changes.

The design intent is to preserve the 3D journey and its scroll choreography while spending less time rendering and keeping the scene closer to the real scroll position.

## Validation status

- TypeScript syntax transpilation passed for all four modified files.
- `git diff --check` passed.
- A complete Next.js production build could not be run from the uploaded archive. The bundled `node_modules/next` is incomplete: `npm run build` fails because `next/server/require-hook` is missing. The local TypeScript CLI is also incomplete (`lib/tsc.js` is missing), and the installed Lenis/Three/R3F packages are missing runtime/type files.
- Reinstalling dependencies was not possible in this environment because the npm registry could not be reached (`EAI_AGAIN`).
- No browser FPS, frame-time, or GPU measurements are claimed. The updated code still needs a production build and a real scroll test on the target laptop/browser.

## How to validate locally

From the extracted project directory, with network access available:

```bash
rm -rf node_modules .next
npm ci
npm run build
npm run dev
```

Then open Chrome DevTools → Performance, record a 5–10 second scroll down and back up over the homepage, and inspect the Frames track, Main thread, and GPU activity. Compare this build with the previous one on the same device and browser.


## Cinematic motion tuning (follow-up)

The performance-optimized build has a separate, deliberately restrained motion profile. These changes aim for a calm, film-like glide without putting a second scroll integrator back into the train progress:

- Lenis interpolation is set to `0.085` (from `0.12`), with wheel/touch multipliers at `0.82` / `1.2`. This softens abrupt wheel input and allows a slightly longer, steadier settle.
- The 3D train progress still follows the single Lenis-smoothed document progress. No second progress damper was added.
- Camera keyframe interpolation uses quintic smootherstep, giving each shot a gentler acceleration and deceleration than cubic smoothstep.
- Camera follow damping is reduced from `14` to `8.5`; FOV damping from `10` to `6.5`; locomotive speed response from `4` to `3.2`. These make camera and train motion feel less abrupt while retaining a defined response when scroll direction reverses.
- In-page station navigation uses a `3.0s` Lenis scrollTo transition.
- Native CSS smooth scrolling is disabled so Lenis remains the single scroll controller.

This is a tuning choice, not a measured performance claim. It should be judged by testing a long downward scroll followed by an immediate upward reversal on the target machine. If the camera feels too delayed relative to the text, raise camera damping slightly (for example `8.5` to `10`) before changing Lenis.
