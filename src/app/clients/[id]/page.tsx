import { getSupabase } from '../../../lib/supabase';
import styles from "../../page.module.css";
import Link from 'next/link';
import { ArrowLeft, User, Building, FileText, Image as ImageIcon, Video, File, Trash2, Zap, Calendar, Home, Users, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ClientDetail({ params }: { params: { id: string } }) {
  const supabase = getSupabase();
  if (!supabase) return <div>Configuração Necessária (Supabase)</div>;

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !client) {
    notFound();
  }

  const { data: assets } = await supabase
    .from('client_assets')
    .select('*')
    .eq('client_id', params.id);

  const { data: plans } = await supabase
    .from('content_plans')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false });

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/clients" className={styles.backBtn}>
              <ArrowLeft size={24} />
            </Link>
            <h1 className={styles.title}>{client.name}</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <span className={styles.statusBadge} data-status={client.status}>
                {client.status === 'pending' ? 'Básico' : 'Completo'}
             </span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Briefing Section */}
          <section className={styles.card} style={{ gap: '24px' }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> Briefing Estratégico
              </h3>
            </div>
            <div style={{ color: 'var(--text-color)', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
              {client.briefing || 'Nenhum briefing cadastrado.'}
            </div>

            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="var(--accent-red)" /> Histórico de Planos (IA)
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plans && plans.length > 0 ? (
                plans.map((plan: any) => (
                  <div key={plan.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{plan.platform} - {plan.month}</span>
                      <p style={{ fontSize: '12px', color: '#666' }}>{new Date(plan.created_at).toLocaleDateString()}</p>
                    </div>
                    <Link href={`/planner?planId=${plan.id}`} className={styles.btnSecondary} style={{ padding: '4px 12px', fontSize: '12px' }}>
                      Ver Plano
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: '#666' }}>Nenhum plano gerado ainda.</p>
              )}
            </div>
          </section>

          {/* Sidebar Info & Assets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} /> Detalhes
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Setor / Nicho</label>
                  <p style={{ fontWeight: '500' }}>{client.industry}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cadastrado em</label>
                  <p style={{ fontWeight: '500' }}>{new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <File size={18} /> Ativos / Referências
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assets && assets.length > 0 ? (
                  assets.map((asset: any) => (
                    <div key={asset.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
                      {asset.file_type.includes('image') ? <ImageIcon size={16} color="var(--primary)" /> : 
                       asset.file_type.includes('video') ? <Video size={16} color="var(--primary)" /> : <File size={16} />}
                      <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.file_name}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Nenhum arquivo enviado.</p>
                )}
                <button className={styles.btnPrimary} style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '8px' }}>
                  + Adicionar Arquivo
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
