"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from '../../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, ArrowLeft } from 'lucide-react';

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    briefing: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('clients').insert([{
        name: formData.name,
        industry: formData.industry,
        briefing: formData.briefing,
        status: 'pending'
      }]);

      if (error) throw error;
      
      router.push('/clients');
      router.refresh();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Erro ao salvar o cliente.');
    } finally {
      setLoading(false);
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
          <Link href="/clients" className={`${styles.navItem} ${styles.navItemActive}`}>
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

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <Link href="/clients" className={styles.backBtn}><ArrowLeft size={24} /></Link>
            Novo Cliente
          </h1>
        </header>

        <section className={styles.formSection}>
          <form className={styles.clientForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Nome do Cliente</label>
              <input 
                type="text" 
                placeholder="Ex: Tech Solutions BR" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
                className={styles.inputField} 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Setor / Nicho</label>
              <input 
                type="text" 
                placeholder="Ex: Tecnologia B2B" 
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
                required 
                className={styles.inputField} 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Briefing (Tom de Voz, Identidade, Público Alvo)</label>
              <textarea 
                rows={8} 
                placeholder="Descreva as informações que a IA precisa saber sobre este cliente..."
                value={formData.briefing}
                onChange={e => setFormData({...formData, briefing: e.target.value})}
                className={styles.textareaField}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary} style={{ marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
