const { withAppBuildGradle } = require("expo/config-plugins");

function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    if (buildGradle.includes("signingConfigs.release")) {
      return config;
    }

    // Add release signing config
    config.modResults.contents = buildGradle
      .replace(
        /signingConfigs\s*\{/,
        `signingConfigs {
        release {
            storeFile file('upload-keystore.jks')
            storePassword 'guarda123'
            keyAlias 'upload'
            keyPassword 'guarda123'
        }`
      )
      .replace(
        /signingConfig signingConfigs\.debug(\s*def enableShrinkResources)/,
        `signingConfig signingConfigs.release$1`
      );

    return config;
  });
}

module.exports = withReleaseSigning;
