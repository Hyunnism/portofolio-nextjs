import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  // Tambahkan ini:
  images: {
    domains: ["ik.imagekit.io"],
  },

  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  async rewrites() {
    return [
      { source: "/about", destination: "/public/about" },
      { source: "/skills", destination: "/public/skills" },
      { source: "/projects", destination: "/public/projects" },
      { source: "/experiences", destination: "/public/experiences" },
      { source: "/contact", destination: "/public/contact" },
    ];
  },
};

export default nextConfig;
