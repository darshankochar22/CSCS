import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray package-lock.json in the home directory makes Turbopack infer the
  // wrong workspace root. Pin it to this project.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "splcms.blob.core.windows.net" },
      { protocol: "https", hostname: "cricketcscs.tv" },
    ],
  },
};

export default nextConfig;
