# <a href="https://hotel-booking-delta-gray.vercel.app/"> <img src="/HotelBooking/public/gotour.svg"> Go Tour </a>
<h2>Explore The World by our website! We have cooperative hotels which provides travelers with cozy stay!</h2> 
<img src="/HotelBooking/public/readme/merged_image.webp">
<h2>Frontend: Kory</h2>
<h2>Backend: Daniel</h2>
<h2>Design: Kory</h2>


## 🌟 System Overview
A modern hotel room booking solution offering:
- **Guest Portal**: User-friendly interface with real-time room availability and advanced filters
- **Admin Console**: Comprehensive management system for reservations, room configuration, and business insights
<!-- - ✅ **Resopnsive Design**：For Mobile and PC users -->
<!-- - 🚀 **SEO Optimization**：Next.js Server-Side Rendering, enhancing the raking in search -->
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

## 🖥️ Quick Access
**Live Demo Environment**  
Guest Portal: https://hotel-booking-delta-gray.vercel.app/
Test Account: `testgotour@example.com` / `Abc123456`

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

## 📜 Copyright
© 2025 GoTour  
Powered Kory&Daniel Tech Solutions


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
