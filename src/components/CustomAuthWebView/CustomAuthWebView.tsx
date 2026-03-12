import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomAuthWebViewProps, PkceData } from './types';
import { saveCallbackParams, saveTokenData, saveUserData } from './authStorage';
import { generatePkce, buildAuthorizationUrl, fetchToken, fetchUserInfo, getOAuthConfig } from './authService';
import { Container, Header, BackButton, HeaderTitle, InitContainer, StyledWebView, LoadingOverlay, LoadingText } from './styles';

export const CustomAuthWebView: React.FC<CustomAuthWebViewProps> = ({ onSuccess, onError, onCancel }) => {
  const webViewRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pkce, setPkce] = useState<PkceData | null>(null);
  const redirectHandled = useRef(false);

  useEffect(() => {
    generatePkce().then(setPkce);
  }, []);

  const handleAuthorizationCode = async (code: string, currentPkce: PkceData) => {
    setIsAuthenticating(true);
    try {
      const token = await fetchToken(code, currentPkce);
      await saveTokenData(token);

      const user = await fetchUserInfo(token.access_token);
      await saveUserData(user);

      onSuccess({ user, accessToken: token.access_token });
    } catch (error: any) {
      onError(error?.message || 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleOAuthRedirect = (url: string) => {
    if (redirectHandled.current) return;
    redirectHandled.current = true;

    const params = Object.fromEntries(new URL(url).searchParams.entries());

    if (params.error) { onError(`Authentication error: ${params.error}`); return; }
    if (!params.code) { onError('No authorization code received'); return; }

    saveCallbackParams(params).then(() => handleAuthorizationCode(params.code, pkce!));
  };

  const isRedirectUrl = (url?: string) => !!url?.startsWith(getOAuthConfig().redirectUri);

  const onShouldStartLoadWithRequest = (request: any) => {
    if (isRedirectUrl(request.url)) { handleOAuthRedirect(request.url); return false; }
    return true;
  };

  const onNavigationStateChange = (navState: any) => {
    if (isRedirectUrl(navState.url)) handleOAuthRedirect(navState.url);
  };

  if (!pkce) {
    return (
      <InitContainer>
        <ActivityIndicator size="large" color="#1351B4" />
        <LoadingText>Inicializando autenticação...</LoadingText>
      </InitContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>Autenticação Gov.br</HeaderTitle>
      </Header>
      <StyledWebView
        ref={webViewRef}
        source={{ uri: buildAuthorizationUrl(pkce) }}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(e: any) => onError(e.nativeEvent.description)}
        onRenderProcessGone={() => onError('WebView process gone')}
        incognito
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        mixedContentMode="compatibility"
        userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36"
      />
      {(isLoading || isAuthenticating) && (
        <LoadingOverlay>
          <ActivityIndicator size="large" color="#1351B4" />
          <LoadingText>{isAuthenticating ? 'Autenticando...' : 'Carregando...'}</LoadingText>
        </LoadingOverlay>
      )}
    </Container>
  );
};
