import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80],
  },
  // One address for the site: the bare domain forwards, path included, to
  // www — the canonical URL in app/layout.tsx, the sitemap and robots.
  // (*.vercel.app keeps answering directly, for previews and rollback.)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "legrandamour.com.br" }],
        destination: "https://www.legrandamour.com.br/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
