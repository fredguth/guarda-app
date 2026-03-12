import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const CarouselContainer = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  snapToInterval: width * 0.8,
  decelerationRate: 'fast',
  contentContainerStyle: {
    paddingLeft: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
})``;

export const Card = styled.TouchableOpacity<{ backgroundColor?: string }>`
  width: ${width * 0.75}px;
  max-width: 320px;
  min-width: 260px;
  height: ${width > 400 ? '420px' : '380px'};
  border-radius: 24px;
  padding: 24px;
  margin-right: 16px;
  justify-content: space-between;
  background-color: ${props => props.backgroundColor || '#4C1D95'};
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.15;
  shadow-radius: 20px;
  elevation: 10;
`;

export const CardTitle = styled.Text`
  font-size: ${width > 400 ? '28px' : '24px'};
  font-weight: bold;
  color: #FFFFFF;
`;

export const CardSubtitle = styled.Text`
  font-size: ${width > 400 ? '16px' : '14px'};
  color: #E5E7EB;
  margin-top: 4px;
`;

export const CardFooter = styled.View`
  margin-top: auto;
`;

export const CardValidade = styled.Text`
  color: #E5E7EB;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const CardAcesso = styled.Text`
  color: #FFFFFF;
  font-weight: 600;
  font-size: 16px;
`;

export const Spacer = styled.View`
  width: 20px;
`;

export const Footer = styled.View`
  padding: 24px;
  padding-bottom: ${width > 400 ? '80px' : '60px'};
`;

export const QRButton = styled.TouchableOpacity`
  background-color: #000000;
  border-radius: 100px;
  padding-vertical: ${width > 400 ? '18px' : '16px'};
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const QRButtonText = styled.Text`
  color: #FFFFFF;
  font-size: ${width > 400 ? '18px' : '16px'};
  font-weight: 700;
  margin-left: 8px;
`;
