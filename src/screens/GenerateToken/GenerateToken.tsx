import React, { useState } from 'react';
import { ActivityIndicator, Alert, Clipboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  Spacer,
  Content,
  Label,
  Input,
  SubmitButton,
  SubmitButtonText,
  ErrorBox,
  ErrorText,
  SuccessRow,
  SuccessText,
  TokenBox,
  TokenText,
  ButtonRow,
  CopyButton,
  CopyButtonText,
  HomeButton,
  HomeButtonText,
} from './styles';

const GENERATE_TOKEN_ENDPOINT = 'https://certify.kunalash.com/v1/certify/issuance/credential';

interface GenerateTokenProps {
  onBack: () => void;
}

export default function GenerateToken({ onBack }: GenerateTokenProps) {
  const [nonce, setNonce] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleSubmit = async () => {
    if (!nonce.trim()) return;

    setLoading(true);
    setToken(null);
    setError(null);

    try {
      if (!accessToken) {
        setError('Sessão expirada. Faça login novamente.');
        setLoading(false);
        return;
      }

      const body = {
        format: 'vc+sd-jwt',
        vct: 'sd_jwt_vct',
        doctype: 'ECACredential',
        proof: {
          proof_type: 'jwt',
          jwt: nonce.trim(),
        },
      };

      const response = await fetch(GENERATE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      let credential: string;
      try {
        const data = JSON.parse(text);
        credential = data.credential ?? text;
      } catch {
        credential = text;
      }

      setToken(String(credential));
    } catch (e: any) {
      const msg = e?.message || '';
      if (msg.includes('524') || msg.includes('timeout')) {
        setError('Servidor demorou para responder. Tente novamente.');
      } else if (msg.includes('401') || msg.includes('Unauthorized')) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (msg.includes('500') || msg.includes('502') || msg.includes('503')) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else {
        setError('Erro ao gerar token. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (token) {
      Clipboard.setString(token);
      Alert.alert('Copiado', 'Token copiado para a área de transferência.');
    }
  };

  if (token) {
    return (
      <Container>
        <Header>
          <BackButton onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </BackButton>
          <HeaderTitle>Gerar Token</HeaderTitle>
          <Spacer />
        </Header>
        <Content>
          <SuccessRow>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
            <SuccessText>Token gerado com sucesso!</SuccessText>
          </SuccessRow>
          <TokenBox>
            <ScrollView>
              <TokenText selectable>{token}</TokenText>
            </ScrollView>
          </TokenBox>
          <ButtonRow>
            <CopyButton onPress={handleCopy}>
              <Ionicons name="copy-outline" size={18} color="#4C1D95" />
              <CopyButtonText>Copiar</CopyButtonText>
            </CopyButton>
            <HomeButton onPress={onBack}>
              <HomeButtonText>Voltar</HomeButtonText>
            </HomeButton>
          </ButtonRow>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>Gerar Token</HeaderTitle>
        <Spacer />
      </Header>
      <Content>
        <Label>Nonce</Label>
        <Input
          placeholder="Cole o nonce aqui"
          value={nonce}
          onChangeText={setNonce}
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error && (
          <ErrorBox>
            <ErrorText>{error}</ErrorText>
          </ErrorBox>
        )}
        <SubmitButton disabled={loading || !nonce.trim()} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <SubmitButtonText>Gerar Token</SubmitButtonText>
          )}
        </SubmitButton>
      </Content>
    </Container>
  );
}
