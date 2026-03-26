import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import SplashIcon from '../../assets/splash2.svg';

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
        <View style={styles.logoPlaceholder}>
          <SplashIcon width={250} height={250} />
        </View>
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
});
