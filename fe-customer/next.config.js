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
                // Cấu hình cho Google Images
                hostname: 'lh3.googleusercontent.com',
            },
            {
                // Thêm cấu hình cho Cloudinary
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dbmrh7gyn/**', // thay dbmrh7gyn bằng cloud name của bạn
            }
        ]
    }
};

module.exports = nextConfig;