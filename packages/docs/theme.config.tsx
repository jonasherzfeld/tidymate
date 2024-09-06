import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Tidymate Documentation</span>,
  project: {
    link: "https://github.com/jonasherzfeld/tidymate",
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: "https://github.com/jonasherzfeld/tidymate/packages/docs",
  footer: {
    text: "Tidymate Documentation",
  },
};

export default config;
