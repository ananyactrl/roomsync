import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to use server-side rendering instead of static export
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
