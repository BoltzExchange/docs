import { defineConfig } from "vitepress";

const docsRoot = "https://docs.boltz.exchange";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Boltz API",
  description: "Boltz API Docs",
  themeConfig: {
    logo: "./assets/logo.svg",
    search: {
      provider: "local",
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/BoltzExchange",
      },
      {
        icon: "discord",
        link: "https://discord.gg/QBvZGcW",
      },
      {
        icon: "telegram",
        link: "https://t.me/boltzhq",
      },
      {
        icon: "substack",
        link: "https://blog.boltz.exchange",
      },
      {
        icon: "twitter",
        link: "https://twitter.com/boltzhq",
      },
    ],
  },
  // Ignore dead links to localhost
  ignoreDeadLinks: [/https?:\/\/localhost/],
});
