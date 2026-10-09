import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Main address since 2026-10-09: enllamasrestaurant.com (with the "a").
    // The typo domain and both www hosts forward to it permanently (308).
    const MAIN = "https://enllamasrestaurant.com";
    return ["www.enllamasrestaurant.com", "enllamsrestaurant.com", "www.enllamsrestaurant.com"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${MAIN}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
