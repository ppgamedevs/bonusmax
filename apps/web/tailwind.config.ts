import type { Config } from 'tailwindcss';
import uiPreset from '../../packages/ui/tailwind-preset';

export default {
  darkMode: 'class',
  presets: [uiPreset],
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
