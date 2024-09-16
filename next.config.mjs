/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "api.multiavatar.com",
      },
      {
        hostname: "ipfs.internal.citizenwallet.xyz",
      },
    ],
  },
  // webpack doesn't understand that .abi files are .json files
  // this helps webpack to understand that
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.abi$/,
      loader: "json-loader",
      type: "javascript/auto", // Required by Webpack v4
    });
    config.resolve.fallback = { fs: false, dns: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
