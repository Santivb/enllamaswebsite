import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www serves a full copy of the site otherwise, so Google sees two of
      // every page. Permanent (308) to the bare domain, keeping the path.
      // This replaces a redirect set in the Vercel dashboard.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.enllamsrestaurant.com" }],
        destination: "https://enllamsrestaurant.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
