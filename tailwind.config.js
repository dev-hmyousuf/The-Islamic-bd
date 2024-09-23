/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBG: '#F8EBD5',
        cardBg: '#FFF5E4',
      },
      fontFamily: {
        Amiri_Quran: ['Amiri-Quran'],
        Bangla: ['Bangla']
      },
    },
  },
  plugins: [],
}
