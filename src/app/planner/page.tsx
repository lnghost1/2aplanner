"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import styles from '../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Wand2 } from 'lucide-react';

export default function PlannerPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [month, setMonth] = useState('');
  const [postCount, setPostCount] = useState(12);
  const [campaignFocus, setCampaignFocus] = useState('');
  
  const [generating, setGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchClients() {
      const { data } = await supabase.from('clients').select('id, name');
      if (data) {
        setClients(data);
      }
    }
    fetchClients();
  }, []);

  const handleGenerate = async () => {
    if (!selectedClient || !month) {
      alert('Por favor, selecione o cliente e o mês para gerar o planejamento.');
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
          campaignFocus
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      
      setGeneratedPosts(data);
    } catch (error: any) {
      console.error(error);
      alert('Erro ao gerar posts: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
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
          <Link href="/knowledge" className={styles.navItem}>
            <BookOpen size={20} className={styles.navIcon} /> Base da IA
          </Link>
          <Link href="/planner" className={`${styles.navItem} ${styles.navItemActive}`}>
            <Calendar size={20} className={styles.navIcon} /> Planejador
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Planejador de Conteúdo AI</h1>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className={styles.btnPrimary} 
            style={{ backgroundColor: generating ? '#6b7280' : '#10b981' }}
          >
            <Wand2 size={18} style={{ marginRight: '8px' }} /> 
            {generating ? 'Pensando como um Estrategista...' : 'Gerar Posts'}
          </button>
        </header>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          
          <section className={styles.formSection} style={{ flex: '1', minWidth: '400px', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Configuração do Planejamento</h3>
            <div className={styles.clientForm}>
              
              <div className={styles.formGroup}>
                <label>Selecione o Cliente</label>
                <select 
                  className={styles.inputField}
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label>Mês / Ano</label>
                  <input 
                    type="month" 
                    className={styles.inputField} 
                    value={month} 
                    onChange={e => setMonth(e.target.value)} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Qtd. de Posts</label>
                  <input 
                    type="number" 
                    min="1" max="30" 
                    value={postCount} 
                    onChange={e => setPostCount(Number(e.target.value))} 
                    className={styles.inputField} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Foco Especial (Opcional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Ex: Foco na campanha de páscoa e odontopediatria..."
                  className={styles.textareaField}
                  value={campaignFocus}
                  onChange={e => setCampaignFocus(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className={styles.viewSection} style={{ flex: '2' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Prévia do Mês</h3>
            
            {!generatedPosts && !generating && (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--card-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>O calendário inteligente aparecerá aqui após a geração da IA.</p>
                </div>
              </div>
            )}

            {generating && (
               <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--card-border)', borderRadius: 'var(--radius-md)' }}>
                 <div style={{ textAlign: 'center', color: 'var(--primary)' }}>
                   <Wand2 size={48} style={{ marginBottom: '16px', animation: 'pulse 2s infinite' }} />
                   <p>A inteligência artificial está lendo o briefing e<br/>criando a estratégia perfeita...</p>
                 </div>
               </div>
            )}

            {generatedPosts && generatedPosts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {generatedPosts.map((post, idx) => (
                  <div key={idx} style={{ padding: '24px', backgroundColor: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '18px' }}>🗓️ {post.date}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, padding: '6px 12px', backgroundColor: '#222', border: '1px solid #444', borderRadius: '8px' }}>📺 {post.format}</span>
                    </div>
                    
                    <h4 style={{ fontSize: '18px', marginBottom: '12px', color: '#fff' }}>🎯 {post.theme}</h4>
                    <p style={{ fontWeight: 600, marginBottom: '16px', color: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                      🔥 Hook: &quot;{post.hook}&quot;
                    </p>
                    
                    <div style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                      {post.caption}
                    </div>
                    
                    <div style={{ padding: '16px', backgroundColor: 'rgba(224, 36, 36, 0.1)', borderLeft: '4px solid var(--primary)', borderRadius: '4px', fontSize: '14px' }}>
                      <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>🎨 Direção Visual e Design:</strong> 
                      <span style={{ color: '#e2e8f0' }}>{post.visual_direction}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </section>

        </div>
      </main>
    </div>
  );
}
