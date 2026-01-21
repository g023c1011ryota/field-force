/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // 👈 v4ではこれを使います
  },
};

export default config;