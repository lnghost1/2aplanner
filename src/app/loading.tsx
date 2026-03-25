import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid var(--primary)', 
        borderTopColor: 'transparent', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Carregando 2A Planner...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
