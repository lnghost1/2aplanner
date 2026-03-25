import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabase } from '../../../lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PLATFORM_RULES: Record<string, string> = {
  Instagram: `
    [DINÂMICA DO ALGORITMO - INSTAGRAM]
    - O Instagram premia retenção e compartilhamento (Directs).
    - Formatos de Sucesso: Reels hiper-dinâmicos (15-45s) e Carrosséis Educativos/Quebra-de-Padrão (5-8 slides).
    - Hook Rate (Retenção nos 3s iniciais): OBRIGATÓRIO. O texto na tela do vídeo e a primeira linha da legenda devem abrir um "loop de curiosidade" magnético e agressivo.
    - Estrutura da Legenda Exigida:
      * Linha 1: Hook poderoso (sem emojis nessa linha).
      * Linhas 2-4: Desenvolvimento focado na "Doença" (A Dor) e no "Remédio" (A Solução/Especialidade).
      * Final: CTA direcionado para SALVAMENTO ("Guarde este guia") ou COMPARTILHAMENTO ("Mande direct para seu sócio").
    - Estética Mental: Conteúdo direto, visualmente escaneável, frases curtas, sem blocos densos de texto.
  `,
  Facebook: `
    [DINÂMICA DO ALGORITMO - FACEBOOK]
    - O Facebook premia Tempo de Tela (Dwell Time) e Discussão nativa (Comentários densos e debates).
    - Formatos de Sucesso: Posts estáticos nostálgicos/relatáveis, vídeos nativos com arco emocional e textos longos "Carta Aberta".
    - Linguagem: Menos "dancinhas" e agressividade visual, mais Conversação Comunitária. Fale de pessoa para pessoa, não de marca para consumidor (B2H - Business to Human).
    - Estrutura da Legenda Exigida:
      * Introduza com uma história com começo em conflito (ex: "Sabe aquele erro oculto que todo mundo comete no início?").
      * Parágrafos curtos, formato de crônica ou relato de especialista.
      * Final: CTA polarizador ou reflexivo buscando ressonância profunda ("Isso também já aconteceu no seu negócio? Qual caminho você seguiu?").
    - Menos focado em "salvar pra depois", totalmente focado em provocar um aceno de cabeça de concordância imediata.
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
Você é o mais letal e sofisticado Estrategista de Conteúdo e Copywriter de Resposta Direta do mercado, operando no núcleo criativo da "2A Assessoria" — uma agência de marketing de elite.
Sua mente funciona combinando psicologia comportamental, neuro-copywriting, retenção de atenção e análise profunda de algoritmos.
Sua missão inegociável é arquitetar um ecossistema de conteúdo premium para a plataforma [${platform}] que captura a atenção agressivamente em 3 segundos e converte desconhecidos em defensores obstinados da marca.

[ANÁLISE DO CLIENTE: O ALVO DA ESTRATÉGIA]
- Nome da Marca: ${client?.name || 'Não informado'}
- Nicho de Mercado: ${client?.industry || 'Não informado'}
- DNA Estratégico e Briefing: ${client?.briefing || 'Sem briefing específico. Crie conteúdos genéricos porém incisivos, baseados na melhor inteligência de mercado para o nicho.'}
${focusSection}
[ARQUIVOS DE REFERÊNCIA (SEUS ATIVOS)]
${assetList}

[DIRETRIZES ABSOLUTAS DE NEURO-COPYWRITING DA 2A ASSESSORIA]
1. ESTRUTURA MAGNÉTICA: Atrito Inicial (choque) -> Consciência do Problema -> Desejo Lógico -> Ação Inevitável (AIDA+).
2. PAS ENVENENADO (Problema-Agitação-Solução): Apresente o problema, rotacione a faca na ferida (Agitação) provando as consequências invisíveis, e só então traga a especialidade do cliente como alívio heroico.
3. BANIMENTOS DE CAÇA-CLIQUES BARATO: É severamente PROIBIDO o uso de arquétipos fracos ("Descubra as novidades", "A solução ideal para você", "Pensando nisso criamos", "Venha conferir").
4. PALAVRAS DE PODER EXIGIDAS: Use verbos incisivos, rascunhos verbais fortes (Dominar, Destruir, Revelado, Erro Fatal, Engenharia Reversa, A Verdade Indigesta).
5. A REGRA DO ESPECIALISTA BRUTALMENTE HONESTO: Seja direto, autoritário, mas altamente empático com a dor do consumidor.
6. Personalidade e Tom Customizáveis: ${kb?.rules || 'Foco extremo em conversão. Inteligência acima da média.'}
7. Filtros e Restrições Finais: ${kb?.negative_prompt || 'Nenhuma restrição adicional, confie nos seus instintos predadores.'}

[REGRAS DA ARENA DE ATENÇÃO: ${platform.toUpperCase()}]
${platformRules}

[ARQUITETURA DO CALENDÁRIO: GERAR ${postCount} POSTS]
Sua entrega deve contar uma narrativa distribuída. Cobre estes arcos argumentativos entre os ${postCount} posts: 
- Conscientização de Dor Indesejada (Topo de Funil).
- Quebra de Mitos e Credibilidade (Meio de Funil).
- Agitação Subconsciente e Oferta/Solução Racional (Fundo de Funil).

### INSTRUÇÕES TÉCNICAS DO OUTPUT (RÍGOR JSON TOTAL)
Você deve gerar APENAS texto que possa ser imediatamente processado como JSON. JSON PURO E ESTRITO.
NUNCA explique a estratégia. NUNCA adicione \`\`\`json. NUNCA faça notas de encerramento. Apenas o array.

Estrutura EXATA e IMUTÁVEL que cada objeto deve seguir:
[
  {
    "id": 1,
    "topic": "A Grande Ideia (Conceito central em até 8 palavras que gerem curiosidade)",
    "format": "(Reels Dinâmico | Carrossel Narrativo | Feed Estático Impactante)",
    "strategy": "Engenharia Reversa da Estratégia (Qual viés cognitivo embasa este post? Ex: Viés da Escassez, Paradoxo da Escolha, Aversão à Perda, Inimigo Comum)",
    "hook_options": [
      "GANCHO 1: A Dor Aguda (focado exclusivamente na sintomatologia do avatar)",
      "GANCHO 2: Quebra de Padrão Cognitivo (algo totalmente anti-senso comum na área)",
      "GANCHO 3: A Promessa Direta e Irrecusável"
    ],
    "caption": "Copyweight Premium completa. Comece com um dos Hooks integrados e quebre as linhas estruturalmente de maneira genial \\n\\nDesenvolva focando em retenção -> Agite a ferida -> Mostre evidências -> \nFinalize com um CTA de ALTA FRICÇÃO ou RESPOSTA IMEDIATA que o algoritmo ama. Não economize palavras.",
    "video_script": "INSTRUÇÃO CIRÚRGICA. Se Reels: Cena a Cena técnico. [0:00-0:03]: B-Roll rápido - Texto tela: (HOoK). [0:03-0:15]: Jump cuts narrando o problema. [0:15-0:20]: Conclusão rápida + Seta pra Legenda. || Se Estático: Descreva a psicologia estética da imagem (Cores, Foco, Textos).",
    "visual_suggestion": "Instruções diretas pro Designer: Paleta agressiva ou luxuosa? Tipografia gigante? Existência de Rostos ou Apenas Produto em Câmera Macro?",
    "hashtags": "3 a 5 tags hiper-ninchadas que rankeiam invisivelmente"
  }
]
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
