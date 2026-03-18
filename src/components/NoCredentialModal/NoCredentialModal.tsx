import React from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ModalOverlay,
  ModalContainer,
  IconContainer,
  ModalTitle,
  ModalDescription,
  ButtonRow,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryButton,
  SecondaryButtonText,
} from './styles';

interface NoCredentialModalProps {
  visible: boolean;
  onContinue: () => void;
  onDismiss: () => void;
}

export default function NoCredentialModal({ visible, onContinue, onDismiss }: NoCredentialModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <ModalOverlay>
        <ModalContainer>
          <IconContainer>
            <Ionicons name="warning" size={40} color="#D97706" />
          </IconContainer>

          <ModalTitle>Login necessário</ModalTitle>

          <ModalDescription>
            Você ainda não possui uma credencial válida. Para compartilhá-la, primeiro faça login no aplicativo para obtê-la.
          </ModalDescription>

          <ButtonRow>
            <SecondaryButton onPress={onDismiss} activeOpacity={0.8}>
              <SecondaryButtonText>Recusar</SecondaryButtonText>
            </SecondaryButton>
            <PrimaryButton onPress={onContinue} activeOpacity={0.8}>
              <PrimaryButtonText>Continuar</PrimaryButtonText>
            </PrimaryButton>
          </ButtonRow>
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
}
