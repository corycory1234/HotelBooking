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
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': "#07AEAF",
        'secondary': '#FE9900',
        'gray': "#9295A3",
        'softGray': "#F2F2F2",
        'red': "#DC3811",
        'blue': "#3266CC"
      },
      screens: {
        sm: '375px',
        md: '576px',
        lg: '1024px'
      },
      backgroundImage: {
        'home-explore': "url(/home/Home_Explore_BG.png)",
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
        'slide-up': 'slideUp .3s ease-out'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui],
} satisfies Config;