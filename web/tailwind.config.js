/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,svelte,js,ts}"],
  theme: {
    extend: {}
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss/plugin")(({ addVariant }) => {
      addVariant("search-cancel", "&::-webkit-search-cancel-button");
    })
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dracula"],
          neutral: "#4b5563",

          "--rounded-box": "0.25rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.25rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "0.5rem", // border radius rounded-badge utility class, used in badges and similar
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.25rem" // border radius of tabs
        },
        light: {
          ...require("daisyui/src/theming/themes")["cupcake"],
          neutral: "#d1d5db",

          "--rounded-box": "0.25rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.25rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "0.5rem", // border radius rounded-badge utility class, used in badges and similar
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.25rem" // border radius of tabs
        },
        default: {
          primary: "#38bdf8",
          secondary: "#facc15",
          accent: "#c084fc",
          neutral: "#d6d3d1",
          "base-100": "#78716c",
          info: "#38bdf8",
          success: "#34d399",
          warning: "#fdba74",
          error: "#f87171",

          "--rounded-box": "0.25rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.25rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "0.5rem", // border radius rounded-badge utility class, used in badges and similar
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.25rem" // border radius of tabs
        }
      }
    ]
  }
};
