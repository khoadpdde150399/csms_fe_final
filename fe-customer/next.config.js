/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                // Cấu hình cho backend của bạn
                hostname: process.env.BASE_BACKEND_URL
            },
            {
                // Thêm cấu hình cho Google Images
                hostname: 'lh3.googleusercontent.com',
            }
        ]
    }
};

module.exports = nextConfig;
