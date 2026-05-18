/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"], // Using Inter as base for Display
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        border: "rgba(14, 17, 22, 0.06)",
        input: "rgba(14, 17, 22, 0.08)",
        ring: "#5e6ad2",
        background: "#f5f6f8",
        foreground: "#0e1116",
        primary: {
          DEFAULT: "#0e1116",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#5a6273",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#5e6ad2",
          foreground: "#ffffff",
        },
        surface: "#ffffff",
        hairline: "rgba(14, 17, 22, 0.06)",
        ink: {
          DEFAULT: "#0e1116",
          700: "#3a4150",
          500: "#5a6273",
          400: "#7a818f",
          200: "#e6e8ec",
        }
      },
      borderRadius: {
        sm: "5px",
        md: "8px",
        lg: "10px",
        pill: "9999px",
      },
      boxShadow: {
        card: "rgba(14,17,22,0.06) 0 0 0 1px, rgba(14,17,22,0.03) 0 1px 2px",
        button: "rgba(94,106,210,0.18) 0 1px 0 inset",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}