import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

const root = fileURLToPath(new URL(".", import.meta.url));

// WP テーマに載せるときは VITE_BASE=/wp-content/themes/<theme>/dist/ を渡す
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  resolve: {
    alias: [
      { find: /^~\//, replacement: `${root}` },
      { find: /^@\//, replacement: `${root}` },
    ],
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      dirs: ["composables"],
      dts: "auto-imports.d.ts",
      vueTemplate: true,
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: "readonly",
      },
    }),
    Components({
      dirs: ["components"],
      extensions: ["vue"],
      dts: "components.d.ts",
      // Nuxt の pathPrefix:false 相当（ディレクトリ名をプレフィックスしない）
      directoryAsNamespace: false,
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // functions.php がハッシュ付きファイル名を解決するために必要
    manifest: true,
  },
});
