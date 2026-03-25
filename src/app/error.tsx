'use client';

import { useEffect } from 'react';
import styles from './page.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Ops! Algo deu errado.</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '500px' }}>
        Ocorreu um erro no servidor. Verifique se as variáveis de ambiente (Supabase e Gemini) foram configuradas corretamente na Vercel.
      </p>
      <div style={{ padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '24px', textAlign: 'left', width: '100%', maxWidth: '600px', overflowX: 'auto' }}>
        <code style={{ color: '#ff4d4d', fontSize: '14px' }}>
          {error.message || 'Erro desconhecido'}
          {error.digest && <div style={{ marginTop: '8px', color: '#888' }}>Digest: {error.digest}</div>}
        </code>
      </div>
      <button
        onClick={() => reset()}
        className={styles.btnPrimary}
      >
        Tentar novamente
      </button>
    </div>
  );
}
