import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const ModalContainer = styled.View`
  background-color: #FFFFFF;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  padding: 40px 24px 24px 24px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 8;
  align-items: center;
`;

export const IconContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #FEE2E2;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 12px;
`;

export const ModalDescription = styled.Text`
  font-size: 15px;
  color: #6B7280;
  text-align: center;
  line-height: 22px;
  margin-bottom: 32px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: #EF4444;
  border-radius: 12px;
  padding: 16px 32px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const PrimaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
`;
