import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server in .next/standalone — keeps the Docker image small.
  output: "standalone",
};

export default nextConfig;
