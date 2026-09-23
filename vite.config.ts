import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

/**
 * GitHub Pages serves static files only, so that build prerenders every route to
 * HTML and is served from a repository sub-path. Everything else (the default
 * build) still produces the nitro Cloudflare worker.
 */
const isPages = process.env["GITHUB_PAGES"] === "true";
const repository = process.env["PAGES_BASE_PATH"] ?? "sv_caterers_and_events";
const base = isPages ? `/${repository}/` : "/";

/** Every route in src/routes — crawlLinks would find these anyway, but listing
 *  them means a broken link can never silently drop a page from the build. */
const PAGES = ["/", "/services", "/menu", "/about", "/contact", "/quote"];

export default defineConfig(async ({ command }) => {
  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "server" },
      ...(isPages
        ? {
            // The prerenderer prefixes requests with router.basepath and strips it
            // again when writing files, so these stay plain paths.
            router: { basepath: base },
            pages: PAGES.map((path) => ({ path, prerender: { enabled: true } })),
            prerender: { enabled: true, crawlLinks: true, failOnError: true },
            // Pages has no rewrite rules: unknown URLs fall back to 404.html, so
            // emit a real SPA shell there rather than a copy of the home page
            // (whose serialised router state would fail to hydrate).
            spa: { enabled: true, prerender: { outputPath: "/404" } },
          }
        : {}),
    }),
  ];

  // nitro packages the Cloudflare worker; the Pages build is prerendered to plain
  // HTML instead, and nitro's output layout confuses Start's prerender server.
  if (command === "build" && !isPages) {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
  }

  plugins.push(viteReact());

  return {
    base,
    plugins,
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    server: { host: "::", port: 8080 },
  };
});
