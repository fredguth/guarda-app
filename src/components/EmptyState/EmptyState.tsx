import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Container, IconContainer, Title, Description, Button, ButtonText } from './styles';

interface EmptyStateProps {
  onNavigateAdd: () => void;
}

export default function EmptyState({ onNavigateAdd }: EmptyStateProps) {
  return (
    <Container>
      <IconContainer>
        <Ionicons name="wallet-outline" size={56} color="#9CA3AF" />
      </IconContainer>
      <Title>Nenhuma Credencial</Title>
      <Description>
        Você ainda não possui credenciais digitais.{'\n'}
        Adicione sua primeira credencial para começar.
      </Description>
      <Button onPress={onNavigateAdd} activeOpacity={0.8}>
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <ButtonText>Adicionar Credencial</ButtonText>
      </Button>
    </Container>
  );
}
