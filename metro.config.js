// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

// SVG support
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
};

// Resolve vc-sdk-headless linked package
const vcSdkPath = path.resolve(__dirname, '../inji-wallet-sdk/vc-sdk-headless');

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
  // Follow symlinks for the linked SDK
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'),
  ],
  // Extra node_modules to resolve from
  extraNodeModules: {
    'vc-sdk-headless': vcSdkPath,
  },
};

// Watch the SDK directory for changes
config.watchFolders = [vcSdkPath];

module.exports = config;
