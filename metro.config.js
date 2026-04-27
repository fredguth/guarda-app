const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const sdkPath = path.resolve(__dirname, "../inji-wallet-sdk/vc-sdk-headless");

config.watchFolders = [sdkPath];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(sdkPath, "node_modules"),
];

config.resolver.unstable_enablePackageExports = false;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Strip .js extension from relative imports inside the SDK so Metro can resolve them
  if (moduleName.endsWith('.js') && !moduleName.includes('node_modules')) {
    try {
      return context.resolveRequest(context, moduleName.slice(0, -3), platform);
    } catch (_) {}
  }
  return context.resolveRequest(context, moduleName, platform);
};

// SVG transformer
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer",
);
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

module.exports = config;
