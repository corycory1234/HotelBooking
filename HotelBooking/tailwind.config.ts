import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': "#07AEAF",
        'secondary': '#FE9900'
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1024px'
      },
      backgroundImage: {
        'home-explore': "url(/home/Home_Explore_BG.png)"
      }
    },
  },
  plugins: [],
} satisfies Config;