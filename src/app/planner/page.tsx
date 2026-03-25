"use client";

import { useEffect, useState } from 'react';
import { getSupabase } from '../../lib/supabase';
import styles from '../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Wand2, Copy, Check, Globe, Share2, Save, DollarSign } from 'lucide-react';

export default function PlannerPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [month, setMonth] = useState('');
  const [postCount, setPostCount] = useState(12);
  const [campaignFocus, setCampaignFocus] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  
  const [generating, setGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<any[] | null>(null);
  const [activeTabs, setActiveTabs] = useState<{[key: number]: string}>({});
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
      
      // Inicializar abas
      const initialTabs: any = {};
      data.forEach((p: any) => initialTabs[p.id] = 'caption');
      setActiveTabs(initialTabs);
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
          <Link href="/planner" className={`${styles.navItem} ${styles.navItemActive}`}><Wand2 size={20} /> Planejador</Link>
          <Link href="/calendar" className={styles.navItem}><Calendar size={20} /> Calendário</Link>
          <Link href="/finance" className={styles.navItem}><DollarSign size={20} /> Financeiro</Link>
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
                <div 
                  className={`${styles.platformOption} ${platform === 'Instagram' ? styles.platformActive : ''}`}
                  onClick={() => setPlatform('Instagram')}
                >
                  <Globe size={16} /> Instagram / Reels
                </div>
                <div 
                  className={`${styles.platformOption} ${platform === 'Facebook' ? styles.platformActive : ''}`}
                  onClick={() => setPlatform('Facebook')}
                >
                  <Share2 size={16} /> Facebook
                </div>
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
              <div key={post.id || idx} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={styles.postTag}>Post #{idx + 1}</span>
                  <h3 className={styles.postTopic}>{post.topic}</h3>
                  {post.format && (
                    <span style={{ fontSize: '0.7rem', color: '#888', background: '#1a1a1a', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {post.format}
                    </span>
                  )}
                </div>
                
                <p className={styles.postStrategy}><strong>🎯 Estratégia:</strong> {post.strategy}</p>

                <div className={styles.postTabs}>
                  <button 
                    className={`${styles.tabButton} ${activeTabs[post.id] === 'hooks' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTabs({...activeTabs, [post.id]: 'hooks'})}
                  >
                    Ganchos
                  </button>
                  <button 
                    className={`${styles.tabButton} ${activeTabs[post.id] === 'caption' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTabs({...activeTabs, [post.id]: 'caption'})}
                  >
                    Legenda
                  </button>
                  <button 
                    className={`${styles.tabButton} ${activeTabs[post.id] === 'video' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTabs({...activeTabs, [post.id]: 'video'})}
                  >
                    Roteiro
                  </button>
                  <button 
                    className={`${styles.tabButton} ${activeTabs[post.id] === 'visual' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTabs({...activeTabs, [post.id]: 'visual'})}
                  >
                    Visual
                  </button>
                </div>

                <div className={styles.tabContent}>
                  {activeTabs[post.id] === 'hooks' && (
                    <div className={styles.hooksList}>
                      {post.hook_options?.map((h: string, i: number) => (
                        <div key={i} className={styles.hookItem}>
                          <span>{i+1}.</span> {h}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTabs[post.id] === 'caption' && (
                    <div className={styles.captionArea}>
                      <pre className={styles.captionText}>{post.caption}</pre>
                      <button 
                        className={styles.copyButtonSmall}
                        onClick={() => handleCopy(post.caption, idx)}
                      >
                        {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />} 
                        {copiedIndex === idx ? 'Copiado!' : 'Copiar Legenda'}
                      </button>
                    </div>
                  )}

                  {activeTabs[post.id] === 'video' && (
                    <div className={styles.videoArea}>
                      <pre className={styles.videoText}>{post.video_script}</pre>
                    </div>
                  )}

                  {activeTabs[post.id] === 'visual' && (
                    <div className={styles.visualArea}>
                      <p>{post.visual_suggestion}</p>
                    </div>
                  )}
                </div>

                <div className={styles.postFooter}>
                  <span className={styles.hashtags}>{post.hashtags}</span>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
