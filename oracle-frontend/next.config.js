/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Disable Image Optimization for static export
    domains: ['pbs.twimg.com','imgur.com'],
  },
  reactStrictMode: false,
  extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'import/order': 'off',
    'prettier/prettier': 'off',
    'react/self-closing-comp': 'off',
    'jsx-a11y/iframe-has-title': 'off',
    'react/jsx-sort-props': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'off',
    'no-console': 'off',
    'padding-line-between-statements': 'off',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals.push( "encoding");
    return config;
  },
};
module.exports = nextConfig;


