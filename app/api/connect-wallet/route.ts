import { NextResponse } from 'next/server';

export async function POST() {
  // Simuler une connexion réussie
  try {
    return NextResponse.json({
      connected: true,
      message: 'Connexion réussie',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    connected: false,
    error: 'Méthode non autorisée',
    message: 'Veuillez utiliser une requête POST pour la connexion'
  }, { status: 405 });
}