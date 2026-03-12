import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashIcon from '../../assets/splash2.svg';
import appConfig from '../../app.json';

export default function Splash({ onFinish }) {
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.logoPlaceholder} onPress={onFinish} activeOpacity={0.8}>
          <SplashIcon width={250} height={250} />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.versionText}>Versão {appConfig.expo.version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
