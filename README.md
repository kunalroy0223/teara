# Teara website

The Teara company website: six pages, a 3D scroll journey on the Home page,
and a soundscape of the Darjeeling hills generated in the browser.

Built with Next.js 14 (App Router, static export), React Three Fiber, GSAP
ScrollTrigger, Lenis and Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

`out/` is a plain static site. It can go on Vercel, Netlify, GitHub Pages,
Cloudflare Pages or any ordinary web host. On Vercel, import the repository
and keep the defaults.

`npm run preview:build` makes a version whose links and files are all
relative (`about.html` instead of `/about`), so it also works from a
sub-folder. Use the normal build for the live site.

## Where things are

| Path | What it is |
| --- | --- |
| `app/` | One folder per page. `layout.tsx` holds the header and footer, `template.tsx` the page transition, `globals.css` all styles. |
| `components/journey/` | The Home page journey. `Journey.tsx` is the page part (words, station map, loader); `Scene.tsx` is the 3D part (train, wagons, steam, camera). |
| `lib/journey/world.ts` | The generated world: track, hills, tea terraces, trees, mist, snow peaks, stations. |
| `lib/journey/timeline.ts` | The story over the scroll: where the train stops, every camera shot, when each block of words shows. Tune the journey here. |
| `lib/sound.ts` | The soundscape: wind, birds, a distant flute, a singing bowl, and the train's chuffs and whistle. No audio files. |
| `lib/pageScene.js` | The 3D layers behind the inner pages (leaf particles, serum bottle, seal, people). |
| `lib/site.ts` | Page list, contact details, social links. |
| `public/models/dhr-b-green.glb` | The train, cut down from the original model to the green B-class engine and compressed (655 KB). |
| `model-src/` | The original model files, kept for credit and re-export. `npm run model` rebuilds the .glb from them. |

## Before going live

- **Forms** (the early list on The Serum, contact on People) check the fields
  and thank the visitor, but send nothing yet. Connect a form service such as
  Formspree, Basin or Netlify Forms in `components/PreviewForm.tsx`.
- **Founder LinkedIn links**: add each URL in the `TEAM` list in
  `app/people/page.tsx` and the icon appears on that card.
- **Fonts**: Rozha One and Cormorant Garamond stand in for Giaza and The
  Seasons, which are licensed fonts. If Teara has web licences for them, add
  the font files and change `--display` and `--tagline` in `globals.css`.

## Credits

Train model: "Darjeeling Class B locomotives"
(https://sketchfab.com/3d-models/darjeeling-class-b-locomotives-fbaec6d99aa74878983ba1761c285934)
by drelephantes (https://sketchfab.com/smsouvikmondal425), licensed under
CC BY 4.0 (http://creativecommons.org/licenses/by/4.0/). Simplified for the
web. This credit must stay on the site; it is in the footer.
