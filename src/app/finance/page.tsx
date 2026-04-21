"use client";

import { useState } from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import { Home, Users, BookOpen, Calendar, Wand2, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, Plus, Filter, Wallet } from 'lucide-react';

const MOCK_FINANCES = [
  { id: 1, type: 'income', desc: 'Fee Mensal - Cliente X', category: 'Recorrente', amount: 3500.00, date: '2026-03-01', status: 'paid' },
  { id: 2, type: 'income', desc: 'Setup Inicial - Nova Drogaria', category: 'Serviço Único', amount: 1500.00, date: '2026-03-05', status: 'paid' },
  { id: 3, type: 'expense', desc: 'Ferramentas de IA (Claude/Gemini)', category: 'Software', amount: 250.00, date: '2026-03-10', status: 'paid' },
  { id: 4, type: 'expense', desc: 'Editor de Vídeo Freelance', category: 'Equipe', amount: 1200.00, date: '2026-03-15', status: 'pending' },
  { id: 5, type: 'income', desc: 'Gestão de Tráfego - E-commerce', category: 'Recorrente', amount: 4000.00, date: '2026-03-20', status: 'pending' },
];

export default function FinancePage() {
  const [filter, setFilter] = useState('all'); // all, income, expense
  
  const incomes = MOCK_FINANCES.filter(t => t.type === 'income');
  const expenses = MOCK_FINANCES.filter(t => t.type === 'expense');
  
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0.0';

  const displayedTransactions = MOCK_FINANCES.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar_nav}>
        <div className={styles.logo}>2A <span>PLANNER</span></div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}><Home size={20} /> Visão Geral</Link>
          <Link href="/clients" className={styles.navItem}><Users size={20} /> Clientes</Link>
          <Link href="/planner" className={styles.navItem}><Wand2 size={20} /> Planejador</Link>
          <Link href="/calendar" className={styles.navItem}><Calendar size={20} /> Calendário</Link>
          <Link href="/finance" className={`${styles.navItem} ${styles.navItemActive}`}><DollarSign size={20} /> Financeiro</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Controle Financeiro da Agência</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className={styles.btnSecondary} style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <ArrowUpRight size={18} /> Nova Receita
            </button>
            <button className={styles.btnSecondary} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <ArrowDownRight size={18} /> Nova Despesa
            </button>
          </div>
        </header>

        {/* Dashboard Financeiro */}
        <section className={styles.cardGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '40px' }}>
          <div className={styles.card} style={{ borderLeft: '4px solid #10b981' }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ color: '#888' }}>Receita Total (Mês)</h3>
              <ArrowUpRight size={20} color="#10b981" />
            </div>
            <p className={styles.cardValue} style={{ color: '#10b981' }}>
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={styles.card} style={{ borderLeft: '4px solid #ef4444' }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ color: '#888' }}>Despesas (Mês)</h3>
              <ArrowDownRight size={20} color="#ef4444" />
            </div>
            <p className={styles.cardValue} style={{ color: '#ef4444' }}>
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={styles.card} style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ color: '#888' }}>Lucro Líquido</h3>
              <Wallet size={20} color="var(--primary)" />
            </div>
            <p className={styles.cardValue} style={{ color: '#fff' }}>
              R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ color: '#888' }}>Margem de Lucro</h3>
              <TrendingUp size={20} color="#3b82f6" />
            </div>
            <p className={styles.cardValue} style={{ color: '#3b82f6' }}>
              {profitMargin}%
            </p>
          </div>
        </section>

        {/* Fluxo de Caixa Recente */}
        <div style={{ background: '#111', borderRadius: '16px', border: '1px solid #222', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>Fluxo de Caixa / Lançamentos</h2>
            <div style={{ display: 'flex', gap: '8px', background: '#0a0a0a', padding: '4px', borderRadius: '10px', border: '1px solid #222' }}>
              <button 
                onClick={() => setFilter('all')}
                style={{ background: filter === 'all' ? '#222' : 'transparent', color: filter === 'all' ? '#fff' : '#666', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >Todos</button>
              <button 
                onClick={() => setFilter('income')}
                style={{ background: filter === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'transparent', color: filter === 'income' ? '#10b981' : '#666', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >Receitas</button>
              <button 
                onClick={() => setFilter('expense')}
                style={{ background: filter === 'expense' ? 'rgba(239, 68, 68, 0.15)' : 'transparent', color: filter === 'expense' ? '#ef4444' : '#666', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >Despesas</button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Descrição / Cliente</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Categoria</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Data</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '16px', color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '8px', 
                      background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: t.type === 'income' ? '#10b981' : '#ef4444' 
                    }}>
                      {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    {t.desc}
                  </td>
                  <td style={{ padding: '16px', color: '#aaa', fontSize: '0.85rem' }}>
                    <span style={{ background: '#1a1a1a', padding: '4px 8px', borderRadius: '4px' }}>{t.category}</span>
                  </td>
                  <td style={{ padding: '16px', color: '#888', fontSize: '0.85rem' }}>
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {t.status === 'paid' ? (
                      <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Pago</span>
                    ) : (
                      <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Pendente</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              
              {displayedTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    Nenhum registro encontrado para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileBottomNav}>
        <Link href="/" className={styles.mobileNavItem}><Home size={22} /><span>Início</span></Link>
        <Link href="/clients" className={styles.mobileNavItem}><Users size={22} /><span>Clientes</span></Link>
        <Link href="/planner" className={styles.mobileNavItem}><Wand2 size={22} /><span>Planner</span></Link>
        <Link href="/calendar" className={styles.mobileNavItem}><Calendar size={22} /><span>Agenda</span></Link>
        <Link href="/finance" className={`${styles.mobileNavItem} ${styles.mobileNavItemActive}`}><DollarSign size={22} /><span>Financeiro</span></Link>
      </nav>
    </div>
  );
}
