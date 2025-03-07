import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Récupérer tous les NFTs qui sont listés à la vente
    const { data: nfts, error } = await supabase
      .from('nfts')
      .select(`
        *
      `)
      .eq('is_listed', true)
      .order('created_at', { ascending: false })
      console.group('Listed NFTs:', nfts)
    if (error) {
      console.error('Erreur lors de la récupération des NFTs:', error)
      return NextResponse.json(
        {
          success: false,
          error: "Erreur lors de la récupération des NFTs",
          details: error.message
        },
        { status: 500 }
      )
    }

    // Formater les NFTs pour l'affichage
    const formattedNfts = nfts.map(nft => ({
      id: nft.token_id,
      name: nft.name,
      image: nft.display_url,
      price: nft.price,
      collection: nft.collection,
      creator: nft.creator,
      owner: nft.owner_address,
      createdAt: nft.created_at,
      description: nft.description,
      attributes: nft.attributes || [],
      is_listed: nft.is_listed,
      sell_offer_index: nft.sell_offer_index
    }))

    return NextResponse.json({
      success: true,
      nfts: formattedNfts
    })

  } catch (error: any) {
    console.error('Erreur inattendue:', error)
    return NextResponse.json(
      {
        success: false,
        error: "Une erreur inattendue s'est produite",
        details: error.message
      },
      { status: 500 }
    )
  }
}