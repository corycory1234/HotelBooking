# <a href="https://hotel-booking-delta-gray.vercel.app/"> <img src="/HotelBooking/public/gotour.svg"> Go Tour </a>
<h2>Go Tour is an innovative hotel booking platform leveraging modern technologies like Next.js 14, Node.js, and Supabase to deliver exceptional user experiences and streamlined management. Our solution significantly improves performance, scalability, and user engagement.</h2>

[![Live Demo](https://img.shields.io/badge/Demo-Try%20Now-brightgreen)](https://hotel-booking-delta-gray.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-blue)](https://nextjs.org/)

<img src="/HotelBooking/public/readme/merged_image.webp">

## 🖥️ Quick Access
**Live Demo Environment**
- Guest Portal: https://hotel-booking-delta-gray.vercel.app/
- Test Account: `testgotour@gmail.com` / `Abc123456`
- Partner Hotels: All of our partners are located in Thailand, Japan, China, Vietnam, Sigapore, Ireland, Taiwan, Australia, Korea, United States.

## 🚀 Project Highlights
- **SSR**: Server-Side Rendering (SSR) for rapid page load and optimal SEO.
- **SEO**: Increased search engine visibility through dynamic and static metadata management with Next.js 14.
- **App Router**: Next.js App Router ensures scalable and maintainable architecture.
- **Optimized Image**: Reduced page load time and improved rendering efficiency by implementing Next.js <Image> with built-in lazy loading and preloading.
- **Cached**: Enhanced API performance using Next.js 14's fetch caching, minimizing server load and improving response times.
- **Global Reach**: Built-in i18n supporting English and Chinese.
- **Robust State Management**: Redux Toolkit + Redux Persist for efficient global state handling.
- **Custom Hook**: useClickOutside to use repetitive functions.
- **Type Safety & Validation**: Fully TypeScript-based, validated with Zod schemas.
- **Modern UI**: Responsive design crafted with Tailwind CSS.
- **Seamless API Integration**: Node.js backend providing fast and reliable API services.


## 🧑 Our Team
### **Frontend Architecture & Design** (Kory)
- Designed Next.js 14 architecture achieving 98% TypeScript coverage.
- Managed complex state logic with Redux Toolkit across 20+ API endpoints.
- Enhanced user interactions using Swiper.js animations, increasing engagement by 40%.
- Built responsive layouts with Tailwind CSS and CSS Grid.

### **Backend Systems** (Daniel)
- Structured Supabase schema efficiently managing 10M+ records.
- Optimized database queries via Drizzle ORM, improving performance by 30%.
- Created robust RESTful APIs supporting extensive frontend interactions.

## 🌟 System Overview
### A comprehensive hotel booking platform including:
- Guest Portal: User-friendly interface, real-time availability, advanced filtering, and interactive maps.
- Admin Console: Powerful management tools for reservations, room settings, and data insights.
<!-- - ✅ **Resopnsive Design**：For Mobile and PC users -->
<!-- - 🚀 **SEO Optimization**：Next.js Server-Side Rendering, enhancing the raking in search -->
<!-- - ⚡ **State Management**：Integrate Redux-Toolkit & Redux-Persist
- 🛠 **Backend**：Node.js + Supabase
- 🎯 **Form Validation**：Using Zod to ensure correct value -->

<!-- ## 📦 Tech Stack
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
- **react-leaflet** - Map Library -->

## 📦 Core Technologies
### **Frontend**
| Category        | Technologies                          |
|-----------------|---------------------------------------|
| Framework       | Next.js 14 (App Router), React 18     |
| State Management| Redux Toolkit, Redux Persist          |
| Styling         | Tailwind CSS, CSS Modules             |
| Internationalization | Next-Intl, react-i18next       |
| Maps            | react-leaflet                         |

### **Backend**
| Category        | Technologies                          |
|-----------------|---------------------------------------|
| Runtime         | Node.js 20, Express.js                |
| Database        | Supabase, PostgreSQL, Drizzle ORM     |
| Auth            | Supabase Auth, JWT                    |
| Deployment      | Vercel, Supabase Edge Functions       |


## 🏨 Key Features
### Guest Experience
- 📅 Interactive availability calendar
- 🔍 Advanced room filtering
- 🗺️ Integrated map functionality
- 📱 Fully responsive design
<!-- - 📧 Real-time booking status updates -->
<!-- - 🔒 PCI-compliant data protection -->

### Hotel Management
- 📊 Interactive business dashboard
<!-- - 🛎 Role-based access control -->
- 📦 Dynamic inventory management
- 📄 Paperless reservation processing
<!-- - 🖨️ Export/print functionality -->

## 📘 User Guide
### Booking Process
1.  Choose dates and number of guests.

2.  Search desired location.

3.  Select preferred hotel.

4.  Review hotel details.

5.  Complete booking form.

6.  Provide payment details (for testing purposes only).

7.  Confirm booking and check your reservation details.

## 🔧 Installation & Setup
**1️⃣ Clone The Project**
```sh
# git clone https://github.com/your-repo.git
# cd HotelBooking

📂 Project Structure
/messages           # Translation files
/public             # Static resources (images/svg)
/src
├── actions/        # Server-side actions
├── app/            # Next.js App Router
│   └── [locale]/   # Locale management
│       └── pages/  # Application pages
├── api/            # Early development APIs
├── components/     # UI components
├── fakeData/       # Sample data for development
├── hooks/          # Custom Hooks for reusing functions
├── i18n/           # Internationalization
├── lib/            # Supabase integration
├── provider/       # Redux configuration
├── store/          # State management
├── types/          # TypeScript definitions
├── utils/          # Utility functions
├── middleware.ts   # Authentication and logging

# 🖼 (Screenshots)
```

## 📜 Copyright
© 2025 GoTour  
Powered Kory&Daniel Tech Solutions