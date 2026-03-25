import { NextResponse } from 'next/server';
import { getGemini } from '../../../lib/gemini';
import { getSupabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = getSupabase();
  const ai = getGemini();

  try {
    const { clientId, month, postCount, campaignFocus } = await request.json();

    if (!supabase || !ai) {
      return NextResponse.json({ error: 'Sistema não inicializado (Chaves de API ausentes).' }, { status: 500 });
    }

    // 1. Fetch Client Data
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('name, industry, briefing')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: 'Erro ao buscar dados do cliente.' }, { status: 400 });
    }

    // 2. Fetch Knowledge Base (Superpowers)
    const { data: kb } = await supabase
      .from('knowledge_base')
      .select('*')
      .single();

    // 3. Fetch Client Assets (Context)
    const { data: assets } = await supabase
      .from('client_assets')
      .select('file_name, file_type')
      .eq('client_id', clientId);

    const assetList = assets?.map(a => `- ${a.file_name} (${a.file_type})`).join('\n') || 'Nenhum arquivo adicional anexado.';

    // 4. Build Multi-modal / Multi-framework Prompt
    const prompt = `
Você é um Especialista em Copywriting de Resposta Direta e Estrategista de Conteúdo sênior da 2A Assessoria.
Sua missão é criar um calendário editorial de elite, focando em gerar desejo imediato e autoridade inquestionável para o cliente.

[DADOS DO CLIENTE]
Nome: ${client.name}
Nicho: ${client.industry}
Briefing Estratégico:
${client.briefing}

[MATERIAIS DE APOIO ANALISADOS]
O cliente enviou os seguintes arquivos de branding que você deve considerar (estilo visual e tom):
${assetList}

[DIRETRIZES DA AGÊNCIA 2A (SUPERPODERES)]
Metodologias de Copy a serem aplicadas: ${kb?.copy_frameworks || 'AIDA, PAS, Storytelling'}
Regras de Ouro: ${kb?.rules}
Filtro de Qualidade (O que NÃO fazer): ${kb?.negative_prompt}

[DADOS DO PLANEJAMENTO]
Mês/Ano Alvo: ${month}
Quantidade: ${postCount} posts
${campaignFocus ? `Foco da Campanha: ${campaignFocus}` : ''}

[ESTRUTURA DE SAÍDA - RIGOROSA]
- Retorne APENAS um array JSON puro. SEM markdown.
- Cada objeto deve seguir esta estrutura:
  {
    "date": "Data (dd/mm - Dia)",
    "theme": "Raciocínio Estratégico (Pq este post hoje?)",
    "format": "Formato (Ex: Reels de Conexão, Carrossel Educativo)",
    "hook": "Headline/Gancho de IMPACTO (Superpoder de Copy)",
    "caption": "Legenda completa com Gatilhos Mentais e CTA forte",
    "visual_direction": "Instrução para design baseada nos materiais de apoio"
  }
`;

    // 5. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Optimization: Using 1.5-flash for reliability
      contents: prompt,
      config: {
        maxOutputTokens: 8192,
        temperature: kb?.temperature || 0.7,
      }
    });

    const text = response.text || "[]";
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) cleanedText = cleanedText.slice(7);
    if (cleanedText.startsWith('```')) cleanedText = cleanedText.slice(3);
    if (cleanedText.endsWith('```')) cleanedText = cleanedText.slice(0, -3);
    
    let generatedPosts = [];
    try {
      generatedPosts = JSON.parse(cleanedText.trim());
    } catch {
      console.error("JSON Parse Error. Data:", text);
      return NextResponse.json({ error: 'Falha na estruturação estratégica do conteúdo.' }, { status: 500 });
    }

    // 6. Update Client Status
    await supabase.from('clients').update({ status: 'complete' }).eq('id', clientId);

    return NextResponse.json(generatedPosts);
  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Erro Interno do Servidor' }, { status: 500 });
  }
}
