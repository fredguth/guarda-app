import { useEffect, useState } from 'react';
import { VCSDK } from 'vc-sdk-headless';

export interface IssuerSection {
  title: string;
  issuer: any;
  data: any[];
}

async function fetchIssuers(): Promise<IssuerSection[]> {
  try {
    const list = await VCSDK.issuers.getAll();
    const result: IssuerSection[] = [];
    for (const issuer of list) {
      if (!/mgi/i.test(issuer.id)) continue;
      const types = await VCSDK.issuers.getCredentialTypes(issuer.id);
      const filtered = types.filter((t: any) => /maioridade/i.test(t.name || t.id));
      if (filtered.length > 0) result.push({ title: issuer.name || issuer.id, issuer, data: filtered });
    }
    return result;
  } catch {
    return [];
  }
}

export function useIssuers(enabled: boolean) {
  const [sections, setSections] = useState<IssuerSection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    fetchIssuers()
      .then(setSections)
      .finally(() => setLoading(false));
  }, [enabled]);

  return { sections, loading };
}
