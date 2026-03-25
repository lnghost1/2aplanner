import { supabase } from '../lib/supabase';
import styles from "./page.module.css";
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Activity, Zap } from 'lucide-react';

export const revalidate = 0; // Disable cache so the dashboard is always live

export default async function Dashboard() {
  const { count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  const { count: pendingCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
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
          <Link href="/knowledge" className={styles.navItem}>
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
          <h1 className={styles.title}>Visão Geral</h1>
          <Link href="/clients/new" className={styles.btnPrimary}>
            + Novo Planejamento
          </Link>
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
              <h3 className={styles.cardTitle}>Briefings Pendentes (IA)</h3>
              <Zap size={20} color="var(--primary)" />
            </div>
            <p className={styles.cardValue}>{pendingCount || 0}</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Posts Gerados (Mês)</h3>
              <Activity size={20} color="var(--primary)" />
            </div>
            <p className={styles.cardValue}>0</p>
          </div>
        </section>
      </main>
    </div>
  );
}
