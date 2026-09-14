import type { Config } from 'tailwindcss';

/* ---------------------------------------------------------------------------
 * JIGIRI MUSIC — DESIGN TOKENS
 *
 * Palette direction: "Ivory + Terracotta" — warm, folk-earthen, minimal/clean.
 * Chosen to match the client's stated visual vibe ("minimal/clean") while
 * carrying the warmth appropriate to Indian folk, album and devotional music.
 *
 * THE ENTIRE PALETTE CAN BE SWAPPED BY EDITING ONLY THIS FILE.
 * Component files must never contain a hardcoded hex value — always use the
 * named tokens below (brand-bg, brand-surface, brand-accent, ...).
 * ------------------------------------------------------------------------- */

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#FAF7F2',        // page background — warm ivory
        'brand-surface': '#FFFFFF',   // cards, elevated panels
        'brand-surface-alt': '#F3EDE4', // subtly recessed sections
        'brand-text': '#1C1410',      // primary text — near-black, warm
        'brand-accent': '#B85C2A',    // CTA / links — deep terracotta
        'brand-accent-hover': '#9C4A1E',
        'brand-accent-soft': '#F2E3D8', // accent tint for badges/backgrounds
        'brand-muted': '#7A6A60',     // secondary text
        'brand-border': '#E8E0D8',    // hairlines, card borders
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 7vw, 5.25rem)', { lineHeight: '1.04', letterSpacing: '-0.022em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.018em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.16', letterSpacing: '-0.014em' }],
        'display-sm': ['clamp(1.35rem, 2.5vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      maxWidth: { content: '1200px', prose: '68ch' },
      spacing: { section: '6rem', 'section-lg': '8rem' },
      borderRadius: { card: '0.5rem' },
      boxShadow: {
        card: '0 1px 2px rgba(28,20,16,0.04), 0 8px 24px -12px rgba(28,20,16,0.10)',
        'card-hover': '0 2px 4px rgba(28,20,16,0.05), 0 20px 40px -16px rgba(28,20,16,0.20)',
        nav: '0 1px 0 rgba(232,224,216,1), 0 6px 20px -12px rgba(28,20,16,0.14)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        marquee: 'marquee 28s linear infinite',
      },
      transitionTimingFunction: { smooth: 'cubic-bezier(0.22,1,0.36,1)' },
    },
  },
  plugins: [],
};
export default config;
