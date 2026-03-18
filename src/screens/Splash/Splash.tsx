import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Image } from 'react-native';
import appConfig from '../../../app.json';
import { Container, LogoContainer, Footer, VersionText } from './styles';

interface SplashProps {
  onFinish: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  const insets = useSafeAreaInsets();

  const authenticate = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        onFinish();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade para acessar a Carteira',
        fallbackLabel: 'Usar PIN',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      if (result.success) {
        onFinish();
      } else {
        setTimeout(authenticate, 500);
      }
    } catch {
      onFinish();
    }
  };

  useEffect(() => {
    const timer = setTimeout(authenticate, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LogoContainer>
        <Image source={require('../../../assets/carteira_documentos.png')} style={{ width: 250, height: 250, resizeMode: 'contain' }} />
      </LogoContainer>
      <Footer>
        <VersionText>Versão {appConfig.expo.version}</VersionText>
      </Footer>
    </Container>
  );
}
