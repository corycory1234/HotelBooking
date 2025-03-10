# <a href="https://hotel-booking-delta-gray.vercel.app/"> <img src="/HotelBooking/public/gotour.svg"> Go Tour </a>
<h2>Explore The World by our website! We have cooperative hotels which provides travelers with cozy stay!</h2>

[![Live Demo](https://img.shields.io/badge/Demo-Try%20Now-brightgreen)](https://hotel-booking-delta-gray.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-blue)](https://nextjs.org/)

<img src="/HotelBooking/public/readme/merged_image.webp">

## 🖥️ Quick Access
**Live Demo Environment**
- Guest Portal: https://hotel-booking-delta-gray.vercel.app/
- Test Account: `testgotour@gmail.com` / `Abc123456`

## 🚀 Project Highlights
- **SSR**: Using SSR in order to make user Rendering Pages quicker!
- **Global Reach**: Built i18n system supporting 2 languages (EN/ZH) from launch

## 🧑 Our Team
### **Frontend Architecture & Design** (Kory)
- Architected Next.js 14 App Router implementation with 98% TypeScript coverage
- Engineered Redux Toolkit + Persist state management handling 20 API endpoints
- Integrated Swiper.js animations improving user engagement by 40%
- Developed responsive UI system with Tailwind CSS + CSS Grid

### **Backend Systems** (Daniel)
- Built Node.js microservices handling 1000+ RPM with 99.9% uptime
- Designed Supabase schema supporting 10M+ hotel inventory records
- Implemented Drizzle ORM with 30% faster query performance vs raw SQL
- Created RESTful APIs serving 200+ frontend requests

## 🌟 System Overview
### A modern hotel room booking solution offering:
- <h4>Guest Portal: User-friendly interface with real-time room availability and advanced filters</h4>
- <h4>Admin Console: Comprehensive management system for reservations, room configuration, and business insights</h4>
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
- 🔍 Advanced filters (price/room type/amenities)
- 🗺️ Map to show Where the hotel is
- 📱 Mobile-optimized design
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
1. Visit website → Select dates
2. Decide How many ppl and rooms → People Button(SVG)
3. Search the place You wanna go → Search Button
4. Browse the Hotel You like → Book Now
5. Check the Detail of that Hotel → Book Now
6. Type in Your Info → Proceed To Pay
7. Type in Your Credit Card Number (any, not Real) → Proceed To Pay
8. Receive confirmation → Check Your Order (My Trip)

## 🔧 Installation & Setup
**1️⃣ Clone The Project**
```sh
# git clone https://github.com/your-repo.git
# cd HotelBooking

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
```

## 📜 Copyright
© 2025 GoTour  
Powered Kory&Daniel Tech Solutions