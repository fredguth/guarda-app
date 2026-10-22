const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const config = getDefaultConfig(__dirname);

const sdkPath = path.resolve(__dirname, "../sdkdoscm/inji-wallet-sdk");

config.watchFolders = [sdkPath];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(sdkPath, "node_modules"),
];

const appNodeModules = path.resolve(__dirname, "node_modules");

// Packages that must be resolved from guarda-app to avoid version conflicts
const HOIST_TO_APP = ['@noble'];

// Packages with a "react-native" field that must always resolve to the native entry point
const FORCE_REACT_NATIVE_FIELD = [
  '@react-native-async-storage/async-storage',
];

// Packages that must always resolve from guarda-app to avoid duplicate instances
const HOIST_EXACT = ['react-native', 'react'];

const shimPath = path.resolve(__dirname, 'shims');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Shim jsonld e dependências — usam módulos Node nativos incompatíveis com RN
  if (moduleName === 'jsonld' || moduleName.startsWith('jsonld/')) {
    return { type: 'sourceFile', filePath: path.join(shimPath, 'jsonld.js') };
  }
  // Bloqueia o document loader Node do jsonld
  if (moduleName === './documentLoaders/node' || moduleName === './documentLoaders/node.js') {
    return { type: 'sourceFile', filePath: path.join(shimPath, 'jsonld-node-loader.js') };
  }

  // Hoist react-native and react — must always be a single instance from the app
  if (HOIST_EXACT.some((pkg) => moduleName === pkg || moduleName.startsWith(pkg + '/'))) {
    const pkgEntry = path.join(appNodeModules, moduleName);
    const pkgJson = path.join(pkgEntry, 'package.json');
    if (fs.existsSync(pkgJson)) {
      const meta = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
      const rnEntry = meta['react-native'] || meta['main'] || 'index.js';
      const resolved = path.join(pkgEntry, rnEntry);
      if (fs.existsSync(resolved)) return { type: 'sourceFile', filePath: resolved };
    }
  }

  // Hoist @noble/* to guarda-app to avoid SDK local version conflicts
  if (HOIST_TO_APP.some((pkg) => moduleName === pkg || moduleName.startsWith(pkg + '/'))) {
    const candidate = path.join(appNodeModules, moduleName);
    const candidateJs = candidate + '.js';
    if (fs.existsSync(candidateJs)) return { type: 'sourceFile', filePath: candidateJs };
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return { type: 'sourceFile', filePath: candidate };
  }

  // Force react-native entry point for packages that have a "react-native" field
  // This prevents Metro from resolving to the web/commonjs implementation when
  // the require() originates from inside an SDK local package
  if (FORCE_REACT_NATIVE_FIELD.some((pkg) => moduleName === pkg || moduleName.startsWith(pkg + '/'))) {
    const pkgJsonPath = path.join(appNodeModules, moduleName, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      const rnEntry = pkgJson['react-native'];
      if (rnEntry) {
        const resolved = path.join(appNodeModules, moduleName, rnEntry);
        if (fs.existsSync(resolved)) return { type: 'sourceFile', filePath: resolved };
      }
    }
  }

  // Resolve relative imports sem extensão APENAS para arquivos do SDK local
  if (moduleName.startsWith('.') && context.originModulePath.startsWith(sdkPath)) {
    const base = moduleName.endsWith('.js') ? moduleName.slice(0, -3) : moduleName;
    const fromDir = path.dirname(context.originModulePath);
    const candidates = [
      path.resolve(fromDir, base + '.js'),
      path.resolve(fromDir, base + '.ts'),
      path.resolve(fromDir, base + '.tsx'),
      path.resolve(fromDir, base, 'index.js'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
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
