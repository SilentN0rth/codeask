import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
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
           100: 'var(--color-cCta-100)',
          300: 'var(--color-cCta-300)',
          500: 'var(--color-cCta-500)',
          700: 'var(--color-cCta-700)',
          900: 'var(--color-cCta-900)',
        },
        cMuted: {
          300: 'var(--color-cMuted-300)',
          500: 'var(--color-cMuted-500)',
          700: 'var(--color-cMuted-700)',
        },
        cBgLight: {
          50: 'var(--color-cBgLight-50)',
          100: 'var(--color-cBgLight-100)',
        },
        cBgDark: {
          700: 'var(--color-cBgDark-700)',
          800: 'var(--color-cBgDark-800)',
          900: 'var(--color-cBgDark-900)',
        },
        cTextLight: {
          900: 'var(--color-cTextLight-900)',
        },
        cTextDark: {
          100: 'var(--color-cTextDark-100)',
        },
        cStatusGreen: {
          500: 'var(--color-cStatusGreen-500)',
        },
        cStatusRed: {
          500: 'var(--color-cStatusRed-500)',
        },
        cStatusYellow: {
          400: 'var(--color-cStatusYellow-400)',
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
