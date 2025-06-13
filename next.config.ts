import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [new URL('https://flagcdn.com/**')],
    },
};

export default nextConfig;
