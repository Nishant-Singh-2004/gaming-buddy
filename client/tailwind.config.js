/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gamer dark palette
        gunmetal:  "#1a1a2e",
        midbg:     "#16213e",
        cardbg:    "#0f3460",
        accent:    "#e94560",
        accentsoft:"#ff6b6b",
        textprim:  "#eaeaea",
        textsec:   "#a0aec0",
      },
      fontFamily: {
        gaming: ["'Rajdhani'", "sans-serif"],
        body:   ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}