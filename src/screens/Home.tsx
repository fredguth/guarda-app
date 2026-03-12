import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Consent from './Consent';
import {
  CarouselContainer,
  Card,
  CardTitle,
  CardSubtitle,
  CardFooter,
  CardValidade,
  CardAcesso,
  Spacer,
  Footer,
  QRButton,
  QRButtonText,
} from './Home.styles';

export default function Home({ onNavigateAdd, onNavigateDocument, onNavigateSplash }) {
  const [showConsent, setShowConsent] = useState(false);

  return (
    <>
      <CarouselContainer>
        <Card
          activeOpacity={0.8}
          onPress={onNavigateDocument}
        >
          <CardTitle>Maioridade 18+</CardTitle>
          <CardSubtitle>Identidade Digital</CardSubtitle>

          <CardFooter>
            <CardValidade>Validade: 12 Nov 2026</CardValidade>
            <CardAcesso>Acessar Documento</CardAcesso>
          </CardFooter>
        </Card>

        <Spacer />
      </CarouselContainer>

      <Footer>
        <QRButton onPress={() => setShowConsent(true)}>
          <Ionicons name="qr-code-outline" size={24} color="#FFF" />
          <QRButtonText>Ler QR-Code</QRButtonText>
        </QRButton>
      </Footer>

      <Consent 
        visible={showConsent} 
        onClose={() => setShowConsent(false)}
        onConfirm={() => setShowConsent(false)}
      />
    </>
  );
}


