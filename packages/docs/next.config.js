const withNextra = require('nextra')({
  //Nextra
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});
const path = require('path');

module.exports = withNextra();
