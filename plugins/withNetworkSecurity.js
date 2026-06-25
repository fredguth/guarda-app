/**
 * Expo config plugin for Zscaler/corporate proxy network security config.
 * Allows the app to trust user-installed CA certificates.
 */
const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withNetworkSecurity(config) {
  // Add network_security_config.xml
  config = withDangerousMod(config, ['android', (config) => {
    const xmlDir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/res/xml');
    fs.mkdirSync(xmlDir, { recursive: true });

    const networkSecurityConfig = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
`;
    fs.writeFileSync(path.join(xmlDir, 'network_security_config.xml'), networkSecurityConfig);
    return config;
  }]);

  // Add networkSecurityConfig attribute to AndroidManifest
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application[0];
    application.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return config;
  });

  return config;
}

module.exports = withNetworkSecurity;
