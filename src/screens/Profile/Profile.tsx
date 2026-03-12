import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  Spacer,
  Content,
  ProfileSection,
  AvatarContainer,
  UserName,
  UserEmail,
  MenuSection,
  MenuItem,
  MenuItemLeft,
  MenuItemText,
  LogoutButton,
  LogoutButtonText,
} from './styles';

export default function Profile({ onBack }) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const displayName = user?.social_name || user?.name || 'Usuário';
  const displayEmail = user?.email || 'usuario@gov.br';

  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>Perfil</HeaderTitle>
        <Spacer />
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <ProfileSection>
          <AvatarContainer>
            <Ionicons name="person" size={40} color="#6B7280" />
          </AvatarContainer>
          <UserName>{displayName}</UserName>
          <UserEmail>{displayEmail}</UserEmail>
        </ProfileSection>

        <MenuSection>
          <MenuItem>
            <MenuItemLeft>
              <Ionicons name="settings-outline" size={24} color="#6B7280" />
              <MenuItemText>Configurações</MenuItemText>
            </MenuItemLeft>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </MenuItem>

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

        <LogoutButton onPress={handleLogout} activeOpacity={0.8}>
          <LogoutButtonText>Sair da Conta</LogoutButtonText>
        </LogoutButton>
      </Content>
    </Container>
  );
}
