import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All imagery is served from /public — no remote patterns are allowed, so a
    // stray third-party URL fails the build instead of shipping a hotlink.
    formats: ["image/avif", "image/webp"],
    // Required from Next 16: only these quality values may be requested.
    qualities: [70, 80],
  },
};

export default nextConfig;
