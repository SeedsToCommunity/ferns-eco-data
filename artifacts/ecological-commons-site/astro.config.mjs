import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import rehypeExternalLinks from "rehype-external-links";

function rehypeFixInternalLinks() {
  const map = {
    "/idea/information-frontier": "#information-frontier",
    "/idea/computing-frontier": "#computing-frontier",
  };
  return function transformer(tree) {
    function walk(node) {
      if (node.type === "element" && node.tagName === "a") {
        const href = node.properties?.href;
        if (href && map[href]) {
          node.properties.href = map[href];
        }
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }
    walk(tree);
  };
}

export default defineConfig({
  integrations: [react()],
  outDir: "./dist/public",
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [
      rehypeFixInternalLinks,
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
  server: {
    port: Number(process.env.PORT) || 4321,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port: Number(process.env.PORT) || 4321,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
