/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body:    ['Inter',   'system-ui', 'sans-serif'],
      },
      fontSize: {
        'section-label': ['0.6875rem', { letterSpacing: '.08em', fontWeight: '600' }],
        'hero-sub':      ['1rem',      { lineHeight: '1.65',     letterSpacing: '0em'  }],
        'card-meta':     ['0.75rem',   { lineHeight: '1.5',      letterSpacing: '.01em'}],
      },
      maxWidth: {
        container: '1100px',
      },
      spacing: {
        'nav': '68px',
      },
      borderRadius: {
        'xl2': '20px',
        'xl3': '28px',
      },
    },
  },
  plugins: [],
};
