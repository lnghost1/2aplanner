"use client";

import { useEffect, useState, useMemo } from 'react';
import { getSupabase } from '../../lib/supabase';
import styles from '../page.module.css';
import calStyles from './calendar.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, ChevronLeft, ChevronRight, X, Instagram, Facebook, Wand2, DollarSign } from 'lucide-react';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface Post {
  id: number;
  topic: string;
  format?: string;
  strategy: string;
  caption: string;
  hook_options?: string[];
  video_script?: string;
  visual_suggestion?: string;
  hashtags?: string;
  scheduledDay?: number;
}

interface ContentPlan {
  id: string;
  client_id: string;
  platform: string;
  month: string;
  posts: Post[];
  status: string;
  created_at: string;
  clients?: { name: string };
}

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [plans, setPlans] = useState<ContentPlan[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedPost, setSelectedPost] = useState<{ post: Post; plan: ContentPlan } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const supabase = getSupabase();
      
      try {
        // Busca clientes oficiais da sua base do Notion
        const notionRes = await fetch('/api/notion/clients');
        const notionClients = await notionRes.json();
        
        // Busca o histórico de planejamentos salvos
        let plansData: any[] = [];
        if (supabase) {
          const { data } = await supabase.from('content_plans').select('*').order('created_at', { ascending: false });
          plansData = data || [];
        }

        // Injeta o nome do cliente do Notion no plano gerado
        const mappedPlans = plansData.map(plan => {
          const c = notionClients.find((cli: any) => cli.id === plan.client_id);
          return { ...plan, clients: { name: c ? c.name : 'Cliente Arquivado/Removido' } };
        });

        setClients(notionClients || []);
        setPlans(mappedPlans);
      } catch (e) { 
        console.error("Erro ao sincronizar Calendário com Notion/Supabase:", e); 
      }
      
      setLoading(false);
    };
    load();
  }, []);

  const monthKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;

  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      const matchMonth = p.month === monthKey;
      const matchClient = selectedClient === 'all' || p.client_id === selectedClient;
      return matchMonth && matchClient;
    });
  }, [plans, monthKey, selectedClient]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  // Distribute posts across days if no scheduledDay
  const postsByDay = useMemo(() => {
    const map: Record<number, { post: Post; plan: ContentPlan }[]> = {};
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    filteredPlans.forEach(plan => {
      const totalPosts = plan.posts.length;
      plan.posts.forEach((post, idx) => {
        const day = post.scheduledDay || Math.round(((idx + 1) / (totalPosts + 1)) * daysInMonth);
        const safeDay = Math.max(1, Math.min(day, daysInMonth));
        if (!map[safeDay]) map[safeDay] = [];
        map[safeDay].push({ post, plan });
      });
    });
    return map;
  }, [filteredPlans, viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const platformColor = (p: string) => p === 'Facebook' ? '#4267B2' : '#E1306C';
  const platformIcon = (p: string) => p === 'Facebook'
    ? <Facebook size={10} />
    : <Instagram size={10} />;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar_nav}>
        <div className={styles.logo}>2A <span>PLANNER</span></div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}><Home size={20} /> Visão Geral</Link>
          <Link href="/clients" className={styles.navItem}><Users size={20} /> Clientes</Link>
          <Link href="/planner" className={styles.navItem}><Wand2 size={20} /> Planejador</Link>
          <Link href="/calendar" className={`${styles.navItem} ${styles.navItemActive}`}><Calendar size={20} /> Calendário</Link>
          <Link href="/finance" className={styles.navItem}><DollarSign size={20} /> Financeiro</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Calendário de Conteúdo</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={selectedClient}
              onChange={e => setSelectedClient(e.target.value)}
              className={styles.inputField}
              style={{ width: 'auto', padding: '10px 16px' }}
            >
              <option value="all">Todos os Clientes</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Link href="/planner" className={styles.btnPrimary}>
              <Wand2 size={16} /> Novo Planejamento
            </Link>
          </div>
        </header>

        {/* Month Navigator */}
        <div className={calStyles.monthNav}>
          <button className={calStyles.navBtn} onClick={prevMonth}><ChevronLeft size={20} /></button>
          <h2 className={calStyles.monthTitle}>{MONTHS_PT[viewMonth]} {viewYear}</h2>
          <button className={calStyles.navBtn} onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>

        {/* Stats bar */}
        <div className={calStyles.statsBar}>
          <span className={calStyles.statItem}>
            <span className={calStyles.statNum}>{filteredPlans.reduce((acc, p) => acc + p.posts.length, 0)}</span>
            Posts planejados
          </span>
          <span className={calStyles.statItem}>
            <span className={calStyles.statNum}>{filteredPlans.length}</span>
            Planos ativos
          </span>
          <span className={calStyles.statItem}>
            <span className={calStyles.statNum}>{filteredPlans.filter(p => p.platform === 'Instagram').length}</span>
            Planos Instagram
          </span>
          <span className={calStyles.statItem}>
            <span className={calStyles.statNum}>{filteredPlans.filter(p => p.platform === 'Facebook').length}</span>
            Planos Facebook
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#666' }}>
            <Calendar size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <p>Carregando calendário...</p>
          </div>
        ) : (
          <div className={calStyles.grid}>
            {WEEKDAYS.map(day => (
              <div key={day} className={calStyles.weekdayHeader}>{day}</div>
            ))}
            {calendarDays.map((day, idx) => {
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const dayPosts = day ? (postsByDay[day] || []) : [];

              return (
                <div
                  key={idx}
                  className={`${calStyles.dayCell} ${!day ? calStyles.dayCellEmpty : ''} ${isToday ? calStyles.dayCellToday : ''}`}
                >
                  {day && (
                    <>
                      <span className={`${calStyles.dayNumber} ${isToday ? calStyles.dayNumberToday : ''}`}>{day}</span>
                      <div className={calStyles.postChips}>
                        {dayPosts.slice(0, 3).map(({ post, plan }, i) => (
                          <button
                            key={i}
                            className={calStyles.postChip}
                            style={{ borderLeftColor: platformColor(plan.platform) }}
                            onClick={() => setSelectedPost({ post, plan })}
                            title={post.topic}
                          >
                            <span className={calStyles.chipIcon} style={{ color: platformColor(plan.platform) }}>
                              {platformIcon(plan.platform)}
                            </span>
                            <span className={calStyles.chipText}>{post.topic}</span>
                          </button>
                        ))}
                        {dayPosts.length > 3 && (
                          <span className={calStyles.moreChip}>+{dayPosts.length - 3} posts</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {filteredPlans.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
            <Calendar size={48} style={{ opacity: 0.15, marginBottom: 16 }} />
            <p>Nenhum planejamento para <strong style={{ color: '#fff' }}>{MONTHS_PT[viewMonth]}</strong>.</p>
            <Link href="/planner" className={styles.btnPrimary} style={{ display: 'inline-flex', marginTop: 16 }}>
              <Wand2 size={16} /> Gerar Planejamento
            </Link>
          </div>
        )}
      </main>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className={calStyles.modalOverlay} onClick={() => setSelectedPost(null)}>
          <div className={calStyles.modal} onClick={e => e.stopPropagation()}>
            <button className={calStyles.modalClose} onClick={() => setSelectedPost(null)}><X size={20} /></button>

            <div className={calStyles.modalHeader}>
              <span className={calStyles.platformBadge} style={{ background: platformColor(selectedPost.plan.platform) }}>
                {platformIcon(selectedPost.plan.platform)} {selectedPost.plan.platform}
              </span>
              {selectedPost.plan.clients?.name && (
                <span className={calStyles.clientBadge}>{selectedPost.plan.clients.name}</span>
              )}
              {selectedPost.post.format && (
                <span className={calStyles.formatBadge}>{selectedPost.post.format}</span>
              )}
            </div>

            <h3 className={calStyles.modalTitle}>{selectedPost.post.topic}</h3>
            <p className={calStyles.modalStrategy}>🎯 {selectedPost.post.strategy}</p>

            {selectedPost.post.hook_options && (
              <div className={calStyles.modalSection}>
                <h4 className={calStyles.sectionTitle}>Ganchos</h4>
                {selectedPost.post.hook_options.map((h, i) => (
                  <div key={i} className={calStyles.hookItem}><span>{i + 1}.</span> {h}</div>
                ))}
              </div>
            )}

            <div className={calStyles.modalSection}>
              <h4 className={calStyles.sectionTitle}>Legenda</h4>
              <pre className={calStyles.captionPre}>{selectedPost.post.caption}</pre>
            </div>

            {selectedPost.post.hashtags && (
              <p className={calStyles.hashtags}>{selectedPost.post.hashtags}</p>
            )}

            {selectedPost.post.visual_suggestion && (
              <div className={calStyles.modalSection}>
                <h4 className={calStyles.sectionTitle}>Briefing Visual</h4>
                <p className={calStyles.visualText}>{selectedPost.post.visual_suggestion}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
