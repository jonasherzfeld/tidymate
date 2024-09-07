/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // To use external images, add here the domains you want to allow.
            {
                hostname: "www.example.com",
                protocol: "https"
            }
        ]
    }
};

export default nextConfig;
