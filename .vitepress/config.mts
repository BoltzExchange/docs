import { defineConfig } from "vitepress";

const docsRoot = "https://docs.boltz.exchange";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Boltz Docs",
  description: "Boltz Docs Home",
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/BoltzExchange",
      },
    ],
  },
  
  // Ignore dead links to localhost
  ignoreDeadLinks: [/https?:\/\/localhost/],
});
