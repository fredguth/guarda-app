import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { saveCallbackParams, saveTokenData, saveUserData } from '../../services/authStorage';
import { generatePkce, buildAuthorizationUrl, fetchToken, fetchUserInfo, getOAuthConfig, PkceData } from '../../services/authService';

interface CustomAuthWebViewProps {
  onSuccess: (authData: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

export const CustomAuthWebView: React.FC<CustomAuthWebViewProps> = ({ onSuccess, onError }) => {
  const webViewRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pkce, setPkce] = useState<PkceData | null>(null);
  const redirectHandled = useRef(false);

  useEffect(() => {
    generatePkce().then((p) => {
      console.log('[AUTH] PKCE generated, redirectUri:', getOAuthConfig().redirectUri);
      console.log('[AUTH] Auth URL:', buildAuthorizationUrl(p).substring(0, 150));
      setPkce(p);
    });
  }, []);

  const handleAuthorizationCode = async (code: string, currentPkce: PkceData) => {
    setIsAuthenticating(true);
    console.log('[AUTH] handleAuthorizationCode called with code:', code.substring(0, 10) + '...');
    console.log('[AUTH] PKCE codeVerifier:', currentPkce.codeVerifier.substring(0, 10) + '...');
    try {
      const token = await fetchToken(code, currentPkce);
      console.log('[AUTH] Token received successfully');
      await saveTokenData(token);

      const user = await fetchUserInfo(token.access_token);
      await saveUserData(user);

      onSuccess({ user, accessToken: token.access_token });
    } catch (error: any) {
      console.error('[AUTH] Token exchange FAILED:', error?.message);
      onError(error?.message || 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleOAuthRedirect = (url: string) => {
    console.log('[AUTH] handleOAuthRedirect called with URL:', url);
    if (redirectHandled.current) {
      console.log('[AUTH] Redirect already handled, skipping');
      return;
    }
    redirectHandled.current = true;

    const params = Object.fromEntries(new URL(url).searchParams.entries());
    console.log('[AUTH] Redirect params:', JSON.stringify(params));

    if (params.error) { console.error('[AUTH] OAuth error in redirect:', params.error); onError(`Authentication error: ${params.error}`); return; }
    if (!params.code) { console.error('[AUTH] No code in redirect'); onError('No authorization code received'); return; }

    saveCallbackParams(params).then(() => handleAuthorizationCode(params.code, pkce!));
  };

  const isRedirectUrl = (url?: string) => !!url?.startsWith(getOAuthConfig().redirectUri);

  const onShouldStartLoadWithRequest = (request: any) => {
    console.log('[AUTH] onShouldStartLoadWithRequest URL:', request.url?.substring(0, 100));
    if (isRedirectUrl(request.url)) { handleOAuthRedirect(request.url); return false; }
    return true;
  };

  const onNavigationStateChange = (navState: any) => {
    console.log('[AUTH] onNavigationStateChange URL:', navState.url?.substring(0, 100));
    if (isRedirectUrl(navState.url)) handleOAuthRedirect(navState.url);
  };

  if (!pkce) {
    return (
      <View style={styles.initContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Inicializando autenticacao...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: buildAuthorizationUrl(pkce) }}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(e: any) => onError(e.nativeEvent.description)}
        incognito
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36"
        style={styles.webview}
      />
      {(isLoading || isAuthenticating) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>{isAuthenticating ? 'Autenticando...' : 'Carregando...'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  initContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
});
