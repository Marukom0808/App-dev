
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#facc15', dark: '#d4b015', light: '#fee680' },
        darkbg: '#0f172a', lightbg: '#f7fafc'
      },
      boxShadow: { soft: '0 6px 18px rgba(0,0,0,.08)' },
      borderRadius: { xl: '14px' },
      keyframes: {
        glow: { '0%,100%': { textShadow: '0 0 0 rgba(250,204,21,0)' }, '50%': { textShadow: '0 0 24px rgba(250,204,21,.65)' } },
        fadein: { '0%': { opacity: 0 }, '100%': { opacity: 1 } }
      },
      animation: { glow: 'glow 2s ease-in-out infinite', fadein: 'fadein .6s ease-in-out 1' }
    }
  },
  plugins: []
}
