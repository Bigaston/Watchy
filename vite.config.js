import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default ({ mode }) => {
  return defineConfig({
    base: mode === "production" ? "/Watchy/" : "/",
    optimizeDeps: {
      exclude: ["dist_engine", "docs", "public"],
      needsInterop: ["wasmoon"],
    },
    plugins: [preact()],
  });
};
