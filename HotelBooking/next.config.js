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
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  }
}

module.exports = nextConfig