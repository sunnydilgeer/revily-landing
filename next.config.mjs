/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional isolated verification output; ordinary dev/build behaviour stays unchanged.
  distDir: process.env.REVILY_BUILD_DIR || '.next',
};

export default nextConfig;
