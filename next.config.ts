import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api-apps.bmkg.go.id",
        pathname: "/storage/icon/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/wilayah/:path*",
        destination: "https://wilayah.id/api/:path*",
      },
      {
        source: "/api/bmkg/:path*",
        destination: "https://www.bmkg.go.id/:path*",
      },
    ];
  },
};

export default nextConfig;
