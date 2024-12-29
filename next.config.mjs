/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'binodpfjvufvqpxslzhd.supabase.co/**',
        port: '',
        search: '',
      },
    ],
  }
};

export default nextConfig;
