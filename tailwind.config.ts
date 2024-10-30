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
        'light-green' : '#E9EED9',
        'red-dark' : '#740938',
        'red-semidark' : '#CC2B52',
        'skyblue' : '#37AFE1',
      },
      fontFamily: {
        clash: ['clash', 'sans-serif'],
        telma: ['telma', 'sans-serif'],
      },
      backgroundImage: {
        'lavender-pink-gradient': 'linear-gradient(to right, #8967B3, #CB80AB)',
        'white-skyblue': 'linear-gradient(to top, #D1E9F6, #37AFE1)',
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
