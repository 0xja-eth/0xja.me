import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'pixel-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'light-beam': 'light-beam 3s linear infinite',
        'shimmer': 'shimmer 4s ease-in-out infinite',
      },
      keyframes: {
        spin: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'light-beam': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '10%': { opacity: '0.1' },
          '20%': { opacity: '0.2' },
          '30%': { opacity: '0.3' },
          '40%': { opacity: '0.4' },
          '50%': { opacity: '0.5' },
          '60%': { opacity: '0.4' },
          '70%': { opacity: '0.3' },
          '80%': { opacity: '0.2' },
          '90%': { opacity: '0.1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        sans: ['var(--font-vt323)', 'system-ui', 'sans-serif'],
        pixel: ['var(--font-press-start)', 'monospace'],
      },
      colors: {
        // RPG 属性颜色
        'stat-str': '#ff4444', // 力量 - 红色
        'stat-int': '#4444ff', // 智力 - 蓝色
        'stat-agi': '#44ff44', // 敏捷 - 绿色
        'stat-dex': '#ffff44', // 灵巧 - 黄色
        'stat-luk': '#ff44ff', // 幸运 - 紫色
        // 装备稀有度颜色
        'rarity-common': '#ffffff',   // 普通 - 白色
        'rarity-rare': '#4444ff',     // 稀有 - 蓝色
        'rarity-epic': '#ff44ff',     // 史诗 - 紫色
        'rarity-legendary': '#ffaa00', // 传说 - 金色
      },
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;

export default config;
