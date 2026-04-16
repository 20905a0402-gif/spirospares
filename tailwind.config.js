/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ev: "#00BFFF",
        evAccent: "#00A3FF",
        carbon: "#f8fafc",
        matte: "#ffffff",
        ballistic: "#e2e8f0",
        danger: "#C8102E",
        eco: "#00A86B"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(15, 23, 42, 0.08)",
        ev: "0 8px 25px rgba(0, 191, 255, 0.35)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 0.6s ease-out both"
      }
    }
  },
  plugins: []
};