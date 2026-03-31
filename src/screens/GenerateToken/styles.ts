import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
`;

export const Spacer = styled.View`
  width: 40px;
`;

export const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  color: #111827;
  background-color: #f9fafb;
`;

export const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#9ca3af' : '#4C1D95')};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  margin-top: 24px;
`;

export const SubmitButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

export const ErrorBox = styled.View`
  background-color: #fef2f2;
  border-width: 1px;
  border-color: #fecaca;
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 16px;
`;

export const ErrorText = styled.Text`
  font-size: 14px;
  color: #dc2626;
`;

export const SuccessRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const SuccessText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #059669;
  margin-left: 8px;
`;

export const TokenBox = styled.View`
  flex: 1;
  background-color: #f3f4f6;
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 12px;
  padding: 12px;
`;

export const TokenText = styled.Text`
  font-size: 13px;
  font-family: monospace;
  color: #111827;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 16px;
`;

export const CopyButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #4C1D95;
  border-radius: 12px;
  padding: 14px;
  gap: 8px;
`;

export const CopyButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #4C1D95;
`;

export const HomeButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #4C1D95;
  border-radius: 12px;
  padding: 14px;
`;

export const HomeButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;
