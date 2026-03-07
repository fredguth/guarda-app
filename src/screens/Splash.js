import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import SplashIcon from '../../assets/splash2.svg';
import appConfig from '../../app.json';

export default function Splash({ onFinish }) {
  useEffect(() => {
    // Simulando tempo de carregamento da Splash Screen
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <TouchableOpacity style={styles.logoPlaceholder} onPress={onFinish} activeOpacity={0.8}>
          <SplashIcon width={250} height={250} />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.versionText}>Versão {appConfig.expo.version}</Text>
      </View>
    </SafeAreaView>
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
