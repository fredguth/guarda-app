import React from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ModalOverlay,
  ModalContainer,
  IconContainer,
  ModalTitle,
  ModalDescription,
  PrimaryButton,
  PrimaryButtonText,
} from './styles';

interface ErrorModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  onClose: () => void;
}

export default function ErrorModal({
  visible,
  title = 'Erro',
  description = 'Ocorreu um erro. Tente novamente.',
  buttonText = 'Fechar',
  onClose,
}: ErrorModalProps) {
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
            <Ionicons name="close-circle" size={48} color="#EF4444" />
          </IconContainer>

          <ModalTitle>{title}</ModalTitle>
          
          <ModalDescription>{description}</ModalDescription>

          <PrimaryButton onPress={onClose} activeOpacity={0.8}>
            <PrimaryButtonText>{buttonText}</PrimaryButtonText>
          </PrimaryButton>
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
}
