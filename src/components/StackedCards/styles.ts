import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 400;

export const CARD_HEIGHT = 200;

export const Card = styled.TouchableOpacity<{ backgroundColor?: string }>`
  width: 100%;
  height: 200px;
  border-radius: 20px;
  padding: 24px;
  margin-right: 16px;
  justify-content: space-between;
  background-color: ${({ backgroundColor }) => backgroundColor || '#4C1D95'};
  shadow-color: #4c1d95;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.35;
  shadow-radius: 16px;
  elevation: 12;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardBadge = styled.View`
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  padding: 4px 12px;
`;

export const CardBadgeText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #e5e7eb;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const CardTitle = styled.Text`
  font-size: ${isLargeScreen ? '18px' : '16px'};
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
`;

export const CardSubtitle = styled.Text`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 2px;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CardAcesso = styled.Text`
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;
