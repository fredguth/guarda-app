import styled from 'styled-components/native';
import { StatusBar } from 'react-native';
import GuardaLogo from '../../../assets/carteira_documentos_logo.svg';

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  padding-top: ${StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 20}px;
`;

export const HeaderTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Logo = styled(GuardaLogo)`
  margin-right: 10px;
`;

export const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #000000;
`;

export const HeaderIcons = styled.View`
  flex-direction: row;
`;

export const IconButton = styled.View`
  margin-left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #F5F5F5;
  align-items: center;
  justify-content: center;
`;
