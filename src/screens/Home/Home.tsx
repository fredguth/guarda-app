import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useWallet } from '../../hooks/useWallet';
import StackedCards from '../../components/StackedCards';
import EmptyState from '../../components/EmptyState';
import { Footer, QRButton, QRButtonText } from './styles';

interface HomeProps {
  onNavigateAdd: () => void;
  onNavigateDocument: (credential: any) => void;
  onNavigateSplash: () => void;
  onNavigateConsent: () => void;
  onNavigateQrScanner: () => void;
}

export default function Home({ onNavigateAdd, onNavigateDocument, onNavigateQrScanner }: HomeProps) {
  const { credentials, downloading } = useWallet();

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
        <QRButton onPress={onNavigateQrScanner}>
          <Ionicons name="qr-code-outline" size={24} color="#FFF" />
          <QRButtonText>Ler QR-Code</QRButtonText>
        </QRButton>
      </Footer>
    </>
  );
}
