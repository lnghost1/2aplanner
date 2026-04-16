import { NextResponse } from 'next/server';
import { getNotionClients } from '../../../../lib/notion';

export async function GET() {
  try {
    const clients = await getNotionClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Notion Clients API Error:", error);
    return NextResponse.json({ error: "Failed to fetch clients from Notion" }, { status: 500 });
  }
}
