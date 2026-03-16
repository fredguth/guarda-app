import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomAuthWebView } from '../../components/CustomAuthWebView';
import {
  Container,
  ScrollContainer,
  Content,
  Header,
  Title,
  Subtitle,
  LoginSection,
  LoginTitle,
  LoginDescription,
  GovButton,
  GovButtonText,
  FooterText,
  BackButton,
} from './styles';

export default function Login({ onLogin, onBack }) {
  const insets = useSafeAreaInsets();
  const [showWebView, setShowWebView] = useState(false);

  const handleSuccess = async (authData: any) => {
    setShowWebView(false);
    onLogin(authData);
  };

  const handleError = (error: string) => {
    console.error('Auth error:', error);
    setShowWebView(false);
  };

  if (showWebView) {
    return (
      <CustomAuthWebView
        onCancel={() => setShowWebView(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    );
  }

  return (
    <Container>
      {onBack && (
        <BackButton onPress={onBack} style={{ paddingTop: insets.top }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </BackButton>
      )}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollContainer 
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingTop: insets.top, 
            paddingBottom: insets.bottom 
          }}
        >
          <Content>
            <Header>
              <Ionicons name="shield-checkmark" size={64} color="#4C1D95" />
              <Title>Guarda</Title>
              <Subtitle>Sua identidade digital segura</Subtitle>
            </Header>

            <LoginSection>
              <LoginTitle>Bem-vindo</LoginTitle>
              <LoginDescription>
                Faça login com sua conta gov.br para acessar seus documentos digitais
              </LoginDescription>

              <GovButton onPress={() => setShowWebView(true)} activeOpacity={0.8}>
                <Ionicons name="shield-outline" size={24} color="#FFFFFF" />
                <GovButtonText>Entrar com gov.br</GovButtonText>
              </GovButton>
            </LoginSection>
            <FooterText>
              Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
            </FooterText>
          </Content>
        </ScrollContainer>
      </KeyboardAvoidingView>
    </Container>
  );
}
