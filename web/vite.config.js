import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss(),
    Icons({
      compiler: "svelte"
    })
  ],
  build: {
    sourcemap: true // Enable source maps for better debugging
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  }
});
