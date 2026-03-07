import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Splash from './src/screens/Splash';
import Home from './src/screens/Home';
import AddDocument from './src/screens/AddDocument';
import DocumentDetail from './src/screens/DocumentDetail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Splash');

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'Splash' && (
        <Splash onFinish={() => navigateTo('Home')} />
      )}
      
      {currentScreen === 'Home' && (
        <Home
          onNavigateAdd={() => navigateTo('AddDocument')}
          onNavigateDocument={() => navigateTo('DocumentDetail')}
        />
      )}

      {currentScreen === 'AddDocument' && (
        <AddDocument onBack={() => navigateTo('Home')} />
      )}

      {currentScreen === 'DocumentDetail' && (
        <DocumentDetail onBack={() => navigateTo('Home')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
