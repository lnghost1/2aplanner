import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabase } from '../../../lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PLATFORM_RULES: Record<string, string> = {
  Instagram: `
    - Formato principal: Reels (15-60s) e Carrosséis.
    - Legenda: máximo 2.200 chars. Hook nas primeiras 2 linhas (antes do "mais").
    - Tom: Dinâmico, visual, com emojis estratégicos.
    - CTAs criativos: "Salva isso", "Manda pra quem precisa", "Comenta X".
    - Hashtags nicho: 3-5 ultra-específicas (evitar genéricas como #marketing).
  `,
  Facebook: `
    - Formato principal: Posts texto longo, vídeos nativos e eventos.
    - Legenda: pode ser mais longa e narrativa (400-600 chars ideais).
    - Tom: Mais conversacional e comunitário. Gera debate nos comentários.
    - CTAs de engajamento: "O que você acha?", "Conta aqui nos comentários", "Compartilha com alguém".
    - Hashtags: 1-3 apenas. Facebook penaliza excesso.
  `,
};

export async function POST(req: Request) {
  try {
    const { clientId, month, postCount = 4, platform = 'Instagram', campaignFocus } = await req.json();
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase offline' }, { status: 500 });

    const { data: client } = await supabase.from('clients').select('*').eq('id', clientId).single();
    const { data: kb } = await supabase.from('knowledge_base').select('*').maybeSingle();
    const { data: assets } = await supabase.from('client_assets').select('file_name, file_type').eq('client_id', clientId);

    const assetList = (assets || []).map((item: any) => `- ${item.file_name}`).join('\n') || 'Nenhum arquivo enviado.';
    const platformRules = PLATFORM_RULES[platform] || PLATFORM_RULES['Instagram'];
    const focusSection = campaignFocus ? `\n[FOCO DA CAMPANHA]\n${campaignFocus}\n` : '';

    const prompt = `
Você é o Diretor de Estratégia de Conteúdo da 2A Assessoria — uma agência de marketing premium.
Sua missão é criar um planejamento de conteúdo CIRÚRGICO e de ALTA CONVERSÃO para ${platform}.

[CLIENTE]
- Nome: ${client?.name || 'Não informado'}
- Nicho: ${client?.industry || 'Não informado'}
- Briefing Estratégico: ${client?.briefing || 'Sem briefing cadastrado.'}
${focusSection}
[ARQUIVOS DE REFERÊNCIA DO CLIENTE]
${assetList}

[REGRAS DE CÓPIA DA AGÊNCIA]
- Frameworks obrigatórios: ${kb?.copy_frameworks || 'AIDA, PAS, Storytelling'}
- Gatilhos mentais: Autoridade, Prova Social, Curiosidade Extrema, Urgência e Quebra de Padrão.
- Proibições absolutas: Evite clichês óbvios ("Clique no link da bio", "Segue a gente!"). Seja ousado e direto.
- Qualidade mínima: ${kb?.quality_filters || 'Todo post deve ter um hook irresistível nas primeiras 2 linhas.'}
- Tom de voz: ${kb?.master_prompt || 'Especialista, direto, sem rodeios. Combina autoridade com empatia.'}

[REGRAS ESPECÍFICAS PARA ${platform.toUpperCase()}]
${platformRules}

[MISSÃO: PLANEJAMENTO DE ${postCount} POSTS PARA ${month}]
Crie exatamente ${postCount} posts, distribuídos estrategicamente ao longo do mês.
Varie os formatos: misture posts de autoridade, educacionais, de prova social e de conversão.

Retorne APENAS um array JSON válido com EXATAMENTE ${postCount} objetos. Estrutura obrigatória:

[
  {
    "id": 1,
    "topic": "Título curto e impactante do Post",
    "format": "Reels | Carrossel | Post Estático | Vídeo Longo",
    "strategy": "Objetivo estratégico: por que estamos postando isso? (ex: Construir autoridade sobre X)",
    "hook_options": [
      "Gancho 1 (Curiosidade): frase que paralisa o scroll",
      "Gancho 2 (Dor/Urgência): frase que mexe com o problema do avatar",
      "Gancho 3 (Benefício Direto): frase que promete resultado claro"
    ],
    "caption": "Legenda COMPLETA e pronta para publicar. Estrutura: HOOK escolhido → Desenvolvimento (2-3 parágrafos) → CTA criativo.",
    "video_script": "Se Reels/Vídeo: Roteiro técnico cena a cena (Cena 1: [Ação] + [Fala] | Cena 2: ...). Se Post Estático: 'Apenas Legenda.'",
    "visual_suggestion": "Briefing detalhado para o designer/editor: cores, elementos visuais, texto na tela, ritmo de edição.",
    "hashtags": "#hashtag1 #hashtag2 #hashtag3"
  }
]

REGRA FINAL: Retorne APENAS o JSON puro. Zero texto antes ou depois. Zero markdown. Zero explicações.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    // Extract JSON robustly — handles markdown fences and extra text
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('A IA não retornou um JSON válido. Tente novamente.');

    const posts = JSON.parse(jsonMatch[0]);
    return NextResponse.json(posts);
  } catch (err: any) {
    console.error('[generate/route] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
