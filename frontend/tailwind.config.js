/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      default: '#4B4B4B',
      brown: '#C7C1BB',
      mint: '#D5E0D8',
      red: '#F96A6A',
      emotion: {
        5: '#99B384',
        4: '#B8D3A2',
        3: '#F5E096',
        2: '#E9AAAA',
        1: '#DE8080',
      },
    },
    extend: {},
  },
  plugins: [],
};
