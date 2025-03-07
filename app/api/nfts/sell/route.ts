import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { nftId, price, sellerAddress } = await request.json();
    
    // Mettre à jour le NFT
    const { error: nftError } = await supabase
      .from('nfts')
      .update({ 
        is_listed: true,
        price: price
      })
      .eq('token_id', nftId);

    if (nftError) throw nftError;

    // Récupérer les NFTs en vente actuels de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('selling')
      .eq('xrp_address', sellerAddress)
      .single();

    if (userError) throw userError;

    // Ajouter le nouveau NFT à la liste des NFTs en vente
    const currentSelling = userData?.selling || [];
    const updatedSelling = [...currentSelling, { nftId, price }];

    // Mettre à jour la liste des NFTs en vente de l'utilisateur
    const { error: updateError } = await supabase
      .from('users')
      .update({ selling: updatedSelling })
      .eq('xrp_address', sellerAddress);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "NFT mis en vente avec succès"
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la mise en vente:', error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la mise en vente" },
      { status: 500 }
    );
  }
}