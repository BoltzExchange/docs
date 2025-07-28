// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";

import "./style.css";

/**
 * Redirects old paths to new paths
 */
const redirects = (() => {
  const baseRedirects = {
    "/api": "https://api.docs.boltz.exchange",
    "/web-app": "https://web.docs.boltz.exchange",
    "/boltz-client": "https://client.docs.boltz.exchange",
    "/boltz-btcpay-plugin": "https://btcpay.docs.boltz.exchange",
  };

  const finalRedirects: Record<string, string> = {};

  for (const [fromPath, toUrl] of Object.entries(baseRedirects)) {
    finalRedirects[fromPath] = toUrl;
    finalRedirects[`${fromPath}/`] = toUrl;
    finalRedirects[`/v${fromPath}`] = toUrl;
    finalRedirects[`/v${fromPath}/`] = toUrl;
  }

  return finalRedirects;
})();

const redirectTo = (to: string) => {
  setTimeout(() => {
    window.location.href = to;
  });
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

      const destinationUrl = redirects[cleanPath];

      if (destinationUrl) {
        if (typeof window !== "undefined") {
          window.location.href = destinationUrl;
        }

        return false;
      }

      return true;
    };
  },
} satisfies Theme;
