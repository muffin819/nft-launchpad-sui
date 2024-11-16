import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'neopixel': ['neopixel', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0087ff",
          100:"#0058ff"
        },
        dark:{
          DEFAULT:"#171717"
        }
      },
      scale: {
        '101': '1.01',
        '99': '0.99',
      },
      backgroundImage: {
        'hero': "url('/assets/img/hero-back.png')",
        'sui': "url('/assets/img/sui.png')",
        'modal': "url('/assets/img/modal-back.png')",
      }
    },
  },
  plugins: [nextui()]
};
export default config;
