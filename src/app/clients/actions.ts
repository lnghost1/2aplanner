'use server';

import { revalidatePath } from 'next/cache';
import { getSupabase } from '../../lib/supabase';

export async function deleteClient(clientId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase não configurado");

  // Deleta os planos e assets primeiro para evitar violações de chave estrangeira 
  // (caso o banco não esteja com ON DELETE CASCADE)
  await supabase.from('content_plans').delete().eq('client_id', clientId);
  await supabase.from('client_assets').delete().eq('client_id', clientId);
  
  // Exclui o cliente
  const { error } = await supabase.from('clients').delete().eq('id', clientId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/clients');
  revalidatePath('/');
}
