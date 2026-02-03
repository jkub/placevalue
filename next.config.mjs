/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/placevalue',
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;