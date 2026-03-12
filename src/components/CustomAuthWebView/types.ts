export interface CustomAuthWebViewProps {
  onSuccess: (authData: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export interface PkceData {
  codeVerifier: string;
  codeChallenge: string;
}
