This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

# ("/HotelBooking/public/Logo.svg") Go Tour

<img src="/HotelBooking/public/readme/merged_image.webp"> 

## 🌟 特色功能 (Features)
- ✅ **響應式設計**：使用 Tailwind CSS 進行 UI 開發
- ⚡ **高效狀態管理**：整合 Redux-Toolkit & Redux-Persist
- 🛠 **後端支援**：Node.js + Supabase
- 🎯 **表單驗證**：使用 Zod 確保數據正確性

## 📦 技術棧 (Tech Stack)
- **前端**：Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **狀態管理**：Redux-Toolkit, Redux-Persist
- **後端**：Node.js, Supabase
- **表單驗證**：Zod

## 🔧 安裝與運行 (Installation & Setup)
**1️⃣ 克隆專案**
```sh
git clone https://github.com/your-repo.git
cd your-repo

📂 專案結構 (Project Structure)

/src
├── components/     # UI 組件
├── hooks/          # 自定義 Hook
├── pages/          # Next.js 頁面
├── redux/          # Redux store
├── styles/         # Tailwind CSS 全局樣式
├── utils/          # 公用函數
├── app/            # Next.js App Router 結構
└── public/         # 靜態資源

🖼 預覽 (Screenshots)

🚀 部署 (Deployment)

npm run build
vercel deploy 