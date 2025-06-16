/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/letter-generator/:path*',
                destination: '/letter-generator/:path*',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/letter-generator/:path*',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'text/html',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig; 