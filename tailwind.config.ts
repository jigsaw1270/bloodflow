module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#624E88',
        'lavender-purple': '#8967B3',
        'rose-pink': '#CB80AB',
        'pale-yellow': '#E6D9A2',
      },
      fontFamily: {
        clash: ['clash', 'sans-serif'],
        telma: ['telma', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: [],
  },
  plugins: [
    require('daisyui'),
  ],
}; 
