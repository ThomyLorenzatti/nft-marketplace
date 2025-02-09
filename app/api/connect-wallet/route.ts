import { NextResponse } from 'next/server';

export async function POST() {
  // Simuler une connexion réussie
  return NextResponse.json({ connected: true });
}