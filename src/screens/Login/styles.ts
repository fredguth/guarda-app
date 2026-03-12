import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  margin-top: 50px;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: 'handled',
})``;

export const Content = styled.View`
  flex: 1;
  padding: 0 24px;
  justify-content: center;
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: 80px;
`;

export const Title = styled.Text`
  font-size: 40px;
  font-weight: 800;
  color: #000000;
  margin-top: 24px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: #6B7280;
  margin-top: 8px;
`;

export const LoginSection = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

export const LoginTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 12px;
`;

export const LoginDescription = styled.Text`
  font-size: 15px;
  color: #6B7280;
  text-align: center;
  line-height: 22px;
  margin-bottom: 32px;
  padding: 0 20px;
`;

export const GovButton = styled.TouchableOpacity`
  background-color: #1351B4;
  border-radius: 100px;
  padding: 18px 32px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  shadow-color: #1351B4;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
`;

export const GovButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 700;
  margin-left: 12px;
`;

export const Footer = styled.View`
  padding: 24px;
`;

export const FooterText = styled.Text`
  font-size: 12px;
  color: #9CA3AF;
  text-align: center;
  line-height: 18px;
`;
