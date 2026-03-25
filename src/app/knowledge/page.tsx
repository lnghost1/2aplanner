"use client";

import { useState, useEffect } from 'react';
import { getSupabase } from '../../lib/supabase';
import styles from '../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Save, Sparkles, AlertCircle, Info, Wand2, DollarSign } from 'lucide-react';

export default function KnowledgeBasePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    id: '',
    rules: 'Atue como um Especialista em Social Media focado em conversão e branding de alto valor. Use uma linguagem magnética e profissional.',
    negative_prompt: 'Não utilize emojis excessivos. Evite gírias. Nunca invente dados.',
    temperature: 0.7,
    copy_frameworks: 'AIDA, PAS, Storytelling'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .single();

      if (data) {
        setSettings({
          id: data.id,
          rules: data.rules || '',
          negative_prompt: data.negative_prompt || '',
          temperature: data.temperature || 0.7,
          copy_frameworks: data.copy_frameworks || 'AIDA, PAS'
        });
      }
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const payload = {
        rules: settings.rules,
        negative_prompt: settings.negative_prompt,
        temperature: settings.temperature,
        copy_frameworks: settings.copy_frameworks
      };

      let error;
      if (settings.id) {
        const { error: updateError } = await supabase
          .from('knowledge_base')
          .update(payload)
          .eq('id', settings.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('knowledge_base')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      alert('Configurações salvas com sucesso!');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.container} style={{ padding: '48px', color: 'var(--text-muted)' }}>Carregando Base de Conhecimento...</div>;

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
          <Link href="/knowledge" className={`${styles.navItem} ${styles.navItemActive}`}>
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
          <h1 className={styles.title}>Superpoderes da IA (Base 2A)</h1>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
            <Save size={18} style={{ marginRight: '8px' }} /> {saving ? 'Salvando...' : 'Salvar Superpoderes'}
          </button>
        </header>

        <section className={styles.formSection} style={{ maxWidth: '100%', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          <div>
            <form className={styles.clientForm} onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--primary)" /> Prompt Mestre (Personalidade da 2A)
                </label>
                <textarea 
                  rows={8} 
                  className={styles.textareaField}
                  value={settings.rules}
                  onChange={e => setSettings({...settings, rules: e.target.value})}
                  placeholder="Defina como a IA deve se comportar..."
                />
              </div>
              
              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} color="#f59e0b" /> Filtro de Qualidade (O que NÃO fazer)
                </label>
                <textarea 
                  rows={4} 
                  className={styles.textareaField}
                  value={settings.negative_prompt}
                  onChange={e => setSettings({...settings, negative_prompt: e.target.value})}
                  placeholder="Proibições, termos banidos, etc..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Metodologias de Copy (Separe por vírgula)</label>
                <input 
                  type="text"
                  className={styles.inputField}
                  value={settings.copy_frameworks}
                  onChange={e => setSettings({...settings, copy_frameworks: e.target.value})}
                  placeholder="AIDA, PAS, Storytelling, 4 P's..."
                />
              </div>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div className={styles.card} style={{ backgroundColor: 'rgba(225, 29, 72, 0.03)', borderColor: 'var(--primary)' }}>
                <h3 className={styles.cardTitle} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} /> Guia de Superpoderes
                </h3>
                <ul style={{ fontSize: '13px', color: 'var(--text-color)', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '16px' }}>
                  <li><strong>Prompt Mestre:</strong> Injecte aqui a alma da 2A Assessoria.</li>
                  <li><strong>Frameworks:</strong> Ao citar AIDA, a IA focará em Atenção, Interesse, Desejo e Ação.</li>
                  <li><strong>Temperatura:</strong> 0.7 é o ideal para equilíbrio entre criatividade e estratégia.</li>
                </ul>
             </div>

             <div className={styles.card}>
                <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Temperatura da IA: {settings.temperature}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={settings.temperature} 
                  onChange={e => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                  style={{ width: '100%', accentColor: 'var(--primary)' }} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <span>Focado & Estratégico</span>
                  <span>Criativo & Ousado</span>
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
