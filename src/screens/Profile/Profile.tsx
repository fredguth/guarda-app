import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { VCSDK } from 'vc-sdk-headless';
import ClearCredentialsModal from '../../components/ClearCredentialsModal';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  Spacer,
  Content,
  MenuSection,
  MenuItem,
  MenuItemLeft,
  MenuItemText,
  LogoutButton,
  LogoutButtonText,
} from './styles';

export default function Profile({ onBack }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleDeleteConfirm = async () => {
    setShowConfirmModal(false);
    try {
      const credentials = await VCSDK.credentials.getAll();
      for (const cred of credentials) {
        await VCSDK.credentials.delete(cred.id);
      }
      setShowSuccessModal(true);
    } catch (e) {
      console.error('[Profile] Delete credentials failed:', e);
      setShowErrorModal(true);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>Configurações</HeaderTitle>
        <Spacer />
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <MenuSection>
          <MenuItem>
            <MenuItemLeft>
              <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
              <MenuItemText>Ajuda</MenuItemText>
            </MenuItemLeft>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </MenuItem>

          <MenuItem>
            <MenuItemLeft>
              <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
              <MenuItemText>Sobre</MenuItemText>
            </MenuItemLeft>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </MenuItem>
        </MenuSection>

        <LogoutButton onPress={() => setShowConfirmModal(true)} activeOpacity={0.8}>
          <LogoutButtonText>Apagar minhas credenciais</LogoutButtonText>
        </LogoutButton>
      </Content>

      <ClearCredentialsModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Credenciais apagadas"
        description="Todas as suas credenciais foram removidas com sucesso."
        buttonText="Voltar ao início"
        onClose={() => { setShowSuccessModal(false); onBack(); }}
      />

      <ErrorModal
        visible={showErrorModal}
        title="Erro ao apagar"
        description="Não foi possível apagar as credenciais. Tente novamente."
        onClose={() => setShowErrorModal(false)}
      />
    </Container>
  );
}
