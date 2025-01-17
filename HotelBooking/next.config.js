// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // 1. 確保在 next.config.js 中添加後端 API 的環境變數：
  env: {
    BACKEND_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  },

  // 2.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/:path*`
      }
    ]
  }
}

module.exports = nextConfig