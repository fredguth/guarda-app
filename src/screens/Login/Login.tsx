import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Content,
  Header,
  Title,
  Subtitle,
  LoginSection,
  LoginTitle,
  LoginDescription,
  GovButton,
  GovButtonText,
  Footer,
  FooterText,
} from './styles';

export default function Login({ onLogin }) {
  return (
    <Container>
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

          <GovButton onPress={onLogin} activeOpacity={0.8}>
            <Ionicons name="shield-outline" size={24} color="#FFFFFF" />
            <GovButtonText>Entrar com gov.br</GovButtonText>
          </GovButton>
        </LoginSection>
      </Content>

      <Footer>
        <FooterText>
          Ao continuar, você concorda com os Termos de Uso e Política de Privacidade
        </FooterText>
      </Footer>
    </Container>
  );
}
