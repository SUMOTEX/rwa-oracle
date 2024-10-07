/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'export',
    extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
      // Disable specific ESLint rules
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
  // Ignore TypeScript errors during build (if you're using TypeScript)
  typescript: {
      ignoreBuildErrors: true,
  },
    webpack: (config) => {
      config.externals.push("pino-pretty", 'bigint', "lokijs", "encoding", 'node-gyp-build');
      return config;
    }
}

module.exports = nextConfig
