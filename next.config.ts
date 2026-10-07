import type { NextConfig } from "next";

// GitHub Pages serves a project repo under a sub-path
// (https://<user>.github.io/<repo>/). The deploy workflow passes that sub-path
// in as PAGES_BASE_PATH; locally it's unset, so `npm run dev` stays at "/".
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Emit a fully static site into ./out — GitHub Pages can't run a Node server.
  output: "export",
  basePath,
  // Serve /foo as /foo/index.html, which static hosts like Pages handle best.
  trailingSlash: true,
  // The image optimizer needs a server; not available on a static host.
  images: { unoptimized: true },
};

export default nextConfig;
