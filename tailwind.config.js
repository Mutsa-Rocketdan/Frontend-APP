/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff6a00',
        'primary-dark': '#e05e00',
        'primary-light': '#fff0e6',
        'bg-light': '#f8f7f5',
        'bg-dark': '#23170f',
        'surface': '#ffffff',
      },
      fontFamily: {
        sans: ['Lexend', 'Noto Sans KR', 'sans-serif'],
        korean: ['Noto Sans KR', 'sans-serif'],
      },
      maxWidth: {
        app: '480px',
      },
    },
  },
  plugins: [],
};
