import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--bg))',
        foreground: 'rgb(var(--fg))'
      }
    }
  }
};

export default preset as Config;
