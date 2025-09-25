import { heroui } from '@heroui/theme';
import type { Config } from '@tailwindcss/postcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      screens: {
        xsm: '480px',
        '3xl': '1660px',
        '4xl': '1920px',
        '5xl': '2048px',
      },
      colors: {
        cCta: {
          100: 'rgba(var(--cCta-100), 1)',
          300: 'rgba(var(--cCta-300), 1)',
          500: 'rgba(var(--cCta-500), 1)',
          700: 'rgba(var(--cCta-700), 1)',
          900: 'rgba(var(--cCta-900), 1)',
        },
        cMuted: {
          300: 'rgba(var(--cMuted-300), 1)',
          500: 'rgba(var(--cMuted-500), 1)',
          700: 'rgba(var(--cMuted-700), 1)',
        },
        cBgLight: {
          50: 'rgba(var(--cBgLight-50), 1)',
          100: 'rgba(var(--cBgLight-100), 1)',
        },
        cBgDark: {
          700: 'rgba(var(--cBgDark-700), 1)',
          800: 'rgba(var(--cBgDark-800), 1)',
          900: 'rgba(var(--cBgDark-900), 1)',
        },
        cTextLight: {
          900: 'rgba(var(--cTextLight-900), 1)',
        },
        cTextDark: {
          100: 'rgba(var(--cTextDark-100), 1)',
        },
        cStatusGreen: {
          500: 'rgba(var(--cStatusGreen-500), 1)',
        },
        cStatusRed: {
          500: 'rgba(var(--cStatusRed-500), 1)',
        },
        cStatusYellow: {
          400: 'rgba(var(--cStatusYellow-400), 1)',
        },
      },
    },
  },
  plugins: [
    heroui(),
    function ({
      addVariant,
    }: {
      addVariant: (name: string, mediaQuery: string) => void;
    }) {
      addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
      addVariant('no-hover', '@media (hover: none)');
    },
  ],
};
export default config;
