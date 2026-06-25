const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const config = getDefaultConfig(__dirname);

const sdkPath = path.resolve(__dirname, "../inji-wallet-sdk/vc-sdk-headless");

config.watchFolders = [sdkPath];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(sdkPath, "node_modules"),
];

// Allow Metro to resolve explicit .js extensions in ESM-style imports (from SDK)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('.') && moduleName.endsWith('.js')) {
    const withoutExt = moduleName.slice(0, -3);
    const fromDir = path.dirname(context.originModulePath);
    const candidates = [
      path.resolve(fromDir, moduleName),
      path.resolve(fromDir, withoutExt + '.js'),
      path.resolve(fromDir, withoutExt + '.ts'),
      path.resolve(fromDir, withoutExt + '.tsx'),
      path.resolve(fromDir, withoutExt, 'index.js'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return { type: 'sourceFile', filePath: candidate };
      }
    }
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
