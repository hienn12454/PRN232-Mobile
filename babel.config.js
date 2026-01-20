module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated plugin must be last
      'react-native-reanimated/plugin',
      // Production optimizations
      ...(process.env.NODE_ENV === 'production'
        ? [
            // Remove console statements in production
            ['transform-remove-console', { exclude: ['error', 'warn'] }],
          ]
        : []),
    ],
    env: {
      production: {
        plugins: [
          'transform-remove-console',
          // Minify and optimize
          ['@babel/plugin-transform-react-constant-elements'],
          ['@babel/plugin-transform-react-inline-elements'],
        ],
      },
    },
  };
};
