import { useEffect, useState } from 'react';
import { VCSDK } from 'vc-sdk-headless';
import { useAuthStore } from '../store/authStore';

export interface WalletCredential {
  id: string;
  title: string;
  feedbackText: string;
  isWarn: boolean;
  vc: any;
}

function resolveAgeFeedback(subject: any): string {
  if (subject?.isOver18 === true)  return 'Maior de 18 anos';
  if (subject?.isOver18 === false) return 'Menor de 18 anos';
  return '';
}

export function useWallet() {
  const [credentials, setCredentials] = useState<WalletCredential[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [ready, setReady] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);

  const loadCredentials = async (): Promise<void> => {
    try {
      const list: any[] = await VCSDK.credentials.getAll();
      const byType: Record<string, any> = {};

      for (const vc of list) {
        const type = vc.type?.find((t: string) => t !== 'VerifiableCredential') || 'Credencial';
        const existing = byType[type];
        if (!existing || new Date(vc.metadata?.addedDate) > new Date(existing.metadata?.addedDate)) {
          byType[type] = vc;
        }
      }

      setCredentials(
        Object.values(byType).map((vc: any, i: number) => ({
          id: vc.id || String(i),
          title: vc.metadata?.credentialType?.name || vc.type?.[1] || 'Credencial',
          feedbackText: resolveAgeFeedback(vc.credentialSubject) || vc.metadata?.issuerInfo?.name || vc.issuer || '',
          isWarn: vc.credentialSubject?.isOver18 === false,
          vc,
        }))
      );
    } catch (e) {
      console.error('[Wallet] Load credentials failed', e);
    }
  };

  useEffect(() => {
    setReady(true);
    loadCredentials().catch(() => {});
  }, []);

  const downloadCredential = async (issuer: string, type: string): Promise<void> => {
    setDownloading(true);
    try {
      if (!accessToken) throw Object.assign(new Error('[Wallet] Auth required'), { code: 'AUTH_REQUIRED' });
      const result = await VCSDK.credentials.download(issuer, type, accessToken);
      if (result === null) throw Object.assign(new Error('[Wallet] Auth required'), { code: 'AUTH_REQUIRED' });
      await loadCredentials();
    } catch (e) {
      throw e;
    } finally {
      setDownloading(false);
    }
  };

  const deleteCredential = async (vcId: string): Promise<void> => {
    await VCSDK.credentials.delete(vcId);
    await loadCredentials();
  };

  return { credentials, downloading, ready, downloadCredential, loadCredentials, deleteCredential };
}
