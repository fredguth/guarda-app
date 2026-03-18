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

interface DeleteCredentialModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteCredentialModal({ visible, onClose, onConfirm }: DeleteCredentialModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('[DeleteCredentialModal] Error:', error);
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
            <Ionicons name="trash-outline" size={32} color="#DC2626" />
          </IconContainer>

          <ModalTitle>Apagar credencial</ModalTitle>

          <ModalDescription>
            Tem certeza que deseja apagar esta credencial?
          </ModalDescription>

          <WarningBox>
            <Ionicons name="alert-circle" size={20} color="#F59E0B" />
            <WarningText>
              Esta ação não pode ser desfeita. A credencial será removida permanentemente deste dispositivo.
            </WarningText>
          </WarningBox>

          <ButtonContainer>
            <PrimaryButton onPress={handleConfirm} disabled={isLoading} activeOpacity={0.8}>
              {isLoading ? (
                <LoadingContainer>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <LoadingText>Apagando...</LoadingText>
                </LoadingContainer>
              ) : (
                <PrimaryButtonText>Sim, apagar</PrimaryButtonText>
              )}
            </PrimaryButton>

            <SecondaryButton onPress={onClose} disabled={isLoading} activeOpacity={0.8}>
              <SecondaryButtonText>Cancelar</SecondaryButtonText>
            </SecondaryButton>
          </ButtonContainer>
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
}
