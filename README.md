# <a href="https://hotel-booking-delta-gray.vercel.app/"> <img src="/HotelBooking/public/gotour.svg"> Go Tour </a>

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
cd HotelBooking

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

# 🖼 (Screenshots)

# 🚀 Deployment

# npm run build
# vercel deploy 
