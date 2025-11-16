import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss(),
    Icons({
      compiler: "svelte",
      // Optimize icon loading
      autoInstall: true,
      // Use collection-based loading for better tree-shaking
      defaultStyle: "",
      defaultClass: ""
    })
  ],
  build: {
    sourcemap: false,
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 600
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ["clsx", "tailwind-merge"],
    exclude: []
  }
});
