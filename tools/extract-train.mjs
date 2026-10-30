// Keeps only the green B-class engine from the Sketchfab file and compresses it for the web.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { getBounds, prune, dedup, weld, quantize, meshopt, flatten, join } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read('model-src/scene.gltf');
const root = doc.getRoot().listNodes().find((n) => n.getName() === 'GLTF_SceneRootNode');
for (const n of root.listChildren()) {
  const b = getBounds(n);
  if (Math.abs((b.min[0] + b.max[0]) / 2) > 5) n.dispose();
}
await doc.transform(prune(), dedup(), weld(), quantize(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write('public/models/dhr-b-green.glb', doc);
console.log('done');
