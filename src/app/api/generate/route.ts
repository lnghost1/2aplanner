import { NextResponse } from 'next/server';
import { ai } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { clientId, month, postCount, campaignFocus } = await request.json();

    // 1. Fetch Client Briefing from Supabase
    // We check if supabase is initialized (not null from our guard in lib/supabase.ts)
    if (!supabase) {
      return NextResponse.json({ error: 'Sistema de banco de dados não inicializado.' }, { status: 500 });
    }

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('name, industry, briefing')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: 'Erro ao buscar dados do cliente.' }, { status: 400 });
    }

    // 2. Build our comprehensive prompt structure
    const prompt = `
Você é um Estrategista de Conteúdo sênior de uma agência de marketing (2A Assessoria).
Sua tarefa é criar um calendário mensal de conteúdo para redes sociais de altíssima conversão.

[DADOS DO CLIENTE]
Nome: ${client.name}
Nicho: ${client.industry}
Briefing completo e regras de marca ditadas pelo cliente:
${client.briefing}

[DADOS DO PLANEJAMENTO]
Mês/Ano Alvo: ${month}
Quantidade Solicitada de Posts: ${postCount}
${campaignFocus ? `Foco Adicional da Campanha: ${campaignFocus}` : ''}

[DIRETRIZES TÉCNICAS E DE SAÍDA - CRÍTICO]
- A escrita DEVE ser cativante, persuasiva e gerar autoridade instantânea.
- Sem genéricos. Mergulhe fundo nas dores mapeadas no briefing.
- Você DEVE retornar **UNICAMENTE** um array JSON válido. SEM marcação markdown (\`\`\`json), SEM texto explicativo antes e SEM nada depois. APENAS O ARRAY JSON PURO.
- O array DEVE conter exatamente ${postCount} objetos com a estrutura exata abaixo:

[
  {
    "date": "Data e dia sugerido Ex: 12/04 - Terça",
    "theme": "O raciocínio estratégico / Tema central daquele post",
    "format": "Formato sugerido (Ex: Reels Dinâmico, Carrossel de Dicas, Post Estático de Autoridade)",
    "hook": "Uma Headline agressiva ou Hook para prender a atenção (Ex: 'Você perde clientes todos os dias porque...')",
    "caption": "A legenda em si COMPLETA, pronta para copiar e colar. Use emojis. Aplique gatilhos mentais baseados no briefing. Tamanho entre 1 e 3 parágrafos curtos. Finalize sempre com CTAs claros da marca.",
    "visual_direction": "Instrução cirúrgica para o designer/editor (Ex: Câmera fechada no rosto, iluminação escurecida, letras em amarelo / Arte com o Dr. segurando um molde e fundo roxo com o título grande)"
  }
]
`;

    // 3. Call Gemini using flash 2.5
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      }
    });

    const text = response.text || "[]";
    let cleanedText = text.trim();
    
    // Clean JSON decorators if AI includes them despite instructions
    if (cleanedText.startsWith('```json')) cleanedText = cleanedText.slice(7);
    if (cleanedText.startsWith('```')) cleanedText = cleanedText.slice(3);
    if (cleanedText.endsWith('```')) cleanedText = cleanedText.slice(0, -3);
    
    let generatedPosts = [];
    try {
      generatedPosts = JSON.parse(cleanedText.trim());
    } catch {
      console.error("Falha ao organizar o JSON da Inteligência Artificial", text);
      return NextResponse.json({ error: 'Erro crítico na formatação da saída da IA.' }, { status: 500 });
    }

    // 4. Update the Client Status to reflect that the briefing has been used!
    await supabase.from('clients').update({ status: 'complete' }).eq('id', clientId);

    return NextResponse.json(generatedPosts);
  } catch (error: any) {
    console.error('Error generating with Gemini:', error);
    return NextResponse.json({ error: error.message || 'Erro Interno do Servidor' }, { status: 500 });
  }
}
