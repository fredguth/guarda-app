import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  margin-top: 60px;
`;

export const IconContainer = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 12px;
`;

export const Description = styled.Text`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  line-height: 24px;
  margin-bottom: 32px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #4c1d95;
  border-radius: 16px;
  padding: 16px 32px;
  flex-direction: row;
  align-items: center;
  shadow-color: #4c1d95;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;
