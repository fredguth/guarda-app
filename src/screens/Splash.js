import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';

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
          <Image 
            source={require('../../assets/splash-icon.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>GUARDA</Text>
        <Text style={styles.subtitle}>Protege seus dados</Text>
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
    width: 120,
    height: 120,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginTop: 8,
  },
});
