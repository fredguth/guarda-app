import { useEffect, useState } from 'react';
import { VCSDK } from 'vc-sdk-headless';

export interface WalletCredential {
  id: string;
  title: string;
  feedbackText: string;
  isWarn: boolean;
}

function resolveAgeFeedback(subject: any): string {
  if (!subject) return '';
  if (subject.isOver18) return 'Maior de 18 anos';
  if (subject.isOver16) return 'Entre 16 e 18 anos';
  if (subject.isOver14) return 'Entre 14 e 16 anos';
  if (subject.isOver12) return 'Entre 12 e 14 anos';
  return 'Menor de 12 anos';
}

export function useWallet() {
  const [credentials, setCredentials] = useState<WalletCredential[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [ready, setReady] = useState(false);

  const loadCredentials = async () => {
    try {
      const list = await VCSDK.credentials.getAll();
      const latest = list.reduce((a: any, b: any) =>
        new Date(a.metadata?.addedDate) >= new Date(b.metadata?.addedDate) ? a : b
      , list[0]);
      const filtered = latest ? [latest] : [];
      setCredentials(
        filtered.map((vc: any, i: number) => ({
          id: vc.id || String(i),
          title: vc.metadata?.credentialType?.name || vc.type?.[1] || 'Credencial',
          feedbackText: resolveAgeFeedback(vc.credentialSubject) || vc.metadata?.issuerInfo?.name || vc.issuer || '',
          isWarn: vc.credentialSubject ? !vc.credentialSubject.isOver18 : false,
        }))
      );
    } catch {
      // No credentials yet
    }
  };

  useEffect(() => {
    setReady(true);
    loadCredentials().catch(() => {});
  }, []);

  const downloadCredential = async (issuer: any, type: any) => {
    setDownloading(true);
    try {
      await VCSDK.credentials.download(issuer, type);
      await loadCredentials();
    } finally {
      setDownloading(false);
    }
  };

  return { credentials, downloading, ready, downloadCredential, loadCredentials };
}
