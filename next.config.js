/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ eslint config NOT allowed here anymore
  // Move to eslint.config.js instead

  // ✔ Typescript ignore still allowed
  typescript: {
    ignoreBuildErrors: true,
  },

  // ❌ Remove all experimental.esmExternals — Turbopack ignores it
};

module.exports = nextConfig;
