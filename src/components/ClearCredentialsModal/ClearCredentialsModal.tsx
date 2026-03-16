import React, { useState } from 'react';
import { Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ModalOverlay,
  ModalContainer,
  IconContainer,
  ModalTitle,
  ModalDescription,
  WarningBox,
  WarningText,
  ButtonContainer,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryButton,
  SecondaryButtonText,
  LoadingContainer,
  LoadingText,
} from './styles';

interface ClearCredentialsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ClearCredentialsModal({ visible, onClose, onConfirm }: ClearCredentialsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('[ClearCredentialsModal] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <ModalOverlay>
        <ModalContainer>
          <IconContainer>
            <Ionicons name="log-out-outline" size={32} color="#DC2626" />
          </IconContainer>

          <ModalTitle>Apagar credenciais</ModalTitle>
          
          <ModalDescription>
            Tem certeza que deseja apagar todas as suas credenciais?
          </ModalDescription>

          <WarningBox>
            <Ionicons name="alert-circle" size={20} color="#F59E0B" />
            <WarningText>
              Esta ação não pode ser desfeita. Todas as credenciais serão removidas permanentemente deste dispositivo.
            </WarningText>
          </WarningBox>

          <ButtonContainer>
            <PrimaryButton 
              onPress={handleConfirm} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <LoadingContainer>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <LoadingText>Apagando...</LoadingText>
                </LoadingContainer>
              ) : (
                <PrimaryButtonText>Sim, apagar tudo</PrimaryButtonText>
              )}
            </PrimaryButton>

            <SecondaryButton 
              onPress={onClose} 
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <SecondaryButtonText>Cancelar</SecondaryButtonText>
            </SecondaryButton>
          </ButtonContainer>
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
}
