import { NextResponse } from 'next/server';
import { USER_COLLECTION } from '../mock-data';

export async function GET() {
  // Simuler récupération de la collection de l'utilisateur
  return NextResponse.json({ nfts: USER_COLLECTION }, { status: 200 });
}