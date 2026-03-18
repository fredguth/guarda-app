import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderContainer, HeaderIcons, HeaderTitle, HeaderTitleContainer, IconButton, Logo } from './styles';

export default function Header({ onNavigateAdd, onNavigateSplash, onNavigateProfile }) {
  return (
    <HeaderContainer>
      <HeaderTitleContainer>
        <TouchableOpacity>
          <Logo width={42} height={42} />
        </TouchableOpacity>
        <HeaderTitle>Carteira</HeaderTitle>
      </HeaderTitleContainer>
      <HeaderIcons>
        <TouchableOpacity onPress={onNavigateAdd}>
          <IconButton>
            <Ionicons name="add" size={24} color="#000" />
          </IconButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNavigateProfile}>
          <IconButton>
            <Ionicons name="settings-outline" size={20} color="#000" />
          </IconButton>
        </TouchableOpacity>
      </HeaderIcons>
    </HeaderContainer>
  );
}


