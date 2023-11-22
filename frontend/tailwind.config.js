/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      default: '#4B4B4B',
      white: '#FFF',
      brown: '#C7C1BB',
      gray: '#D9D9D9',
      mint: '#B5C6B0',
      red: '#F96A6A',
      white: '#FFFFFF',
      blue: '#6AB4F9',
      emotion: {
        null: '#EDEDED',
        terrible: '#DE8080',
        bad: '#E9AAAA',
        soso: '#F5E096',
        good: '#B8D3A2',
        excellent: '#99B384',
      },
    },
    extend: {
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
