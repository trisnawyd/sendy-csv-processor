import fs from "fs";
import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  imports: {
    dirs: ["features"],
  },

  components: {
    dirs: [
      {
        // default
        path: "~/components",
        global: true,
        extensions: [".vue"],
      },
      {
        // for components inside features. need to mark as global to enable auto import.
        path: "~/features",
        global: true,
        extensions: [".vue"],
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  devServer: {
    port: 3000,

    ...(process.env.ENV_FILE === "Local" &&
      fs.existsSync("./nuxt4-key.pem") &&
      fs.existsSync("./nuxt4.pem") && {
        https: {
          key: "./nuxt4-key.pem",
          cert: "./nuxt4.pem",
        },
      }),
  },

  modules: ["shadcn-nuxt", "@vueuse/nuxt"],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "~/components/ui",
  },

  alias: {
    "@/components": "~/components",
    "@/lib": "~/lib",
  },
});
