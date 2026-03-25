# 2A Planner — Mapa do Projeto

> Sistema interno de planejamento de conteúdo com IA para a 2A Assessoria.
> Para o mapa completo do kit de agentes, veja `.agent/ARCHITECTURE.md`.

---

## 🧭 Stack do Projeto

| Camada       | Tecnologia                         |
|--------------|------------------------------------|
| Frontend     | Next.js 14 (App Router)            |
| Estilo       | Vanilla CSS (CSS Modules) Dark Mode |
| Banco        | Supabase (PostgreSQL)              |
| IA           | Google Gemini API                  |
| Deploy       | Vercel                             |

---

## 📁 Estrutura de Diretórios

```
2a-planner/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Dashboard principal
│   │   ├── layout.tsx                # Layout global com sidebar
│   │   ├── globals.css               # Tema dark mode + variáveis CSS
│   │   ├── clients/
│   │   │   ├── page.tsx              # Listagem de clientes
│   │   │   ├── new/page.tsx          # Formulário de novo cliente
│   │   │   └── [id]/page.tsx         # Detalhes do cliente (Briefing, Histórico, Planejamento)
│   │   ├── knowledge/
│   │   │   └── page.tsx              # Base de conhecimento da IA
│   │   ├── planner/
│   │   │   └── page.tsx              # Planejador de conteúdo mensal com calendário
│   │   └── api/
│   │       └── generate/route.ts     # Endpoint de geração de conteúdo via IA
│   └── lib/
│       ├── supabase.ts               # Cliente Supabase
│       └── gemini.ts                 # Cliente Google Gemini AI
├── .agent/
│   ├── ARCHITECTURE.md               # Mapa completo do kit de agentes
│   ├── agents/                       # Agentes especialistas (20)
│   ├── skills/                       # Skills modulares (36+)
│   └── workflows/                    # Workflows de slash commands (11)
├── .env.local                        # Variáveis de ambiente (local)
├── ARCHITECTURE.md                   # Este arquivo
└── package.json
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas

| Tabela              | Descrição                                              |
|---------------------|--------------------------------------------------------|
| `clients`           | Clientes da assessoria (nicho, briefing, tom de voz)   |
| `knowledge_items`   | Base de conhecimento para treinar a IA                 |
| `generation_history`| Histórico de gerações por mês/ano por cliente          |
| `content_posts`     | Posts gerados (data, formato, copy, CTA, status)       |

---

## 🚦 Status dos Módulos

| Módulo                  | Status        |
|-------------------------|---------------|
| Dashboard               | ✅ Completo   |
| Cadastro de Clientes    | ✅ Completo   |
| Briefing do Cliente     | ✅ Completo   |
| Base de Conhecimento    | ✅ Completo   |
| Geração de Conteúdo IA  | ✅ Completo   |
| Calendário Visual       | ⬜ Pendente   |
| Editor Manual de Posts  | ⬜ Pendente   |
| Histórico com Contexto  | ⚠️ Parcial    |

---

## 🤖 Agentes Disponíveis (`.agent/agents/`)

- `especialista-frontend` — UI, componentes, CSS
- `especialista-backend` — API routes, Server Actions
- `arquiteto-de-banco-de-dados` — Schema Supabase, SQL
- `gerente-de-produto` — Planejamento, user stories
- `depurador` — Debug e análise de erros

---

## 🔑 Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

---

## ⚡ Comandos Rápidos

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Build de produção
npm run lint      # Executa o linter
```
