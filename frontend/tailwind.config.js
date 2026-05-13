/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F1F3D",
          mid: "#1A3260",
          light: "#2B4B8C",
        },
        amber: {
          DEFAULT: "#F5A623",
          light: "#FFC85A",
          pale: "#FFF7E6",
        },
      },
    },
  },
  plugins: [],
};
