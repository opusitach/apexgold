import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit .next/standalone with a self-contained server.js and only the traced
  // node_modules files. The Docker runtime stage copies that folder instead of
  // installing dependencies again — see Dockerfile.
  output: "standalone",
  // The tracer resolves the default DB path in lib/db.ts and would otherwise
  // copy the live leads database into the bundle. The real database is a
  // mounted volume (APEXGOLD_DB_PATH), so it must never be baked into a build.
  outputFileTracingExcludes: {
    "/*": ["./data/**/*"],
  },
  images: {
    // All imagery is served from /public — no remote patterns are allowed, so a
    // stray third-party URL fails the build instead of shipping a hotlink.
    formats: ["image/avif", "image/webp"],
    // Required from Next 16: only these quality values may be requested.
    qualities: [70, 80],
  },
};

export default nextConfig;
