import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useWallet } from '../../hooks/useWallet';
import { getAuthDataFromStorage } from '../../components/CustomAuthWebView/authStorage';
import StackedCards from '../../components/StackedCards';
import EmptyState from '../../components/EmptyState';
import { Footer, QRButton, QRButtonText, TokenButton, TokenButtonText } from './styles';

interface HomeProps {
  onNavigateAdd: () => void;
  onNavigateDocument: (credential: any) => void;
  onNavigateSplash: () => void;
  onNavigateConsent: () => void;
  onNavigateQrScanner: () => void;
  onNavigateGenerateToken: () => void;
}

export default function Home({ onNavigateAdd, onNavigateDocument, onNavigateQrScanner, onNavigateGenerateToken }: HomeProps) {
  const { credentials, downloading } = useWallet();

  useEffect(() => {
    getAuthDataFromStorage();
  }, []);

  return (
    <>
      <View style={{ flex: 1 }}>
        {downloading
          ? <ActivityIndicator size="large" color="#4C1D95" style={{ marginTop: 40 }} />
          : credentials.length === 0
            ? <EmptyState onNavigateAdd={onNavigateAdd} />
            : <StackedCards credentials={credentials} onNavigateDocument={onNavigateDocument} />
        }
      </View>

      <Footer>
        <TokenButton onPress={onNavigateGenerateToken}>
          <Ionicons name="key-outline" size={24} color="#FFF" />
          <TokenButtonText>Gerar Token</TokenButtonText>
        </TokenButton>
        <QRButton onPress={onNavigateQrScanner}>
          <Ionicons name="qr-code-outline" size={24} color="#FFF" />
          <QRButtonText>Ler QR-Code</QRButtonText>
        </QRButton>
      </Footer>
    </>
  );
}
