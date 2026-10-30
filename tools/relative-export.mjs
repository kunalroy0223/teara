// Makes the exported site work from any folder (or a file preview), not just
// a web root: every /_next/ path becomes relative to the page, and the
// folder is renamed to assets/ because some hosts hide names starting with _.
// Used by `npm run preview:build`. The normal `npm run build` does not need it.
import { readdirSync, readFileSync, writeFileSync, statSync, renameSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
if (existsSync(join(OUT, '_next'))) renameSync(join(OUT, '_next'), join(OUT, 'assets'));
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
let n = 0;
for (const file of walk(OUT)) {
  if (file.endsWith('.html')) {
    const s = readFileSync(file, 'utf8');
    const t = s.replaceAll('"/_next/', '"./assets/').replaceAll('\\"/_next/', '\\"./assets/');
    if (t !== s) { writeFileSync(file, t); n++; }
  }
  // some hosts reject a raw U+FFFD character; write it as an escape instead
  if (file.endsWith('.js')) {
    const s = readFileSync(file, 'utf8');
    if (s.includes('\uFFFD')) { writeFileSync(file, s.replaceAll('\uFFFD', '\\ufffd')); n++; }
  }
  // webpack loads later chunks from its public path; work it out from the
  // address of the runtime script itself instead of assuming the root.
  if (/static[\\/]chunks[\\/]webpack-[^\\/]+\.js$/.test(file)) {
    const s = readFileSync(file, 'utf8');
    const t = s.replace(/\.p="\/_next\/"/, '.p=(function(){var s=document.querySelector(\'script[src*="/static/chunks/webpack"]\');return s?s.src.replace(/static\\/chunks\\/.*$/,""):"/_next/"})()');
    if (t === s) throw new Error('webpack public path not found in ' + file);
    writeFileSync(file, t); n++;
  }
}
// the preview host serves text only, so the model also goes as base64 JSON
const glb = join(OUT, 'models', 'dhr-b-green.glb');
if (existsSync(glb)) writeFileSync(join(OUT, 'models', 'dhr-b-green.json'), JSON.stringify({ glb: readFileSync(glb).toString('base64') }));
console.log(`relative-export: rewrote ${n} files`);
