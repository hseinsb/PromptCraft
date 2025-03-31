/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideUp: "slideUp 0.4s ease-out",
        slideDown: "slideDown 0.4s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      colors: {
        // Adding a darker level for dark mode
        gray: {
          750: "#2a3441",
        },
      },
      transitionDuration: {
        400: "400ms",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
  safelist: [
    // Add common utility classes used in @apply directives
    "px-4",
    "py-2",
    "py-3",
    "rounded-lg",
    "font-medium",
    "transition-all",
    "duration-300",
    "transform",
    "-translate-y-0.5",
    "shadow-md",
    "translate-y-0",
    "bg-purple-600",
    "hover:bg-purple-700",
    "active:bg-purple-800",
    "text-white",
    "bg-gray-700",
    "hover:bg-gray-600",
    "active:bg-gray-500",
    "text-gray-200",
    "bg-red-600",
    "hover:bg-red-700",
    "active:bg-red-800",
    "text-white",
    "bg-gray-800",
    "rounded-xl",
    "overflow-hidden",
    "border",
    "border-gray-700",
    "ring-2",
    "ring-purple-500",
    "ring-opacity-50",
    "border-transparent",
  ],
};
