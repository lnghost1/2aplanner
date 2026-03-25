import styles from '../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Save } from 'lucide-react';

export default function KnowledgeBasePage() {
  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          2A <span>PLANNER</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>
            <Home size={20} className={styles.navIcon} /> Visão Geral
          </Link>
          <Link href="/clients" className={styles.navItem}>
            <Users size={20} className={styles.navIcon} /> Clientes
          </Link>
          <Link href="/knowledge" className={`${styles.navItem} ${styles.navItemActive}`}>
            <BookOpen size={20} className={styles.navIcon} /> Base da IA
          </Link>
          <Link href="/planner" className={styles.navItem}>
            <Calendar size={20} className={styles.navIcon} /> Planejador
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Base de Conhecimento da IA</h1>
          <button className={styles.btnPrimary}>
            <Save size={18} style={{ marginRight: '8px' }} /> Salvar Alterações
          </button>
        </header>

        <section className={styles.formSection} style={{ maxWidth: '100%' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Defina as regras gerais, metodologias da 2A Assessoria e o tom de voz padrão que a IA utilizará para gerar conteúdo.
          </p>

          <form className={styles.clientForm}>
            <div className={styles.formGroup}>
              <label>Regras de Geração (Prompt Base)</label>
              <textarea 
                rows={6} 
                placeholder="Ex: Atue como um social media sênior..."
                className={styles.textareaField}
                defaultValue="Atue como um Especialista em Social Media focado em conversão e branding de alto valor. Siga as estruturas de copywriting AIDA e PAS."
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>O que NÃO fazer (Negative Prompt)</label>
              <textarea 
                rows={4} 
                placeholder="Ex: Não usar emojis excessivos, não usar palavras como 'Imperdível'..."
                className={styles.textareaField}
                defaultValue="Não utilize emojis excessivos. Evite linguagem muito informal (gírias de internet). Nunca invente dados ou promessas irreais."
              />
            </div>

            <div className={styles.formGroup} style={{ display: 'flex', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <label>Temperatura da IA (Criatividade)</label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <span>Focado & Analítico</span>
                  <span>Criativo & Espontâneo</span>
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
