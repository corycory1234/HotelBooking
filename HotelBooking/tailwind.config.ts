import type { Config } from "tailwindcss";

// Next UI for 價錢-Range Slider
const {nextui} = require("@nextui-org/theme"); 

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
    "./node_modules/@nextui-org/theme/dist/components/slider.js",
    // "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    'node_modules/swiper/swiper-bundle.min.css',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': "#07AEAF",
        'secondary': '#FE9900',
        'gray': "#9295A3",
        'softGray': "#D3D3D3",
        'strokeGray': "#EBF4FF",
        'lightGray': "#f9f9f9",
        'customRed': "#DC3811",
        'blue': "#3266CC"
      },
      screens: {
        sm: '375px',
        md: '576px',
        lg: '1024px'
      },
      backgroundImage: {
        'home-explore': "url(/home/Home_Explore_BG.png)",
        'home-explore-desktop': "url(/home/home_explore_bg_desktop.webp)",
        'email': "url(/account/Email.svg)"
      },
      keyframes: {
        // 1.Sort 排序動畫
        slideUp: {
          '0%': { transform: 'translateY(100%)', },
          '100%': { transform: 'translateY(0)', },
        }
      },
      animation: {
        // 1.Sort 排序動畫
        'slide-up': 'slideUp .3s ease-out',
        "animate-spin": "spin 1s linear infinite",
        "animate-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui],
} satisfies Config;