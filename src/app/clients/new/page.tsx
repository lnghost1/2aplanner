"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../../lib/supabase';
import styles from '../../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, ArrowLeft, Upload, X, File, Image as ImageIcon, Video } from 'lucide-react';

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    briefing: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      // 1. Insert Client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: formData.name,
          industry: formData.industry,
          briefing: formData.briefing,
          status: 'pending'
        }])
        .select()
        .single();

      if (clientError) throw clientError;

      // 2. Upload Files if any
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${client.id}/${Math.random()}.${fileExt}`;
          const filePath = `briefings/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('client-assets')
            .upload(filePath, file);

          if (uploadError) {
            console.error(`Error uploading ${file.name}:`, uploadError);
            continue;
          }

          // 3. Save Asset Reference
          await supabase.from('client_assets').insert([{
            client_id: client.id,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type
          }]);
        }
      }
      
      router.push('/clients');
      router.refresh();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Erro ao salvar o cliente e arquivos.');
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
            Novo Cliente (Briefing Completo)
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
              <label>Briefing Textual (Ton de Voz, Objetivos)</label>
              <textarea 
                rows={6} 
                placeholder="Descreva as informações que a IA precisa saber..."
                value={formData.briefing}
                onChange={e => setFormData({...formData, briefing: e.target.value})}
                className={styles.textareaField}
                required
              />
            </div>

            {/* Multimodal Upload Area */}
            <div className={styles.formGroup}>
              <label>Materiais de Apoio (Logo, PDF, Branding, Fotos)</label>
              <div className={styles.fileUploadArea}>
                <Upload size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '14px', fontWeight: '500' }}>Clique ou arraste arquivos aqui</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Suporta PDF, Imagens e Vídeos curtos</p>
                <input 
                  type="file" 
                  multiple 
                  className={styles.fileUploadInput} 
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,video/*"
                />
              </div>

              {files.length > 0 && (
                <div className={styles.fileList}>
                  {files.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {file.type.includes('image') ? <ImageIcon size={16} color="var(--primary)" /> : 
                         file.type.includes('video') ? <Video size={16} color="var(--primary)" /> : 
                         <File size={16} />}
                        <span>{file.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className={styles.removeFileBtn}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className={styles.btnPrimary} style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
              {loading ? 'Subindo arquivos e salvando...' : 'Finalizar Cadastro de Cliente'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
