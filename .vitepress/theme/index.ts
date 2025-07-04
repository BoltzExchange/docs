// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";

import "./style.css";

/**
 * Redirects old paths to new paths
 */
const redirects = {
  "/api": "https://api.docs.boltz.exchange",
  "/v/api": "https://api.docs.boltz.exchange",
  "/web-app": "https://web.docs.boltz.exchange",
  "/boltz-client": "https://client.docs.boltz.exchange",
  "/boltz-btcpay-plugin": "https://btcpay.docs.boltz.exchange",
};

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
      let [_, subdomain, path] = to.split("/");

      if (!path) {
        subdomain = subdomain.replace(".html", "");
        path = "";
      }

      if (to === "/v/api.html") {
        redirectTo(redirects[`/${subdomain}/${path.replace(".html", "")}`]);
        return false;
      }

      const basePath = redirects[`/${subdomain}`];
      if (basePath) {
        setTimeout(() => {
          window.location.href = `${basePath}/${path}`;
        });
        return false;
      }

      return true;
    };
  },
} satisfies Theme;
