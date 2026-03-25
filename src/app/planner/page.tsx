"use client";

import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabase';
import styles from '../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Wand2, Copy, Check, Globe, Share2, Save } from 'lucide-react';

export default function PlannerPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [month, setMonth] = useState('');
  const [postCount, setPostCount] = useState(12);
  const [campaignFocus, setCampaignFocus] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  
  const [generating, setGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<any[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data } = await supabase.from('clients').select('id, name');
      if (data) setClients(data);
    };
    loadClients();
  }, []);

  const handleGenerate = async () => {
    if (!selectedClient || !month) {
      alert('Selecione o cliente e o mês.');
      return;
    }
    
    setGenerating(true);
    setGeneratedPosts(null);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient,
          month,
          postCount,
          campaignFocus,
          platform
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
      setGeneratedPosts(data);
    } catch (error: any) {
      alert('Erro ao gerar: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSavePlan = async () => {
    const supabase = getSupabase();
    if (!supabase || !generatedPosts) return;

    const { error } = await supabase.from('content_plans').insert([{
      client_id: selectedClient,
      platform,
      month,
      posts: generatedPosts,
      status: 'saved'
    }]);

    if (error) alert('Erro ao salvar plano: ' + error.message);
    else alert('Plano salvo estrategicamente no histórico!');
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar_nav}>
        <div className={styles.logo}>2A <span>PLANNER</span></div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}><Home size={20} /> Visão Geral</Link>
          <Link href="/clients" className={styles.navItem}><Users size={20} /> Clientes</Link>
          <Link href="/knowledge" className={styles.navItem}><BookOpen size={20} /> Base da IA</Link>
          <Link href="/planner" className={`${styles.navItem} ${styles.navItemActive}`}><Calendar size={20} /> Planejador</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Planejador Premium</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            {generatedPosts && (
              <button onClick={handleSavePlan} className={styles.btnSecondary}>
                <Save size={18} /> Salvar no Histórico
              </button>
            )}
            <button 
              onClick={handleGenerate} 
              disabled={generating} 
              className={styles.btnPrimary}
            >
              <Wand2 size={18} /> {generating ? 'Criando Estratégia...' : 'Gerar Planejamento'}
            </button>
          </div>
        </header>

        <div className={styles.splitLayout}>
          {/* PAINEL LATERAL DE CONFIGURAÇÃO */}
          <section className={styles.sidebar}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#fff' }}>⚙️ Configuração</h3>
            
            <div className={styles.formGroup}>
              <label>Rede Social</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button 
                  onClick={() => setPlatform('Instagram')}
                  className={`${styles.copyButton} ${platform === 'Instagram' ? styles.postTag : ''}`}
                  style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Globe size={16} /> Instagram
                </button>
                <button 
                  onClick={() => setPlatform('LinkedIn')}
                  className={`${styles.copyButton} ${platform === 'LinkedIn' ? styles.postTag : ''}`}
                  style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Share2 size={16} /> LinkedIn
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Cliente</label>
              <select className={styles.inputField} value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
                <option value="">Selecione...</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Mês / Ano</label>
              <input type="month" className={styles.inputField} value={month} onChange={e => setMonth(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label>Posts por Mês</label>
              <input type="number" min="1" max="30" value={postCount} onChange={e => setPostCount(Number(e.target.value))} className={styles.inputField} />
            </div>

            <div className={styles.formGroup}>
              <label>Foco da Campanha</label>
              <textarea rows={4} className={styles.textareaField} value={campaignFocus} onChange={e => setCampaignFocus(e.target.value)} placeholder="Ex: Lançamento de produto X, Foco em autoridade..." />
            </div>
          </section>

          {/* ÁREA DE CONTEÚDO (RESULTADOS) */}
          <section className={styles.contentArea}>
            {!generatedPosts && !generating && (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#666' }}>
                <Calendar size={64} style={{ marginBottom: '20px', opacity: 0.2 }} />
                <p>Configure à esquerda e clique em <b>Gerar Planejamento</b>.</p>
              </div>
            )}

            {generating && (
              <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--accent-red)' }}>
                <Wand2 size={64} style={{ marginBottom: '20px', animation: 'pulse 2s infinite' }} />
                <p>Acelerando o motor de copy da 2A...</p>
              </div>
            )}

            {generatedPosts && generatedPosts.map((post: any, idx) => (
              <div key={idx} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={styles.postDateField}>📅 {post.date}</span>
                  <span className={styles.postTag}>{post.format}</span>
                </div>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>🎯 {post.theme}</h3>
                
                <div className={styles.strategyBox}>
                  <span className={styles.strategyLabel}>Gancho (Hook)</span>
                  <p style={{ fontWeight: 600 }}>{post.hook}</p>
                </div>

                <div className={styles.strategyBox}>
                  <span className={styles.strategyLabel}>Roteiro Estratégico</span>
                  <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{post.content_structure}</p>
                </div>

                <div className={styles.formGroup}>
                  <label>Legenda / Copy</label>
                  <div style={{ position: 'relative' }}>
                    <div className={styles.textareaField} style={{ minHeight: '100px', backgroundColor: '#050505', color: '#eee', padding: '12px' }}>
                      {post.caption}
                      <div className={styles.hashtags}>{post.hashtags}</div>
                      <div style={{ marginTop: '1rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>CTA: {post.cta}</div>
                    </div>
                    <button 
                      onClick={() => handleCopy(`${post.caption}\n\n${post.hashtags}\n\n${post.cta}`, idx)}
                      className={styles.copyButton}
                      style={{ position: 'absolute', top: '10px', right: '10px' }}
                    >
                      {copiedIndex === idx ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                  🎨 <b>Design:</b> {post.visual_direction}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
