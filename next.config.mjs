/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: "export" to enable server-side rendering for cPanel deployment
  // output: "export", // Commented out for Node.js server deployment
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  swcMinify: false,
};

export default nextConfig;