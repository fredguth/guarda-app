import React, { useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIssuers } from '../../hooks/useIssuers';
import { useWallet } from '../../hooks/useWallet';
import { useAuthStore } from '../../store/authStore';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';
import NoCredentialModal from '../../components/NoCredentialModal';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  Spacer,
  Card,
  CardLeft,
  CardIconContainer,
  CardTitle,
  CardAction,
} from './styles';

interface AddDocumentProps {
  onBack: () => void;
  onLoginRequired?: () => void;
}

interface DocumentItem {
  id: string;
  title: string;
  issuer: any;
  type: any;
}

export default function AddDocument({ onBack, onLoginRequired }: AddDocumentProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNoCredentialModal, setShowNoCredentialModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { sections, loading } = useIssuers(true);
  const { downloadCredential, downloading } = useWallet();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleDownload = async (issuer: any, type: any) => {
    if (!isAuthenticated) return setShowNoCredentialModal(true);
    try {
      await downloadCredential(issuer, type);
      setShowSuccessModal(true);
    } catch (e: any) {
      if (e?.code === 'AUTH_REQUIRED') {
        setShowNoCredentialModal(true);
        return;
      }
      showError('Falha ao baixar credencial. Tente novamente.');
    }
  };

  const documents: DocumentItem[] = sections.flatMap((section) =>
    section.data.map((type: any, i: number) => ({
      id: `${section.issuer.id}-${i}`,
      title: type.name || type.id,
      issuer: section.issuer,
      type,
    }))
  );

  const renderItem = ({ item }: { item: DocumentItem }) => (
    <Card
      available
      cardColor="#3B82F6"
      disabled={downloading}
      activeOpacity={0.7}
      onPress={() => handleDownload(item.issuer, item.type)}
    >
      <CardLeft>
        <CardIconContainer>
          <Ionicons name="shield-checkmark" size={28} color="#FFF" />
        </CardIconContainer>
        <CardTitle available>{item.title}</CardTitle>
      </CardLeft>
      {downloading
        ? <ActivityIndicator color="#FFF" />
        : <CardAction available>Adicionar</CardAction>
      }
    </Card>
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>Adicionar Documento</HeaderTitle>
        <Spacer />
      </Header>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          loading ? <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} /> : null
        }
      />

      <NoCredentialModal
        visible={showNoCredentialModal}
        onContinue={() => { setShowNoCredentialModal(false); onLoginRequired?.(); }}
        onDismiss={() => setShowNoCredentialModal(false)}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Credencial Baixada!"
        description="Sua credencial foi baixada com sucesso e já está disponível na sua carteira."
        buttonText="Ver Credencial"
        onClose={() => { setShowSuccessModal(false); onBack(); }}
      />

      <ErrorModal
        visible={showErrorModal}
        title="Erro ao Baixar"
        description={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </Container>
  );
}
