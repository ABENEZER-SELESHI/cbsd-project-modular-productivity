/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui-components', '@repo/utils', '@repo/feature-x', '@repo/feature-y'],
};

module.exports = nextConfig;
