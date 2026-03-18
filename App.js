import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleDeepLink, PENDING_KEY } from './src/services/deepLinkHandler';
import { isUserAuthenticated, getAuthDataFromStorage } from './src/components/CustomAuthWebView/authStorage';
import { VCSDK } from 'vc-sdk-headless';

async function hasAgeCredential() {
  try {
    const list = await VCSDK.credentials.getAll();
    return list.some((vc) => vc.type?.includes('ECACredential') || vc.type?.includes('AgeVerificationCredential'));
  } catch {
    return false;
  }
}
import Splash from './src/screens/Splash/Splash';
import Login from './src/screens/Login/Login';
import Home from './src/screens/Home/Home';
import AddDocument from './src/screens/AddDocument/AddDocument';
import DocumentDetail from './src/screens/DocumentDetail/DocumentDetail';
import Profile from './src/screens/Profile/Profile';
import Consent from './src/screens/Consent/Consent';
import QrScanner from './src/screens/QrScanner/QrScanner';
import Header from './src/components/Header/Header';
import NoCredentialModal from './src/components/NoCredentialModal';
import { useAuthStore } from './src/store/authStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState('Splash');
  const [pendingScreen, setPendingScreen] = React.useState(null);
  const [selectedCredential, setSelectedCredential] = React.useState(null);
  const [pendingConsent, setPendingConsent] = React.useState(null);
  const [showNoCredentialModal, setShowNoCredentialModal] = React.useState(false);
  const login = useAuthStore((state) => state.login);

  const navigateToConsent = React.useCallback(async (appName) => {
    setPendingConsent({ appName });
    const [auth, hasAge] = await Promise.all([isUserAuthenticated(), hasAgeCredential()]);
    if (auth || hasAge) {
      setCurrentScreen('Consent');
    } else {
      setPendingScreen('Consent');
      setShowNoCredentialModal(true);
    }
  }, []);

  const processDeepLink = React.useCallback(async (url) => {
    if (!url || !url.startsWith('openid4vp://') || url.includes('expo-development-client')) return;
    try {
      const { appName } = await handleDeepLink(url);
      await navigateToConsent(appName);
    } catch (e) {
      console.error('DeepLink error:', e);
    }
  }, [navigateToConsent]);

  React.useEffect(() => {
    AsyncStorage.removeItem(PENDING_KEY).catch(() => {});
    isUserAuthenticated().then(async (auth) => {
      if (auth) {
        const data = await getAuthDataFromStorage();
        if (data?.token?.accessToken && data?.user) {
          login({ user: data.user, accessToken: data.token.accessToken });
        }
      }
    });
    Linking.getInitialURL().then((url) => { if (url) processDeepLink(url); });
    const sub = Linking.addEventListener('url', ({ url }) => processDeepLink(url));
    return () => sub.remove();
  }, [processDeepLink]);

  React.useEffect(() => {
    const SDK_CONFIG = {
      appId: 'Carteira-wallet',
      network: {
        baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
        oauth: {
          authorizationUrl: process.env.EXPO_PUBLIC_OAUTH_AUTHORIZATION_URL,
          tokenUrl:         process.env.EXPO_PUBLIC_OAUTH_TOKEN_URL,
          userInfoUrl:      process.env.EXPO_PUBLIC_OAUTH_USER_INFO_URL,
          clientId:         process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID,
          clientSecret:     process.env.EXPO_PUBLIC_OAUTH_CLIENT_SECRET,
          redirectUri:      process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URI,
          scopes:           ['openid', 'email', 'profile', 'govbr_confiabilidades'],
        },
      },
      storage: { encrypted: true },
    };
    VCSDK.init(SDK_CONFIG).catch(() => {});
  }, []);

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const navigateToDocument = (credential) => {
    setSelectedCredential(credential);
    setCurrentScreen('DocumentDetail');
  };

  const handleLogin = (authData) => {
    login(authData);
    navigateTo(pendingScreen || 'Home');
    setPendingScreen(null);
  };

  const handleLoginRequired = (returnScreen) => {
    setPendingScreen(returnScreen);
    navigateTo('Login');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
      {currentScreen !== 'Splash' && currentScreen !== 'Login' && currentScreen !== 'Consent' && currentScreen !== 'QrScanner' && (
        <Header 
          onNavigateAdd={() => navigateTo('AddDocument')} 
          onNavigateSplash={() => navigateTo('Splash')}
          onNavigateProfile={() => navigateTo('Profile')} 
        />
      )}
      
      {currentScreen === 'Splash' && (
        <Splash onFinish={() => navigateTo('Home')} />
      )}

      {currentScreen === 'Login' && (
        <Login onLogin={handleLogin} onBack={() => { setPendingScreen(null); navigateTo('Home'); }} />
      )}
      
      {currentScreen === 'Home' && (
        <Home
          onNavigateAdd={() => navigateTo('AddDocument')}
          onNavigateDocument={navigateToDocument}
          onNavigateSplash={() => navigateTo('Splash')}
          onNavigateConsent={() => navigateTo('Consent')}
          onNavigateQrScanner={() => navigateTo('QrScanner')}
        />
      )}

      {currentScreen === 'AddDocument' && (
        <AddDocument onBack={() => navigateTo('Home')} onLoginRequired={() => handleLoginRequired('AddDocument')} />
      )}

      {currentScreen === 'DocumentDetail' && (
        <DocumentDetail 
          onBack={() => navigateTo('Home')} 
          credential={selectedCredential}
          onDelete={async (vcId) => {
            await VCSDK.credentials.delete(vcId);
          }}
        />
      )}

      {currentScreen === 'Profile' && (
        <Profile onBack={() => navigateTo('Home')} />
      )}

      {currentScreen === 'QrScanner' && (
        <QrScanner
          onClose={() => navigateTo('Home')}
          onScanned={(appName) => navigateToConsent(appName)}
        />
      )}

      <NoCredentialModal
        visible={showNoCredentialModal}
        onContinue={() => { setShowNoCredentialModal(false); setCurrentScreen('Login'); }}
        onDismiss={() => { setShowNoCredentialModal(false); setPendingScreen(null); AsyncStorage.removeItem(PENDING_KEY).catch(() => {}); }}
      />

      {currentScreen === 'Consent' && (
        <Consent
          appName={pendingConsent?.appName}
          onClose={() => navigateTo('Home')}
          onConfirm={() => navigateTo('Home')}
        />
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
