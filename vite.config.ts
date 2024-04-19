import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.test.ts"],
  },
  server: {
    fs: {
      strict: false, //Allows serving files outside of the workspace root
    },
  },
});
