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
  },
  async rewrites() {
    return[
      {
        source: '/api/:path*',
        destination: 'https://exp.host/--/api/v2/:path*'
      }
    ]
  }
};

export default nextConfig;
