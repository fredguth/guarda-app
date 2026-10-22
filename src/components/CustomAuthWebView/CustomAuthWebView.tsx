import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Buffer } from 'buffer';
import { Ionicons } from '@expo/vector-icons';
import { CustomAuthWebViewProps, PkceData } from './types';
import { saveCallbackParams, saveUserData, saveTokenData } from './authStorage';
import { generatePkce, buildAuthorizationUrl, fetchUserProfile, fetchCNonce, getOAuthConfig } from './authService';
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
      // get-token obtém o access_token do Certify (necessário para download de credencial)
      const certifyToken = await fetchCNonce('MGI', code, currentPkce);

      let user: any = {};
      let accessToken: string | null = null;

      if (certifyToken) {
        // Extrai perfil do id_token do Certify
        accessToken = certifyToken.access_token;
        try {
          const parts = certifyToken.id_token?.split('.');
          if (parts?.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            user = {
              sub: payload.sub,
              name: payload.name || payload.preferred_username || payload.sub,
              email: payload.email,
              picture: payload.picture,
            };
          }
        } catch {}

        // Tenta também obter perfil completo do Gov.br (pode falhar se code já foi consumido)
        try {
          const response = await fetchUserProfile(code, currentPkce);
          const { accessToken: _, ...govBrUser } = response;
          user = { ...user, ...govBrUser };
        } catch {}
      } else {
        // Fallback: usa apenas user/profile do Gov.br
        const response = await fetchUserProfile(code, currentPkce);
        const { accessToken: govBrToken, ...govBrUser } = response;
        accessToken = govBrToken;
        user = govBrUser;
      }

      await saveUserData(user);
      await saveTokenData({
        access_token: accessToken,
        c_nonce: certifyToken?.c_nonce ?? undefined,
      });
      onSuccess({ user, accessToken });
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
