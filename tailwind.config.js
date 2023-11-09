module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      primary: 'arial ',
      secondary: 'Trebuchet MS',
      lancelot: 'Lancelot '
    },
    container: {
      padding: {
        DEFAULT: '15px'
      }
    },
    screens: {
      sm: '420px',
      md: '768px',
      lg: '960px',
      xl: '1200px'
    },
    extend: {
      colors: {
        primary: '#0a0a0a',
        accent: '#B809C3'
      }
    }
  },
  plugins: []
}
