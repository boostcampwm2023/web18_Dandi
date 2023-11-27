/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /(bg|text|font|w|h)-+/,
    },
    {
      pattern: /btn-(default|delete|normal|large)/,
    },
  ],
  theme: {
    colors: {
      default: '#4B4B4B',
      brown: '#C7C1BB',
      gray: '#D9D9D9',
      mint: '#B5C6B0',
      red: '#F96A6A',
      white: '#FFFFFF',
      blue: '#6AB4F9',
      emotion: {
        0: '#EDEDED',
        1: '#DE8080',
        2: '#E9AAAA',
        3: '#F5E096',
        4: '#B8D3A2',
        5: '#99B384',
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
