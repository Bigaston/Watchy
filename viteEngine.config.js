import { defineConfig } from "vite";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

export default ({ mode }) => {
  return defineConfig({
    base: "/",
    build: {
      outDir: "dist_engine",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "engine.html"),
        },
      },
    },
    plugins: [viteSingleFile()],
  });
};
