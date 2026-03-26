import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 400;

export const Footer = styled.View`
  padding: 24px;
  padding-bottom: ${isLargeScreen ? '80px' : '60px'};
`;

export const QRButton = styled.TouchableOpacity`
  background-color: #000000;
  border-radius: 100px;
  padding: ${isLargeScreen ? '18px' : '16px'} 0;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const QRButtonText = styled.Text`
  font-size: ${isLargeScreen ? '18px' : '16px'};
  font-weight: 700;
  color: #ffffff;
  margin-left: 8px;
`;

