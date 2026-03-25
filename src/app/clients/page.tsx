import { getSupabase } from '../../lib/supabase';
import styles from '../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Search, Plus, Wand2, DollarSign } from 'lucide-react';

export const revalidate = 0; // Disable cache to always show newest clients

export default async function ClientsPage() {
  const supabase = getSupabase();
  if (!supabase) return <div>Erro de configuração (Supabase)</div>;

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch clients from Supabase:', error);
  }

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar_nav}>
        <div className={styles.logo}>
          2A <span>PLANNER</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>
            <Home size={20} className={styles.navIcon} /> Visão Geral
          </Link>
          <Link href="/clients" className={`${styles.navItem} ${styles.navItemActive}`}>
            <Users size={20} className={styles.navIcon} /> Clientes
          </Link>
          <Link href="/knowledge" className={styles.navItem}>
            <BookOpen size={20} className={styles.navIcon} /> Base da IA
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
          <h1 className={styles.title}>Clientes e Briefings</h1>
          <Link href="/clients/new" className={styles.btnPrimary}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Novo Cliente
          </Link>
        </header>

        <section className={styles.viewSection}>
          <div className={styles.searchBar}>
            <Search size={20} color="var(--text-muted)" />
            <input type="text" placeholder="Buscar cliente..." className={styles.searchInput} />
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome do Cliente</th>
                  <th>Status do Briefing</th>
                  <th>Criado Em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients?.map((client: any) => (
                  <tr key={client.id}>
                    <td>
                      <div className={styles.clientName}>{client.name}</div>
                      <div className={styles.clientIndustry}>{client.industry}</div>
                    </td>
                    <td>
                      <span className={styles.statusBadge} data-status={client.status === 'pending' ? 'pending' : 'complete'}>
                        {client.status === 'pending' ? 'Pendente' : 'Completo'}
                      </span>
                    </td>
                    <td>
                      {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <Link href={`/clients/${client.id}`} className={styles.actionBtn}>Ver Detalhes</Link>
                    </td>
                  </tr>
                ))}
                
                {(!clients || clients.length === 0) && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Você ainda não possui clientes cadastrados.<br/>
                      Clique em &quot;Novo Cliente&quot; para começar!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
