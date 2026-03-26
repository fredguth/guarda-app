import React from 'react';
import { StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQrScanner } from '../../hooks/useQrScanner';
import {
  Container,
  Header,
  CloseButton,
  HeaderTitle,
  HeaderSpacer,
  CameraWrapper,
  Overlay,
  ScanFrame,
  HintText,
  PermissionContainer,
  PermissionText,
  PermissionButton,
  PermissionButtonText,
} from './styles';

interface QrScannerProps {
  onScanned: (appName: string) => void;
  onClose: () => void;
}

function CameraScreen({ scanned, handleScan }: { scanned: boolean; handleScan: (data: string) => void }) {
  return (
    <CameraWrapper>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : ({ data }) => handleScan(data)}
      />
      <Overlay>
        <ScanFrame />
        <HintText>Aponte a câmera para o QR code de verificação</HintText>
      </Overlay>
    </CameraWrapper>
  );
}

function PermissionScreen({ onRequest }: { onRequest: () => void }) {
  return (
    <PermissionContainer>
      <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
      <PermissionText>
        Permita o acesso à câmera para escanear o QR code de verificação.
      </PermissionText>
      <PermissionButton onPress={onRequest}>
        <PermissionButtonText>Permitir câmera</PermissionButtonText>
      </PermissionButton>
    </PermissionContainer>
  );
}

export default function QrScanner({ onScanned, onClose }: QrScannerProps) {
  const insets = useSafeAreaInsets();
  const { permission, requestPermission, scanned, handleScan } = useQrScanner({ onScanned });

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <CloseButton onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </CloseButton>
        <HeaderTitle>Ler QR-Code</HeaderTitle>
        <HeaderSpacer />
      </Header>

      {permission?.granted
        ? <CameraScreen scanned={scanned} handleScan={handleScan} />
        : <PermissionScreen onRequest={requestPermission} />
      }
    </Container>
  );
}
