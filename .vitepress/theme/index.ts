// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";

import "./style.css";

/**
 * Redirects old paths to new urls
 */
const baseRedirects = {
  "/api": "https://api.docs.boltz.exchange",
  "/web-app": "https://web.docs.boltz.exchange",
  "/boltz-client": "https://client.docs.boltz.exchange",
  "/boltz-btcpay-plugin": "https://btcpay.docs.boltz.exchange",
};

const redirectPrefixes = Object.keys(baseRedirects)
  .flatMap(key => [key, `/v${key}`])
  .sort((a, b) => b.length - a.length);

const redirectTo = (to: string) => {
  if (typeof window !== "undefined") {
    window.location.href = to;
  }
};

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ router }) {
    router.onBeforePageLoad = (to: string) => {
      const cleanPath = to.replace(/\.html$/, "");
      
      const matchedPrefix = redirectPrefixes.find(prefix => {
        if (!cleanPath.startsWith(prefix)) {
          return false;
        }

        const nextChar = cleanPath[prefix.length];
        
        return nextChar === undefined || nextChar === '/';
      });

      if (matchedPrefix) {
        const baseKey = matchedPrefix.startsWith('/v/')
          ? matchedPrefix.substring(2)
          : matchedPrefix;

        const destinationUrl = baseRedirects[baseKey];

        if (destinationUrl) {
          if (typeof window !== "undefined") {
            window.location.href = destinationUrl;
          }
          return false;
        }
      }

      return true;
    };
  },
} satisfies Theme;