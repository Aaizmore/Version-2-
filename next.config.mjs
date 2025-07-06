/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xzvnnnuyfiigoawnhfsi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental features for better compatibility
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
