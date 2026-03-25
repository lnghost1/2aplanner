import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabase } from '../../../lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { clientId, month, platform } = await req.json();
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase offline' }, { status: 500 });

    const { data: client } = await supabase.from('clients').select('*').eq('id', clientId).single();
    const { data: kb } = await supabase.from('knowledge_base').select('*').maybeSingle();
    const { data: assets } = await supabase.from('client_assets').select('file_name, file_type').eq('client_id', clientId);

    // VARIAVEL NOVA PARA TESTAR SINCRO
    const assetListULTRA_FIX = (assets || []).map((item: any) => `- ${item.file_name}`).join('\n');

    const prompt = `Gere plano para ${client?.name} no ${platform} para ${month}. Regras: ${kb?.copy_frameworks}. Contexto: ${assetListULTRA_FIX}`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
