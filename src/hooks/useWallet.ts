import { useEffect, useState } from 'react';
import { VCSDK } from 'vc-sdk-headless';
import { useAuthStore } from '../store/authStore';
import { downloadMdocCredential } from '../services/mdocService';

export interface WalletCredential {
  id: string;
  title: string;
  feedbackText: string;
  isWarn: boolean;
  isMdoc: boolean;
  vc: any;
}

function resolveAgeFeedback(subject: any): string {
  if (subject?.isOver18 === true)  return 'Maior de 18 anos';
  if (subject?.isOver18 === false) return 'Menor de 18 anos';
  return '';
}

function mdocToWalletCredential(mdoc: any, index: number): WalletCredential {
  const name = mdoc.metadata?.credentialType?.name || mdoc.doctype || 'Documento Digital';
  return {
    id: mdoc.id || String(index),
    title: name,
    feedbackText: mdoc.metadata?.issuerInfo?.name || mdoc.issuer || '',
    isWarn: false,
    isMdoc: true,
    vc: mdoc,
  };
}

export function useWallet(enabled: boolean = true) {
  const [credentials, setCredentials] = useState<WalletCredential[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);

  const loadCredentials = async (): Promise<void> => {
    try {
      const [vcList, mdocList]: [any[], any[]] = await Promise.all([
        VCSDK.credentials.getAll(),
        (VCSDK.credentials as any).getAllMdoc?.() ?? Promise.resolve([]),
      ]);

      const byType: Record<string, any> = {};
      for (const vc of vcList) {
        const type = vc.type?.find((t: string) => t !== 'VerifiableCredential') || 'Credencial';
        const existing = byType[type];
        if (!existing || new Date(vc.metadata?.addedDate) > new Date(existing.metadata?.addedDate)) {
          byType[type] = vc;
        }
      }

      const vcCredentials: WalletCredential[] = Object.values(byType).map((vc: any, i: number) => ({
        id: vc.id || String(i),
        title: vc.metadata?.credentialType?.name || vc.type?.[1] || 'Credencial',
        feedbackText: resolveAgeFeedback(vc.credentialSubject) || vc.metadata?.issuerInfo?.name || vc.issuer || '',
        isWarn: vc.credentialSubject?.isOver18 === false,
        isMdoc: false,
        vc,
      }));

      const mdocCredentials: WalletCredential[] = mdocList.map(mdocToWalletCredential);

      setCredentials([...vcCredentials, ...mdocCredentials]);
    } catch (e) {
      console.error('[Wallet] Load credentials failed', e);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    setReady(true);
    loadCredentials().catch(() => {});
  }, [enabled]);

  const downloadCredential = async (issuer: any, type: any): Promise<void> => {
    const id = `${issuer.id}-${type.id}`;
    setDownloadingId(id);
    try {
      if (!accessToken) throw Object.assign(new Error('[Wallet] Auth required'), { code: 'AUTH_REQUIRED' });

      const downloadFn = type?.fullConfig?.format === 'mso_mdoc'
        ? downloadMdocCredential(issuer, type, accessToken)
        : VCSDK.credentials.download(issuer, type, accessToken);

      const result = await downloadFn;
      if (result === null) throw Object.assign(new Error('[Wallet] Auth required'), { code: 'AUTH_REQUIRED' });
      await loadCredentials();
    } catch (e) {
      throw e;
    } finally {
      setDownloadingId(null);
    }
  };

  const deleteCredential = async (vcId: string, isMdoc = false): Promise<void> => {
    if (isMdoc) {
      await (VCSDK.credentials as any).deleteMdoc?.(vcId);
    } else {
      await VCSDK.credentials.delete(vcId);
    }
    await loadCredentials();
  };

  return { credentials, downloadingId, ready, downloadCredential, loadCredentials, deleteCredential };
}
