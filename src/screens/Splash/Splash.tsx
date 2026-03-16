import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import SplashIcon from '../../../assets/splash2.svg';
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
        promptMessage: 'Confirme sua identidade para acessar o Guarda',
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
        <SplashIcon width={250} height={250} />
      </LogoContainer>
      <Footer>
        <VersionText>Versão {appConfig.expo.version}</VersionText>
      </Footer>
    </Container>
  );
}
