const preset = require('@repo/config/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/widgets/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/layout-renderer/src/**/*.{js,ts,jsx,tsx}',
  ],
};
