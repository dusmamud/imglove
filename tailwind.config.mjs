/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          soft: 'var(--brand-soft)',
        },
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        soft: 'var(--soft-bg)',
        card: 'var(--card-bg)',
        code: 'var(--code-bg)',
      },
      fontFamily: {
        sans: [
          'Inter',
          "'Hind'",
          "'Hind Siliguri'",
          "'Noto Sans Bengali'",
          "'Cairo'",
          "'Noto Sans SC'",
          "'Noto Sans JP'",
          "'Noto Sans KR'",
          "'Noto Sans Thai'",
          "'Noto Sans Tamil'",
          'system-ui',
          '-apple-system',
          "'Segoe UI'",
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
      borderRadius: {
        btn: 'var(--radius-btn)',
        card: 'var(--radius-card)',
      },
    },
  },
  plugins: [],
};
