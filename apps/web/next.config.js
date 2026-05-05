/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui-components', '@repo/utils', '@repo/feature-x', '@repo/feature-y'],
  experimental: {
    // Needed to resolve .ts/.tsx from workspace packages
    externalDir: true,
  },
};

module.exports = nextConfig;
