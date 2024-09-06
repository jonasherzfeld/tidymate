const withNextra = require('nextra')({
  //Nextra
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  unstable_staticImage: false
});
const path = require('path');

module.exports = module.exports = {
  ...withNextra({
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || ''
  }),
  output: "export",
  assetPrefix: './',
  images: {
    unoptimized: true,
  },
};
