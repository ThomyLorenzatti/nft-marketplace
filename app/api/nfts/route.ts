import { NextResponse } from 'next/server';
import { MOCK_NFTS } from '../mock-data';

export async function GET() {
  // Simuler récupération de tout les NFTs
  return NextResponse.json({ nfts: MOCK_NFTS }, { status: 200 });
}