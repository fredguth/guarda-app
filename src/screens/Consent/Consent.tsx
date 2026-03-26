import React, { useState, useEffect, useRef } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { executeShare, declineShare } from '../../services/shareService';
import { PENDING_KEY } from '../../services/deepLinkHandler';
import {
  Container,
  Header,
  CloseButton,
  SecurityBadge,
  SecurityText,
  ScrollContent,
  Title,
  RequesterCard,
  RequesterIcon,
  RequesterLabel,
  RequesterName,
  RequesterReason,
  SectionTitle,
  DataContainer,
  DataRow,
  DataRowLeft,
  DataLabel,
  RetentionCard,
  RetentionTexts,
  RetentionLabel,
  RetentionValue,
  Footer,
  Disclaimer,
  PrimaryButton,
  PrimaryButtonText,
  ButtonIcon,
  SecondaryButton,
  SecondaryButtonText,
} from './styles';

interface ConsentProps {
  appName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

interface PendingShare {
  appName?: string;
  shareUrl?: string;
  origin?: string;
}

export default function Consent({ appName, onClose, onConfirm }: ConsentProps) {
  const insets = useSafeAreaInsets();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loading, setLoading] = useState(false);
  const pendingRef = useRef<PendingShare | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PENDING_KEY)
      .then((saved) => { if (saved) pendingRef.current = JSON.parse(saved); })
      .catch(() => {});
  }, []);

  const requesterName = appName || pendingRef.current?.appName || 'Aplicativo';
  const isBusy = isAuthenticating || loading;

  const runShareFlow = async (pending: PendingShare) => {
    setLoading(true);
    try {
      await executeShare(pending as any);
      onConfirm();
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Não foi possível compartilhar.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const pending = pendingRef.current;
    if (!pending?.shareUrl) return Alert.alert('Erro', 'Requisição inválida.');

    try {
      setIsAuthenticating(true);
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setIsAuthenticating(false);
        await runShareFlow(pending);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se com Biometria',
        cancelLabel: 'Cancelar',
      });
      setIsAuthenticating(false);
      if (result.success) await runShareFlow(pending);
    } catch {
      setIsAuthenticating(false);
      Alert.alert('Erro', 'Ocorreu um erro na autenticação biométrica.');
    }
  };

  const handleCancel = async () => {
    await declineShare(pendingRef.current?.origin);
    onClose();
  };

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header>
        <CloseButton onPress={handleCancel}>
          <Ionicons name="close" size={28} color="#000" />
        </CloseButton>
        <SecurityBadge>
          <Ionicons name="shield-checkmark" size={16} color="#065F46" />
          <SecurityText>Conexão Segura</SecurityText>
        </SecurityBadge>
      </Header>

      <ScrollContent>
        <Title>Deseja compartilhar seus dados?</Title>

        <RequesterCard>
          <RequesterIcon>
            <Ionicons name="beer" size={32} color="#F59E0B" />
          </RequesterIcon>
          <RequesterLabel>Solicitado por</RequesterLabel>
          <RequesterName>{requesterName}</RequesterName>
          <RequesterReason>Para verificar sua maioridade na entrega de bebidas alcoólicas.</RequesterReason>
        </RequesterCard>

        <SectionTitle>Dados solicitados (obrigatórios):</SectionTitle>
        <DataContainer>
          <DataRow>
            <DataRowLeft>
              <Ionicons name="checkmark-done-circle-outline" size={24} color="#6B7280" />
              <DataLabel>Maior de 18 anos</DataLabel>
            </DataRowLeft>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </DataRow>
        </DataContainer>

        <RetentionCard>
          <Ionicons name="shield-half-outline" size={20} color="#6B7280" />
          <RetentionTexts>
            <RetentionLabel>Política de Retenção</RetentionLabel>
            <RetentionValue>Uso Único (Sem armazenamento)</RetentionValue>
          </RetentionTexts>
        </RetentionCard>
      </ScrollContent>

      <Footer>
        <Disclaimer>
          Ao autorizar o compartilhamento, você concorda que o solicitante terá acesso apenas aos dados listados acima. Você não poderá revogar essa ação para solicitações de uso único após a confirmação.
        </Disclaimer>
        <PrimaryButton onPress={handleConfirm} disabled={isBusy} activeOpacity={0.8}>
          {isBusy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <ButtonIcon>
                <Ionicons name="finger-print" size={20} color="#FFFFFF" />
              </ButtonIcon>
              <PrimaryButtonText>Autorizar Compartilhamento</PrimaryButtonText>
            </>
          )}
        </PrimaryButton>
        <SecondaryButton onPress={handleCancel}>
          <SecondaryButtonText>Cancelar</SecondaryButtonText>
        </SecondaryButton>
      </Footer>
    </Container>
  );
}
