import { Client } from '@notionhq/client';

const notionApiKey = process.env.NOTION_API_KEY;

export const notion = new Client({
  auth: notionApiKey,
});

// IDs mapeados do Notion
export const NOTION_DBS = {
  CLIENTES: '305c434e-adca-81ff-8d59-dffccbfc8fd6',
  // Bunkers (paginas base)
  BUNKER_1: 'f3ac434e-adca-8384-9543-81c53dce0a11',
  BUNKER_2: 'd1ec434e-adca-820a-9770-01718bb787f8',
  BUNKER_3: '789c434e-adca-82bc-abca-812ed71be221',
  BUNKER_4: '94ac434e-adca-821d-8b80-0112adbaf8db',
  BUNKER_5: '6efc434e-adca-8284-970b-8100ea8e109e',
  BUNKER_6: '5b5c434e-adca-82ac-819c-017112308b80'
};

/**
 * Busca clientes do banco de dados principal de CLIENTES no Notion
 */
export async function getNotionClients() {
  if (!notionApiKey) return [];
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DBS.CLIENTES}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      console.error('Notion API error', response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    return data.results.map((page: any) => {
      // O nome do cliente quase sempre fica na propriedade root "Name" ou "Cliente"
      const props = page.properties;
      const nameKey = Object.keys(props).find(k => props[k].type === 'title');
      const nome = nameKey && props[nameKey].title[0] 
                   ? props[nameKey].title[0].plain_text 
                   : 'Cliente Sem Nome';
      
      return {
        id: page.id,
        name: nome,
        notionUrl: page.url
      };
    });
  } catch (error) {
    console.error("Erro ao buscar clientes no Notion:", error);
    return [];
  }
}

/**
 * Lê o conteúdo de um Bunker específico e seus blocos internos
 */
export async function getBunkerContent(pageId: string, depth = 0): Promise<string> {
  if (depth > 2) return '';
  let text = '';
  
  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28'
      }
    });
    
    if (!response.ok) return '';
    
    const data = await response.json();
    
    for (const block of data.results) {
      if ('type' in block) {
        const type = block.type as string;
        const blockAny = block as any;
        
        if (blockAny[type]?.rich_text) {
          text += blockAny[type].rich_text.map((rt: any) => rt.plain_text).join('') + '\n';
        } else if (type === 'child_page') {
          text += `\n>> [Bunker Sub-página: ${blockAny.child_page.title}]\n`;
          text += await getBunkerContent(block.id, depth + 1);
        } else if (block.has_children) {
          text += await getBunkerContent(block.id, depth + 1);
        }
      }
    }
  } catch (error) {
    console.error(`Erro lendo bunker (${pageId}):`, error);
  }
  
  return text;
}
