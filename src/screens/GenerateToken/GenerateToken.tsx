import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VCSDK } from 'vc-sdk-headless';
import { useAuthStore } from '../../store/authStore';

interface GenerateTokenProps {
  nonce: string;
  callbackScheme: string; // e.g. "brejame"
  onClose: () => void;
  onLoginRequired: () => void;
}

type Status = 'generating' | 'done' | 'error';

export default function GenerateToken({ nonce, callbackScheme, onClose, onLoginRequired }: GenerateTokenProps) {
  const [status, setStatus] = useState<Status>('generating');
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    generate();
  }, []);

  async function generate() {
    setStatus('generating');
    setError(null);
    try {
      const token = await VCSDK.token.generate(nonce);
      setStatus('done');
      const callbackUrl = `${callbackScheme}://otp-result?token=${encodeURIComponent(token)}`;
      await Linking.openURL(callbackUrl);
      onClose();
    } catch (e: any) {
      setStatus('error');
      console.log('e', e?.message)
      setError(e?.message ?? 'Erro ao gerar token');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Gerar Token</Text>

        {status === 'generating' && (
          <>
            <ActivityIndicator size="large" color="#FF5A1F" style={{ marginVertical: 32 }} />
            <Text style={styles.body}>Gerando token de verificação…</Text>
          </>
        )}

        {status === 'done' && (
          <>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.body}>Token gerado! Retornando ao app…</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <Text style={styles.errorIcon}>✗</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.button} onPress={generate}>
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  successIcon: { fontSize: 64, color: '#16a34a', marginVertical: 24 },
  errorIcon: { fontSize: 64, color: '#dc2626', marginVertical: 24 },
  errorText: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#FF5A1F',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  buttonText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  cancelButton: { marginTop: 16, padding: 8 },
  cancelText: { fontSize: 15, color: '#666', fontWeight: '600' },
});
