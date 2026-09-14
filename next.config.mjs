/** @type {import('next').NextConfig} */
// NOTE: `output: 'export'` is intentionally NOT set. Static export is incompatible
// with the server-side admin API routes in /api/admin/*. See docs/admin-api.md.
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
};
export default nextConfig;
