// @ts-check
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

const site = process.env.SITE_URL ?? "https://example.com";
const isProductionDeploy =
  process.env.CONTEXT === "production" || 
  process.env.VERCEL_ENV === "production" || 
  process.env.DEPLOY_ENV === "production";

const placeholderHosts = new Set(["example.com", "www.example.com"]);
const hostname = URL.canParse(site) ? new URL(site).hostname : "example.com";
if (isProductionDeploy && placeholderHosts.has(hostname)) {
  throw new Error("SITE_URL is unset or still the placeholder.");
}

export default defineConfig({
  site,
  // Cukup tulis SATU KALI aja di sini:
  adapter: cloudflare({
    mode: 'directory'
  }),

  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: "server", access: "secret", optional: true }),
      CONTACT_FROM_EMAIL: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },

  trailingSlash: "always",

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/examples/") && !page.includes("/404/"),
      customPages: [new URL("/contact/", site).href],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
    },
  },
});
