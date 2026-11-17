import { defineConfig, type ViteDevServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
let server: ViteDevServer;

export default defineConfig({
  plugins: [
    {
      name: "evaluation-ssr",
      configureServer(instance) {
        server = instance;
      },
      async transformIndexHtml(html) {
        if (!server) return html;
        const { Fixture } = await server.ssrLoadModule("/fixture.tsx");
        return html.replace(
          '<main id="root"></main>',
          `<main id="root">${renderToString(createElement(Fixture))}</main>`,
        );
      },
    },
  ],
});
