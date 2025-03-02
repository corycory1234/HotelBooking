<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->


# <img src="/HotelBooking/public/gotour.svg"> Go Tour

<img src="/HotelBooking/public/readme/merged_image.webp">

<h2>Explore The World by our website! We have cooperative hotels which provides travelers with cozy stay!
</h2> 

## 🌟 Features
- ✅ **Resopnsive Design**：For Mobile and PC users
- 🚀 **SEO Optimization**：Next.js Server-Side Rendering, enhancing the raking in search
<!-- - ⚡ **State Management**：Integrate Redux-Toolkit & Redux-Persist
- 🛠 **Backend**：Node.js + Supabase
- 🎯 **Form Validation**：Using Zod to ensure correct value -->

## 📦 Tech Stack
### 🔹 Frontend
- **Next.js 14**：App Router
- **React 18** : Frontend Framework
- **Reduxt Toolkit & Redux Persist**: State Management
- **Typescript** : Syntax For Types
- **Tailwind CSS**：CSS Framework
- **Backend**：Node.js, Supabase
- **Form Validation**：Zod

### 🔹 Backend
- **Node.js** - Express.js, Framework 
- **Supabase & Drizzle** - BaaS（Verification、Database、API）

### 🔹 Others
- **Vercel** - Deployment Platform
- **Next-Intl** - i18n for Locale Prefix & Translation
- **Zod** - Form Validation
- **Swiper** - Carousel Library
- **react-leaflet** - Map Library

## 🔧 Installation & Setup
**1️⃣ Clone The Project**
```sh
git clone https://github.com/your-repo.git
cd your-repo

📂 Project Structure
/messages           # Translation
/public             # Static Sources(webp & svg)
/src
├── actions/        # Server Action
├── app/            # App Router
  ├── [locale]/     #  Locale Prefix & Translation
    ├── pages/      # Next.js page
├── api             # Some Apis during early development
├── components/     # UI Components
├── fakeData/       # A bit data inside
├── i18n/           # Request and i18n-Routing
├── lib             # Connecting supabase
├── provider        # Setting for Redux-Toolkit in Next.js 14
├── store           # Redux Toolkit & Redux Persist
├── types           # Syntax For Types
├── utils/          # Utility Functions
├── middleware.ts   # For Processing auth, logging, and so on

# 🖼 預覽 (Screenshots)

# 🚀 Deployment

# npm run build
# vercel deploy 
