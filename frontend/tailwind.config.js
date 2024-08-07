/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "loop-scroll": 'loop-scroll 50s linear infinite',
      },
      keyframes: {
        "loop-scroll": {
          from: { transform: 'translateX(0%)'},
          to : { transform: 'translateX(-100%)' },
        },
      },
    },
    screens:{
      'sm': { max: '640px' },
      // => @media (max-width: 640px) { ... }

      'md': { max:'768px' },
      // => @media (max-width: 768px) { ... }

      'lg': { max:'1024px' },
      // => @media (max-width: 1024px) { ... }
    },
    colors:{
      "blue": "#1a1e49",
      "gray": "#38383b",
      'altBlack': '#262525',
      "lime": '#32CD32',
      "white": '#FFFFFF',
      "black": '#000000',
      "red": '#FF0000'
    },
    extend: {
      backgroundImage:{
        'my-image':"url(/src/assets/Nozzle.jpg)",
        'my-gif': "url(/src/assets/EcoFuel1.gif)",
        'nozzle': "url(/src/assets/CarNozzle.jpg)"
      }
    },
  },
  plugins: [],
}