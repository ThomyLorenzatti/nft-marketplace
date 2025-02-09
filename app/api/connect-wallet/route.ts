import { NextResponse } from 'next/server';

export async function POST() {
  // Simuler une connexion réussie
  try {
    return NextResponse.json({ connected: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Méthode non autorisée' },
    { status: 405 }
  );
}