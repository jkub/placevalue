/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  /**
   * IMPORTANT FOR GITHUB PAGES:
   * If your site is at https://<username>.github.io/<repo-name>/
   * you MUST uncomment the line below and set it to your repository name.
   */
  basePath: '/placevalue',
  reactStrictMode: true,
};

export default nextConfig;