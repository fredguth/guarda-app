import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { PENDING_KEY, RequestedField, resolveOpenId4VpUrl } from '../services/deepLinkHandler';

interface ShareUrlResult {
  shareUrl: string;
  appName: string;
  requestId: string;
  requestedFields: RequestedField[];
}

interface UseQrScannerProps {
  onScanned: (appName: string) => void;
}

function extractFieldsFromDescriptors(descriptors: any[]): RequestedField[] {
  return (descriptors || []).map((d: any) => ({
    id: d.id,
    name: d.name || d.id,
    type: d.constraints?.fields?.find((f: any) => f.path?.includes('$.type'))?.filter?.pattern ?? d.id,
  }));
}

function buildShareUrlFromJson(payload: any): ShareUrlResult | null {
  const auth = payload.authorizationDetails;
  if (!auth) return null;

  const clientId = auth.clientId ?? '';
  const nonce = auth.nonce ?? '';
  const transactionId = payload.transactionId ?? payload.requestId ?? '';
  const responseUri = auth.responseUri?.startsWith('http')
    ? auth.responseUri
    : `${clientId}${auth.responseUri ?? ''}`;

  const pd = auth.presentationDefinition ?? {};
  const params = new URLSearchParams({
    response_type: auth.responseType ?? 'vp_token',
    client_id: clientId,
    redirect_uri: responseUri,
    response_mode: 'direct_post',
    presentation_definition: JSON.stringify(pd),
    nonce,
    state: transactionId,
  });

  let appName = 'Verificador';
  try { appName = new URL(clientId).hostname || 'Verificador'; } catch {}

  return {
    shareUrl: `openid4vp://?${params.toString()}`,
    appName,
    requestId: transactionId,
    requestedFields: extractFieldsFromDescriptors(pd.input_descriptors),
  };
}

function resolveAppName(clientId: string): string {
  try { return new URL(clientId).hostname || 'Verificador'; } catch {
    return clientId.replace(/^did:[^:]+:[^:]+:/, '').split(':')[0] || 'Verificador';
  }
}

export function useQrScanner({ onScanned }: UseQrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const processingRef = useRef(false);

  async function savePendingAndNavigate(appName: string, shareUrl: string, requestId = '', requestedFields: RequestedField[] = []): Promise<void> {
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify({ appName, shareUrl, origin: '', requestId, requestedFields }));
    onScanned(appName);
  }

  async function handleJsonQr(data: string): Promise<void> {
    const json = JSON.parse(data);
    const result = buildShareUrlFromJson(json);
    if (!result) throw new Error('invalid');
    await savePendingAndNavigate(result.appName, result.shareUrl, result.requestId, result.requestedFields);
  }

  async function handleOpenId4VpQr(data: string): Promise<void> {
    const [, query] = data.split('?');
    const params = new URLSearchParams(query || '');
    const clientId = params.get('client_id') ?? '';
    const { url: shareUrl, pd } = await resolveOpenId4VpUrl(data);
    const requestedFields = extractFieldsFromDescriptors(pd?.input_descriptors);
    await savePendingAndNavigate(resolveAppName(clientId), shareUrl, '', requestedFields);
  }

  async function handleScan(data: string): Promise<void> {
    if (processingRef.current) return;
    processingRef.current = true;
    setScanned(true);
    try {
      if (data.startsWith('openid4vp://')) await handleOpenId4VpQr(data);
      else await handleJsonQr(data);
    } catch {
      Alert.alert('QR inválido', 'O código escaneado não é um QR de verificação válido.');
      processingRef.current = false;
      setScanned(false);
    }
  }

  return { permission, requestPermission, scanned, handleScan };
}
