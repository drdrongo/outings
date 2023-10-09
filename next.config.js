/** @type {import('next').NextConfig} */

// const withPWA = require("next-pwa");

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = withPWA({
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.child_process = false;
    }

    return config;
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/outings',
        // permanent: process.env.NODE_ENV !== 'development',
        permanent: false,
      },
    ];
  },
});

module.exports = nextConfig;
