module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#0B1020',
        panel: '#111827',
        glow: '#3b82f6',
        accent: '#8b5cf6',
        accent2: '#22d3ee',
        muted: '#94a3b8',
      },
      boxShadow: {
        glow: '0 30px 80px rgba(59,130,246,0.16)',
        soft: '0 24px 60px rgba(15,23,42,0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
