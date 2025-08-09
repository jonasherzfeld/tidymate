import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: "nodejs20.x",
      // Increase body size limit for file uploads (5MB)
      bodySizeLimit: 5 * 1024 * 1024
    }),
    csrf: {
      checkOrigin: false
    }
  }
};

export default config;
