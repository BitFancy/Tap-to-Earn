/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      clipPath: {
        polygon:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", // Custom polygon shape
      },
      animation: {
        fadeouttopright: 'fade-out-top-right 0.3s ease-in-out 0.2s 1',
      },
      backgroundImage: {
        'radial-ellipse': 'radial-gradient(circle at center, #E39431, transparent)',
      },
    },
  },
  plugins: [],
};
