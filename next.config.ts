
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["127.0.0.1:3000", "localhost:3000"],
    },
  },
};

export default nextConfig;