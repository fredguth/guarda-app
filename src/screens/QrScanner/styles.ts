import styled, { css } from 'styled-components/native';
import { StyleSheet } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: #000000;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const HeaderTitle = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
`;

export const HeaderSpacer = styled.View`
  width: 36px;
`;

export const CameraWrapper = styled.View`
  flex: 1;
`;

export const Overlay = styled.View`
  ${StyleSheet.absoluteFillObject as any}
  align-items: center;
  justify-content: center;
`;

export const ScanFrame = styled.View`
  width: 240px;
  height: 240px;
  border-width: 2px;
  border-color: #ffffff;
  border-radius: 16px;
  background-color: transparent;
`;

export const HintText = styled.Text`
  color: #ffffff;
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
  padding: 0 32px;
`;

export const PermissionContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  gap: 16px;
`;

export const PermissionText = styled.Text`
  color: #9ca3af;
  font-size: 16px;
  text-align: center;
  line-height: 24px;
`;

export const PermissionButton = styled.TouchableOpacity`
  background-color: #ffffff;
  padding: 12px 24px;
  border-radius: 100px;
`;

export const PermissionButtonText = styled.Text`
  color: #000000;
  font-weight: 600;
  font-size: 16px;
`;
