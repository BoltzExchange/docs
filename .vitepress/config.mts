import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContentLoader, defineConfig } from "vitepress";

type Feature = {
  title: string;
  details: string;
  link: string;
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Boltz Docs",
  description: "Boltz Docs Home",
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/BoltzExchange",
      },
    ],
  },

  // Ignore dead links to localhost
  ignoreDeadLinks: [/https?:\/\/localhost/],

  // Generate llms.txt from index.md frontmatter so it stays in sync with
  // the feature cards on the home page (https://llmstxt.org).
  async buildEnd(siteConfig) {
    const [home] = await createContentLoader("index.md").load();
    if (!home) return;

    const { hero, features = [] } = home.frontmatter as {
      hero?: { tagline?: string };
      features?: Feature[];
    };

    const lines = [
      "# Boltz Documentation",
      "",
      `> ${hero?.tagline ?? "Boltz documentation hub."}`,
      "",
      "## Products",
      "",
      ...features.map(
        (f) => `- [${f.title}](${f.link}/llms.txt): ${f.details}`,
      ),
      "",
    ];

    writeFileSync(resolve(siteConfig.outDir, "llms.txt"), lines.join("\n"));
  },
});
