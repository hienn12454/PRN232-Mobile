const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-terser',
  minifierConfig: {
    // Terser options for better minification
    keep_classnames: false,
    keep_fnames: false,
    mangle: {
      toplevel: false,
      keep_classnames: false,
      keep_fnames: false,
    },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true,
    },
    sourceMap: {
      includeSources: false,
    },
    toplevel: false,
    compress: {
      drop_console: process.env.NODE_ENV === 'production',
      reduce_funcs: true,
      collapse_vars: true,
      reduce_vars: true,
    },
  },
};

// Optimize resolver
config.resolver = {
  ...config.resolver,
  // Use haste maps for faster module resolution
  useWatchman: true,
};

// Enable caching for faster rebuilds
config.cacheStores = [
  {
    type: 'FileStore',
    root: require('path').join(__dirname, '.metro'),
  },
];

module.exports = config;
