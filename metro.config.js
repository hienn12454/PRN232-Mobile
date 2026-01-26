// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .mjs and .cjs files (required for Firebase v12+)
config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;
