import { defineConfig } from "vite";
import { sveltepress } from "@sveltepress/vite";
import { defaultTheme } from "@sveltepress/theme-default";

const config = defineConfig({
  plugins: [
    sveltepress({
      theme: defaultTheme({
        navbar: [
          // {
          //   title : 'Foo page',
          //   to : '/foo/'
          // },
          // {
          //   title : 'With dropdown',
          //   items : [
          //     {
          //       title : 'Bar page',
          //       to : '/foo/bar/'
          //     },
          //     {
          //       title : 'External Github page',
          //       to : 'https://github.com/',
          //       external : true
          //     }
          //   ]
          // }
          {
            title: "App",
            to: "https://tidymate.vercel.app/",
            external: true,
          },
        ],
        sidebar: {
          // '/': [
          //   {
          //     title : 'Bar',
          //     to : '/foo/',
          //   },
          //   {
          //     title : 'Zoo',
          //     collapsible : true,
          //     items : [
          //       {
          //         title : 'Sub item',
          //         to : '/foo/bar'
          //       }
          //     ]
          //   },
          //   {
          //     title : 'External github page',
          //     to : 'https://github.com'
          //   }
          // ]
        },
        github: "https://github.com/jonasherzfeld/tidymate",
        logo: "/tidymate_logo.png",
      }),
      siteConfig: {
        title: "Tidymate",
        description: "A lean organizer app for you and your mates!",
      },
    }),
  ],
});

export default config;
