/** @type {import('tailwindcss').Config} */
export default {
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
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          "'Segoe UI'",
          'Roboto',
          "'Noto Sans Devanagari'",
          "'Noto Sans Bengali'",
          "'Noto Sans SC'",
          "'Noto Sans JP'",
          "'Noto Sans KR'",
          "'Noto Sans Arabic'",
          "'Noto Sans Thai'",
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
