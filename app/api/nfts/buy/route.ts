import { NextResponse } from 'next/server';
import { NFTService } from '@/services/nft.service';
import { supabase } from '@/lib/supabase';

const nftService = new NFTService();

export async function POST(request: Request) {
  try {
    const { nftId, sell_offer_index, buyerAddress } = await request.json();

    if (!nftId || !sell_offer_index || !buyerAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required parameters",
          details: "nftId, sell_offer_index and buyerAddress are required"
        },
        { status: 400 }
      );
    }

    // Préparer la transaction d'achat
    const preparedTx = await nftService.prepareAcceptOfferTransaction(
      buyerAddress,
      sell_offer_index
    );

    // Créer un payload XUMM pour la signature
    const payload = await nftService.xumm.payload.create({
      txjson: preparedTx
    });

    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to create XUMM payload" 
        },
        { status: 500 }
      );
    }

    // Souscrire aux événements de la transaction
    const subscription = await nftService.xumm.payload.subscribe(payload.uuid, async (event) => {
      if (event.data.signed === true) {
        const result = await nftService.xumm.payload.get(payload.uuid);
        if (!result) return;
        
        const txHash = result.response.txid;
        if (!txHash) return;

        try {
          // Mettre à jour le NFT dans Supabase
          const { error: nftError } = await supabase
            .from('nfts')
            .update({
              owner_address: buyerAddress,
              is_listed: false,
              sell_offer_index: null,
              last_transaction_hash: txHash,
              price: '0'
            })
            .eq('token_id', nftId);

          if (nftError) {
            console.error('Error updating NFT:', nftError);
          }

        } catch (error) {
          console.error('Error processing buy transaction:', error);
        }
      }
    });

    // Retourner le QR code pour la signature
    return NextResponse.json({
      success: true,
      message: "Scan QR code to complete purchase",
      png: payload.refs.qr_png,
      uuid: payload.uuid
    });

  } catch (error: any) {
    console.error('Error in buy transaction:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process purchase",
        details: error.message 
      },
      { status: 500 }
    );
  }
}