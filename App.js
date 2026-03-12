import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Splash from './src/screens/Splash';
import Login from './src/screens/Login/Login';
import Home from './src/screens/Home';
import AddDocument from './src/screens/AddDocument';
import DocumentDetail from './src/screens/DocumentDetail';
import Profile from './src/screens/Profile/Profile';
import Header from './src/components/Header/Header';
import { useAuthStore } from './src/store/authStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState('Splash');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

  React.useEffect(() => {
    if (!isAuthenticated && currentScreen !== 'Splash' && currentScreen !== 'Login') {
      setCurrentScreen('Login');
    }
  }, [isAuthenticated]);

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = () => {
    login();
    navigateTo('Home');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
      {currentScreen !== 'Splash' && currentScreen !== 'Login' && (
        <Header 
          onNavigateAdd={() => navigateTo('AddDocument')} 
          onNavigateSplash={() => navigateTo('Splash')}
          onNavigateProfile={() => navigateTo('Profile')} 
        />
      )}
      
      {currentScreen === 'Splash' && (
        <Splash onFinish={() => navigateTo('Login')} />
      )}

      {currentScreen === 'Login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {currentScreen === 'Home' && (
        <Home
          onNavigateAdd={() => navigateTo('AddDocument')}
          onNavigateDocument={() => navigateTo('DocumentDetail')}
          onNavigateSplash={() => navigateTo('Splash')}
        />
      )}

      {currentScreen === 'AddDocument' && (
        <AddDocument onBack={() => navigateTo('Home')} />
      )}

      {currentScreen === 'DocumentDetail' && (
        <DocumentDetail onBack={() => navigateTo('Home')} />
      )}

      {currentScreen === 'Profile' && (
        <Profile onBack={() => navigateTo('Home')} />
      )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
