import { getSupabase } from '../lib/supabase';
import styles from "./page.module.css";
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Activity, Zap, Wand2, DollarSign } from 'lucide-react';

export const revalidate = 0;

export default async function Dashboard() {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      return (
        <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
          <div>
            <h1 style={{ color: 'var(--primary)' }}>2A Planner - Configuração Pendente</h1>
            <p>Por favor, adicione as variáveis de ambiente <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no painel da Vercel.</p>
          </div>
        </div>
      );
    }

    const { count: clientsCount, error: error1 } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    const { count: pendingCount, error: error2 } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { data: plansData, error: error3 } = await supabase
      .from('content_plans')
      .select('posts');

    const postsCount = (plansData || []).reduce((acc: number, p: any) => {
      return acc + (Array.isArray(p.posts) ? p.posts.length : 0);
    }, 0);

    if (error1 || error2 || error3) {
      throw new Error(`Erro Supabase: ${error1?.message || error2?.message || error3?.message}`);
    }

    return (
      <div className={styles.container}>
        {/* Sidebar Navigation */}
        <aside className={styles.sidebar_nav}>
          <div className={styles.logo}>
            2A <span>PLANNER</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={`${styles.navItem} ${styles.navItemActive}`}>
              <Home size={20} className={styles.navIcon} /> Visão Geral
            </Link>
            <Link href="/clients" className={styles.navItem}>
              <Users size={20} className={styles.navIcon} /> Clientes
            </Link>
            <Link href="/planner" className={styles.navItem}>
              <Wand2 size={20} className={styles.navIcon} /> Planejador
            </Link>
            <Link href="/calendar" className={styles.navItem}>
              <Calendar size={20} className={styles.navIcon} /> Calendário
            </Link>
            <Link href="/finance" className={styles.navItem}>
              <DollarSign size={20} className={styles.navIcon} /> Financeiro
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>Visão Geral</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/clients/new" className={styles.btnPrimary}>
                + Novo Cliente
              </Link>
            </div>
          </header>

          <section className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Clientes Cadastrados</h3>
                <Users size={20} color="var(--primary)" />
              </div>
              <p className={styles.cardValue}>{clientsCount || 0}</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Briefings Pendentes</h3>
                <Zap size={20} color="var(--primary)" />
              </div>
              <p className={styles.cardValue}>{pendingCount || 0}</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Posts Gerados</h3>
                <Activity size={20} color="var(--primary)" />
              </div>
              <p className={styles.cardValue}>{postsCount}</p>
            </div>
          </section>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className={styles.mobileBottomNav}>
          <Link href="/" className={`${styles.mobileNavItem} ${styles.mobileNavItemActive}`}><Home size={22} /><span>Início</span></Link>
          <Link href="/clients" className={styles.mobileNavItem}><Users size={22} /><span>Clientes</span></Link>
          <Link href="/planner" className={styles.mobileNavItem}><Wand2 size={22} /><span>Planner</span></Link>
          <Link href="/calendar" className={styles.mobileNavItem}><Calendar size={22} /><span>Agenda</span></Link>
          <Link href="/finance" className={styles.mobileNavItem}><DollarSign size={22} /><span>Financeiro</span></Link>
        </nav>
      </div>
    );
  } catch (error: any) {
    console.error("Dashboard Error:", error);
    throw error; // Let the global error.tsx handle it
  }
}
