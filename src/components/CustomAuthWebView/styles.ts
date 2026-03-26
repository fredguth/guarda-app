import styled from 'styled-components/native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  padding-top: ${StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16}px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #E0E0E0;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #F5F5F5;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-left: 16px;
`;

export const InitContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding-top: ${StatusBar.currentHeight || 0}px;
`;

export const StyledWebView = styled(WebView)`
  flex: 1;
`;

export const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
`;

export const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: #1351B4;
  font-weight: 500;
`;
