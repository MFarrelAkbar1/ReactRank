import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  // Challenge files are plain .js containing JSX (like CRA / Sandpack), so parse .js as JSX.
  oxc: { include: /\.(js|jsx)$/, exclude: /node_modules/, lang: "jsx", jsx: { runtime: "automatic" } },
  test: {
    root: fileURLToPath(new URL("../../.verify", import.meta.url)),
    include: ["**/*.test.js"],
    environment: "jsdom",
    globals: true,
    setupFiles: [here + "setup.js"],
    css: false,
    testTimeout: 10000,
  },
});
