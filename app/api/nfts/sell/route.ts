import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const nftData = await request.json();
    
    // Simuler une vente réussie
    return NextResponse.json({
      success: true,
      message: "NFT mis en vente avec succès",
      nft: {
        id: Math.random().toString(36).substr(2, 9),
        ...nftData,
        createdAt: new Date().toISOString()
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la mise en vente" },
      { status: 400 }
    );
  }
}