import React, { useEffect } from 'react';
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
  CheckmarkCircle,
} from './styles';

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  visible,
  title = 'Sucesso!',
  description = 'Operação realizada com sucesso.',
  buttonText = 'Continuar',
  onClose,
  autoClose = false,
  autoCloseDelay = 2000,
}: SuccessModalProps) {
  useEffect(() => {
    if (visible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [visible, autoClose, autoCloseDelay, onClose]);

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
            <CheckmarkCircle>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </CheckmarkCircle>
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
