/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,svelte,js,ts}"],
  theme: {
    extend: {
      // Layout constants for better maintainability
      spacing: {
        'header': '4rem',       // 64px - Header height
        'webapp-menu': '5rem',  // 80px - WebApp menu bar height
        'safe-top': '3rem',     // 48px - Safe area top (status bar, etc.)
      },
      minHeight: {
        'main-content': 'calc(100vh - theme(spacing.webapp-menu))',
        'main-content-desktop': '90vh'
      }
    }
  },
  plugins: [
    require("tailwindcss/plugin")(({ addVariant }) => {
      addVariant("search-cancel", "&::-webkit-search-cancel-button");
    })
  ]
};
