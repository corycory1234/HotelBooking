# Go Tour - Hotel Booking Platform

## Project Overview
Go Tour is a comprehensive hotel booking platform built with modern technologies, featuring both guest booking capabilities and admin management tools.

**Live Demo**: https://hotel-booking-delta-gray.vercel.app/
**Test Account**: `testgotour@gmail.com` / `Abc123456`

## Architecture

### Frontend (Next.js 14)
- **Location**: `/HotelBooking/` directory
- **Framework**: Next.js 14 with App Router and SSR
- **Language**: TypeScript (98% coverage)
- **Styling**: Tailwind CSS with responsive design
- **State Management**: Redux Toolkit + Redux Persist
- **Authentication**: Supabase Auth (Google OAuth integration)
- **Testing**: Vitest for unit tests
- **Internationalization**: next-intl (English/Chinese support)

### Backend (Node.js)
- **Location**: `/server/` directory  
- **Framework**: Node.js with Express
- **Database**: Supabase with Drizzle ORM
- **Authentication**: Supabase Auth integration
- **API**: RESTful APIs

### Key Features
1. **Guest Portal**: Hotel search, booking, filtering, interactive maps
2. **Admin Console**: Reservation management, room settings, analytics
3. **Multi-language Support**: English and Chinese
4. **Responsive Design**: Mobile-first approach
5. **Real-time Data**: Live availability and pricing
6. **Performance Optimized**: Image optimization, caching, lazy loading

## Branch Structure
- `master`: Main production branch
- `front`: Frontend-focused development (current - Supabase direct auth)
- `back`: Backend-focused development (traditional OAuth flow)
- `dev`: Development branch
- Various `dev-{name}` branches for individual contributors

## Authentication Flow
Currently using **Supabase direct authentication** (front branch):
- Frontend handles Google OAuth directly via `supabase.auth.signInWithOAuth()`
- Session management through Supabase
- Callback handling at `/auth/callback`
- Redux state management for user sessions

## Development Commands
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run Vitest tests

# Backend  
npm run start        # Start server
npm run dev          # Development mode
```

## Key Technologies
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Redux Toolkit, Supabase
- **Backend**: Node.js, Express, Supabase, Drizzle ORM
- **Deployment**: Vercel (frontend), backend deployment TBD
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet with react-leaflet
- **UI Components**: Custom components with NextUI integration
- **Animations**: Framer Motion, Swiper.js

## File Structure Highlights
- `/src/app/[locale]/`: Next.js App Router with i18n
- `/src/components/`: Reusable React components
- `/src/store/`: Redux store configuration
- `/src/lib/`: Utility functions and configurations
- `/server/src/`: Backend API implementation

## Current Focus
The project is actively developed with focus on:
- Supabase authentication integration
- Multi-language support
- Performance optimization
- Responsive design improvements
- State management optimization

## Team
- **Kory**: Frontend Architecture & Design (Next.js, TypeScript, Redux)
- **Daniel**: Backend Systems (Supabase, API design, database optimization)