import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nftId } = await request.json();
    
    // Simuler un achat réussi
    return NextResponse.json({
      success: true,
      message: "NFT acheté avec succès",
      transactionHash: "0x" + Math.random().toString(36).substr(2, 32)
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'achat" },
      { status: 400 }
    );
  }
}