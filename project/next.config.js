/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
        domains: ['images.pexels.com'],
        formats: ['image/webp', 'image/avif'],
    },
    compress: true,
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, max-age=0',
                    },
                ],
            },
            {
                source: '/((?!api).*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    webpack: (config, { isServer }) => {
        // Disable TerserPlugin to prevent WebAssembly memory allocation errors
        if (!isServer) {
            config.optimization.minimizer = [];
        }
        return config;
    },
};

module.exports = nextConfig;
