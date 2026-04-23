import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabase } from '../../../lib/supabase';
import { getBunkerContent, getNotionClients } from '../../../lib/notion';

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
    const { clientId, month, videoCount = 8, postCount = 4, campaignFocus, bunkerId } = await req.json();
    const supabase = getSupabase();
    
    const notionClients = await getNotionClients();
    const client = notionClients.find((c: any) => c.id === clientId) || { name: 'Cliente Não Selecionado', industry: 'Diversos' };
    
    const { data: kb } = await supabase?.from('knowledge_base').select('*').maybeSingle() || { data: null };

    const totalCount = videoCount + postCount;
    const focusSection = campaignFocus ? `\n[FOCO DA CAMPANHA]\n${campaignFocus}\n` : '';
    
    let bunkerContext = '';
    if (bunkerId) {
      const bContent = await getBunkerContent(bunkerId);
      bunkerContext = `\n[MÉTODO DO BUNKER DE ROTEIROS]\nOs seguintes roteiros foram extraídos da sua biblioteca de alta performance do Notion. USE-OS COMO INSPIRAÇÃO OBRIGATÓRIA PARA FORMATO E DINÂMICA:\n${bContent}\n`;
    }

    // EXTRAIR O BRIEFING DO CLIENTE DIRETAMENTE DA PÁGINA DELE NO NOTION
    let clientBriefing = '';
    if (clientId) {
      clientBriefing = await getBunkerContent(clientId);
    }

    const prompt = `
Você é o mais letal e sofisticado Estrategista de Conteúdo e Copywriter de Resposta Direta do mercado, operando no núcleo criativo da "2A Assessoria" — uma agência de marketing de elite.
Sua mente funciona combinando psicologia comportamental, neuro-copywriting, retenção de atenção e análise profunda de algoritmos.
Sua missão inegociável é arquitetar um ecossistema de conteúdo premium multiplataforma que captura a atenção agressivamente em 3 segundos e converte desconhecidos em defensores obstinados da marca.

[ANÁLISE DO CLIENTE: O ALVO DA ESTRATÉGIA]
- Nome da Marca: ${client.name}

[BRIEFING ESTRATÉGICO DO NOTION (DOR, TONS E PILARES DO CLIENTE)]
Aqui estão todas as anotações, referências e dados sobre o cliente extraídos da sua base de dados do Notion:
${clientBriefing || 'Sem anotações detalhadas.'}

${focusSection}
${bunkerContext}
[DIRETRIZES ABSOLUTAS DE NEURO-COPYWRITING DA 2A ASSESSORIA]
1. ESTRUTURA MAGNÉTICA: Atrito Inicial (choque) -> Consciência do Problema -> Desejo Lógico -> Ação Inevitável (AIDA+).
2. PAS ENVENENADO (Problema-Agitação-Solução): Apresente o problema, rotacione a faca na ferida (Agitação) provando as consequências invisíveis, e só então traga a especialidade do cliente como alívio heroico.
3. BANIMENTOS DE CAÇA-CLIQUES BARATO: É severamente PROIBIDO o uso de arquétipos fracos ("Descubra as novidades", "A solução ideal para você", "Pensando nisso criamos", "Venha conferir").
4. PALAVRAS DE PODER EXIGIDAS: Use verbos incisivos, rascunhos verbais fortes (Dominar, Destruir, Revelado, Erro Fatal, Engenharia Reversa, A Verdade Indigesta).
5. A REGRA DO ESPECIALISTA BRUTALMENTE HONESTO: Seja direto, autoritário, mas altamente empático com a dor do consumidor.
6. Personalidade e Tom Customizáveis: ${kb?.rules || 'Foco extremo em conversão. Inteligência acima da média.'}
7. Filtros e Restrições Finais: ${kb?.negative_prompt || 'Nenhuma restrição adicional, confie nos seus instintos predadores.'}

[REGRAS DA ARENA DE ATENÇÃO: HÍBRIDA]
Para Roteiros de VÍDEO (Reels/TikTok): Apele para hook visual em 3s, dinâmicas aceleradas (15-45s) e retenção nativa.
Para Roteiros de POSTS ESTÁTICOS (Instagram Carousel/Facebook): Apele para tempo de tela através da leitura, copy estruturada em blocos respiráveis B2H (Pessoa pra Pessoa) e forte peso emocional (Storytelling).

[ARQUITETURA DO CALENDÁRIO: GERAR EXACTAMENTE UM ARRAY COM ${totalCount} OBJETOS]
Você deve gerar EXATAMENTE ${totalCount} peças de conteúdo NESTE JSON, sendo OBRIGATORIAMENTE:
- ${videoCount} peças no formato "Vídeo Curto (Reels/TikTok)"
- ${postCount} peças no formato "Post Estático/Carrossel"

Sua entrega combinada deve contar uma narrativa distribuída entre essa contagem de Vídeos e Posts. Cobre estes arcos argumentativos: 
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

    // Cadeia de fallback de modelos — tenta o melhor primeiro, cai para o próximo em caso de 503
    const MODEL_CHAIN = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
    ];

    let raw = '';
    let lastError: any = null;

    for (const modelName of MODEL_CHAIN) {
      try {
        console.log(`[generate] Tentando modelo: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json"
          }
        });
        const result = await model.generateContent(prompt);
        raw = result.response.text();
        lastError = null;
        break; // Sucesso — para de tentar outros modelos
      } catch (modelErr: any) {
        const msg = modelErr?.message || '';
        const shouldFallback = msg.includes('503') || 
                               msg.includes('Service Unavailable') || 
                               msg.includes('high demand') ||
                               msg.includes('429') ||
                               msg.includes('quota') ||
                               msg.includes('Too Many Requests');
        
        if (shouldFallback) {
          console.warn(`[generate] ${modelName} falhou com erro recuperável (${msg}), tentando próximo modelo...`);
          lastError = modelErr;
          // Aguarda 1 segundo antes de tentar o próximo modelo (evitar rate limit massivo)
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        
        // Para erros críticos de syntax ou chave inválida, falha imediatamente
        throw modelErr;
      }
    }

    if (!raw) {
      throw lastError || new Error('Todos os modelos estão indisponíveis ou extrapolaram o limite de quota. Aguarde uns minutos e tente novamente.');
    }

    // Extrai JSON robusto — handles markdown fences e texto extra
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('A IA não retornou um JSON válido. Tente novamente.');

    const posts = JSON.parse(jsonMatch[0]);
    return NextResponse.json(posts);
  } catch (err: any) {
    console.error('[generate/route] Error:', err.message);
    
    // Mensagem de erro amigável para o usuário
    let userMessage = err.message;
    if (userMessage?.includes('503') || userMessage?.includes('high demand')) {
      userMessage = 'Os servidores da IA estão sobrecarregados agora. Aguarde 30 segundos e tente novamente.';
    } else if (userMessage?.includes('429') || userMessage?.includes('quota')) {
      userMessage = 'O limite de uso (quota) da API do Google Gemini estourou. Revise a conta do Google Cloud e tente de novo mais tarde.';
    }
    
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
