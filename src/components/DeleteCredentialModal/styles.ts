import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const ModalContainer = styled.View`
  background-color: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  padding: 32px 24px 24px 24px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 8;
`;

export const IconContainer = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #fee2e2;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-bottom: 20px;
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
  color: #6b7280;
  text-align: center;
  line-height: 22px;
  margin-bottom: 28px;
`;

export const WarningBox = styled.View`
  background-color: #fef3c7;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  flex-direction: row;
  align-items: flex-start;
`;

export const WarningText = styled.Text`
  font-size: 14px;
  color: #92400e;
  line-height: 20px;
  flex: 1;
  margin-left: 12px;
`;

export const ButtonContainer = styled.View`
  gap: 12px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: #dc2626;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

export const PrimaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

export const SecondaryButton = styled.TouchableOpacity`
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

export const SecondaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

export const LoadingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 8px;
`;
