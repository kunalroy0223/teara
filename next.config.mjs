/** @type {import('next').NextConfig} */
const nextConfig = {
  // A fully static site: `npm run build` writes plain files to out/,
  // which any static host (Vercel, Netlify, GitHub Pages, cPanel) can serve.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ['three'],
};
export default nextConfig;
