const shared = require('../packages/shared-config/tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...shared,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
