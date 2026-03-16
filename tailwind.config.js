/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",   // chỉnh ở đây
        "2xl": "1526px" // giữ max 1200
      },
    },
    extend: {

    },
  },
  plugins: [],
};

