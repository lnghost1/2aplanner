import { NextResponse } from 'next/server';
import { getNotionClients } from '../../../../lib/notion';
import { getSupabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    // Tenta buscar do Notion primeiro
    const notionClients = await getNotionClients();
    
    // Se retornou clientes do Notion, usa eles
    if (notionClients && notionClients.length > 0) {
      return NextResponse.json(notionClients);
    }
    
    // Fallback: busca clientes do Supabase se Notion não retornar nada
    console.warn("Notion returned empty list. Falling back to Supabase clients.");
    const supabase = getSupabase();
    if (supabase) {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (!error && clients && clients.length > 0) {
        // Map to same format expected by frontend
        return NextResponse.json(clients.map((c: any) => ({
          id: c.id,
          name: c.name,
          notionUrl: null
        })));
      }
    }

    // Se ambos falharem, retorna lista vazia com mensagem
    return NextResponse.json([]);
  } catch (error) {
    console.error("Clients API Error:", error);
    return NextResponse.json([], { status: 200 }); // Retorna vazio sem quebrar o front
  }
}
