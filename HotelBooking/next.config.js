// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// @ts-nocheck
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // 2. 確保在 next.config.js 中添加後端 API 的環境變數：
  env: {
    BACKEND_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  },
  // 3. Optimize webp from Supabase by Next.js - <Image> 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'szcxaoaaxbnvmbclggyk.supabase.co',
        port: '',
        pathname: "/storage/v1/object/public/hotel-images/hotels/**"
      }
    ]
  }

  // 2.
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/:path*`,
  //       // destination: 'https://hotel-booking-api-iota.vercel.app/api/v1/:path*'
  //     }
  //   ]
  // }
}

module.exports = withNextIntl(nextConfig);
