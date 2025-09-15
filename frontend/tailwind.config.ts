import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for your school theme
        lamaSky: '#C3EBFA',
        lamaSkyLight: '#EDF9FD',
        lamaPurple: '#CFCEFF',
        lamaPurpleLight: '#F1F0FF',
        lamaYellow: '#FAE27C',
        lamaYellowLight: '#FEFCE8',
      },
    },
  },
  plugins: [],
}

export default config